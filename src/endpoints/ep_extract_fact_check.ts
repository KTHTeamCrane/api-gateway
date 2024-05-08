import { extractFromHtml } from "@extractus/article-extractor";
import { Request, Response } from "express";
import { log } from "../log";
import {
    llm_get_claims,
    llm_get_claims_with_excerpts,
    llm_verify_article_with_sources,
    llm_verify_article_with_sources_multirun
} from "../api/llm_api";
import { retrieval_get_articles, retrieval_get_politifact } from "../api/retrieval_api";

export default async function ep_extract_fact_check(req: Request, res: Response) {
    log.info("Received request at /api/article/extract-and-fact-check");
    try {
        const article_text = (await article_extract(req.body.article_html)).content;

        if (article_text == null) {
            res.status(400).send("Article is null");
            return;
        }

        const claims = await llm_get_claims_with_excerpts(article_text);
        const politifact_sources = await retrieval_get_politifact(claims.map((c) => c.claim));
        const article_sources: Record<string, string[]> = {}

        for (const claim of claims) {
            const sources = await retrieval_get_articles(
                article_text,
                // Gonna try using just the first 30 characters of the claim to get better search results
                req.body.article_title.substring(0, 30),
                req.body.article_url,
                claim.claim.substring(0, 30)
            );
            article_sources[claim.claim] = sources.sources;
        }

        const checks = await llm_verify_article_with_sources_multirun(
            article_text,
            claims,
            politifact_sources.sources,
            article_sources,
        );

        res.json(checks);
    } catch (e) {
        console.log(e)
        res.sendStatus(500);
    }
}

// TODO: Write tests for this function
export async function article_extract(articleHTML: string) {
    let article = await extractFromHtml(articleHTML);
    if (article == null) throw "Article is null"
    return article
}


