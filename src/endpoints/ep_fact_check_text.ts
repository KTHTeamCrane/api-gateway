import { Request, Response } from "express";
import { log } from "../log";
import { llm_get_claims, llm_verify_single_claim } from "../api/llm_api";
import { retrieval_get_articles, retrieval_get_politifact } from "../api/retrieval_api";

export default async function ep_fact_check_text(req: Request, res: Response) {
    log.info("Request at /api/article/fact_check_text")
    try {
        const text = req.body.text
        const politifact_sources = await retrieval_get_politifact([text])
        log.info("Received fact sources from retrieval API")
        const article_sources = await retrieval_get_articles(text, "", "", text)
        log.info("Received article from retrieval API")
        const factCheck = await llm_verify_single_claim(text, Object.values(politifact_sources.sources).flat(), article_sources.sources)
        log.info("Received fact check response")
        res.send(factCheck)
    } catch (e) {
        log.error(e)
        res.status(500).send(e)
    }
}