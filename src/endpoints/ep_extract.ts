import { extractFromHtml } from "@extractus/article-extractor";
import { Request, Response } from "express";
import { log } from "../log";

export default async function ep_extract(req: Request, res: Response) {
    log.info("Received request at /api/article/extract")
    try {
        let html = await (await article_extract(req.body.article_html)).content
        res.send(JSON.stringify(html))
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


