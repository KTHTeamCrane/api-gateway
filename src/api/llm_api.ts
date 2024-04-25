import WebSocket from "ws"
import { log } from "../log"
import { createId } from "@paralleldrive/cuid2"

/**
 * Sends a list of sources and the article to the LLM API to fact check.
 */
export async function llm_verify_article_with_sources(article: string, sources: string[]): Promise<string> {
    // TODO: Implement with fetch API
    return ""
}

/**
 * Sends an article the LLM API.
 * 
 * The LLM API returns a list of claims that it finds within the article.
 * 
 * The list of claims is then returned.
 * 
 * @returns A list of claims from a given article
 */
export async function llm_extract_claims(article: string): Promise<string[]> {
    // TODO: Implement with fetch API
    let wsClient = new WebSocket("wss://llm-proxy-server-slixmjmf2a-ez.a.run.app")
    let body = {
        id: createId(),
        type: "get_claims",
        body: {
            article: article
        }
    }

    wsClient.onopen = async () => {
        await wsClient.send(JSON.stringify(body))
    }

    wsClient.onmessage = async (e) => {
        console.log("received message")
        console.log(e.data)
    }
    
    // wsClient.onmessage = (e: WebSocket.MessageEvent) => {
    //     console.log(e.data)
    // }
    return []
}
