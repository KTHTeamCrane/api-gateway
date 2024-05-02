import { extractFromHtml } from "@extractus/article-extractor";
import { Request, Response } from "express";
import { log } from "../log";
import { llm_get_claims, llm_verify_article_with_sources } from "../api/llm_api";
import { retrieval_get_sources } from "../api/retrieval_api";

export default async function ep_extract_fact_check(req: Request, res: Response) {
    log.info("Received request at /api/article/extract-and-fact-check");
    try {
        const article_text = (await article_extract(req.body.article_html)).content;

        if (article_text == null) {
            res.status(400).send("Article is null");
            return;
        }

        const claims = await llm_get_claims(article_text);
        const sources = await retrieval_get_sources(claims);
        const checks = await llm_verify_article_with_sources(article_text, sources.sources);
        res.json(checks);
    } catch (e) {
        console.log(e)
        res.sendStatus(500);
    }
}

// TODO: Write tests for this function
// One way to test the article would be to download a number of HTML files and load it using
// the fs library in Node.
// Then extracting the article and checking if the returned result has
//   - any HTML tags
//   - has a content length of 100 characters
export async function article_extract(articleHTML: string) {
    let article = await extractFromHtml(articleHTML);
    if (article == null) throw "Article is null"
    return article
}


