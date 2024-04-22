import { Request, Response } from "express";

export default async function check_url(req: Request, res: Response) {
    try {
        // TODO: 
        //  extract article from the URL
        //  send article to LLM server
        //      LLM server returns a list of claims
        //  send list of claims to retrieval server
        //      retrieval server sends a list of sources
        //  send article and sources back to the LLM server        
    } catch {
        res.statusCode = 500
        res.send("Internal server error")
    }
}

