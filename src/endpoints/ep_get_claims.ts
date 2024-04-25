import { Request, Response } from "express";
import { llm_get_claims } from "../api/llm_api";
import { log } from "../log";

export default async function ep_get_claims(req: Request, res: Response) {
    log.info("Received message at /get-claims")
    try {
        let article = req.body.article
        let claims = await llm_get_claims(article)
        res.send(claims)
    } catch (e) {
        log.error(e)
        res.sendStatus(500)
    }
}
