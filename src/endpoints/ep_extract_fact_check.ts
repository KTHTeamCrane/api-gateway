import { extractFromHtml } from "@extractus/article-extractor";
import { Request, Response } from "express";
import { log } from "../log";
import {
    llm_get_claims_with_excerpts,
    llm_verify_article_with_sources_multirun
} from "../api/llm_api";
import { ArticleEntry, retrieval_get_articles, retrieval_get_politifact } from "../api/retrieval_api";

export default async function ep_extract_fact_check(req: Request, res: Response) {
    log.info("Received request at /api/article/extract-and-fact-check");
    try {
        const article_text = (await article_extract(req.body.article_html)).content;

        if (article_text == null) {
            res.status(400).send("Article is null");
            return;
        }

        const claims = await llm_get_claims_with_excerpts(article_text);
        const politifactSources = await retrieval_get_politifact(claims.map((c) => c.claim));
        const articleSources: Record<string, ArticleEntry[]> = {}

        for (const claim of claims) {
            const sources = await retrieval_get_articles(
                article_text,
                // Gonna try using just the first 30 characters of the claim to get better search results
                req.body.article_title,
                req.body.article_url,
                claim.claim.substring(0, 30)
            );
            articleSources[claim.claim] = sources.sources;
        }

        const checks = await llm_verify_article_with_sources_multirun(
            article_text,
            claims,
            politifactSources.sources,
            articleSources,
        );

        // Insert the corresponding article sources into the checks
        for (const check of checks) {
            const checkArticleSources = articleSources[check.CLAIM];
            const checkPolitifactSources = politifactSources.sources[check.CLAIM];

            for (const src of check.SOURCES) {
                if (src.type === "ARTICLE") {
                    const articleSource = checkArticleSources[src.source_idx]

                    if (articleSource) {
                        src.source_title = articleSource.title;
                        src.source_publisher = articleSource.publisher;
                        src.url = articleSource.url;
                    } else {
                        log.warn(`Could not find article source for ${check.CLAIM}. (Index: ${src.source_idx})`);
                    }
                } else if (src.type === "POLITIFACT") {
                    const politifactSource = checkPolitifactSources[src.source_idx];

                    if (politifactSource) {
                        src.source_title = politifactSource.body;
                        src.source_publisher = "Politifact";
                        src.url = politifactSource.url;
                    } else {
                        log.warn(`Could not find politifact source for ${check.CLAIM}. (Index: ${src.source_idx})`);
                    }
                }
            }
        }

        res.json(checks);
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
}

// TODO: Write tests for this function
export async function article_extract(articleHTML: string) {
    let article = await extractFromHtml(articleHTML);
    if (article == null) throw "Article is null"
    return article
}


