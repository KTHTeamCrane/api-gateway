import { extractFromHtml } from "@extractus/article-extractor";
import { Request, Response } from "express";
import { log } from "../log";
import {
    llm_get_claims_with_excerpts,
    llm_verify_article_with_sources_multirun,
    parseArticleSources
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

        parseArticleSources(checks, articleSources, politifactSources.sources);

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


