import { Request, Response } from "express";
import {decodeHTML} from "entities"
import {ArticleData, extract} from "@extractus/article-extractor"
import { log } from "./logger";


export default async function ep_extract(req: Request, res: Response) {
    try {
    } catch (e) {
        log.error(e)
        res.sendStatus(500)
    }
}

export async function extract_articles(articleUrl: string, onSuccessCallback: (err: any, article: ArticleData) => void) {
    let article = await extract(articleUrl)
    if (article?.content != null) {
        article.content = article.content.replace(/<[^>]*>/g, '')
        article.content = decodeHTML(article.content)
        onSuccessCallback(null, article)
    }
}