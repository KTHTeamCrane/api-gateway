import { Request, Response } from "express";
import { log } from "../log";
import { llm_get_claims, llm_verify_article_with_sources } from "../api/llm_api";
import retrieval_get_sources from "../api/retrieval_api";

export default async function ep_fact_check_text(req: Request, res: Response) {
    log.info("Request at /check_text")
    try {
        const article = req.body.article
        // const claims = await llm_get_claims(article)
        // const sources = await retrieval_get_sources(claims)
        // const finalResponse = await llm_verify_article_with_sources(article, sources)
        const factCheck = await llm_verify_article_with_sources(article, [])
        res.send(factCheck)
    } catch (e) {
        log.error(e)
        res.sendStatus(500)
    }
}