import { Request, Response } from "express";
import { log } from "../log";
import { llm_get_claims, llm_verify_article_with_sources } from "../api/llm_api";
import retrieval_get_sources from "../api/retrieval_api";

export default async function ep_fact_check_text(req: Request, res: Response) {
    log.info("Request at /check_text")
    try {
        let article         = req.body.article
        let claims          = await llm_get_claims(article)
        let sources         = await retrieval_get_sources(claims)
        let finalResponse   = await llm_verify_article_with_sources(article, sources)
        res.send(finalResponse)
    } catch (e) {
        log.error(e)
        res.sendStatus(500)
    }
}