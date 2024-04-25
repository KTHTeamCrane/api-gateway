import WebSocket from "ws"
import { log } from "../log"
import { createId } from "@paralleldrive/cuid2"
import { websocket } from "./websocket"

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
export async function llm_get_claims(article: string): Promise<string[]> {
    log.info("Sending message to LLM-API")
    const id = await webSocket_send(article)
    const claims = await webSocket_onResponse(id)
    return claims
}


/**
 * Callback for when a websocket is opened.
 */
function webSocket_send(article: string) {
    return new Promise<string>((res) => {
        const id = createId()
        const msg = {
            id: id,
            type: "get_claims",
            body: {
                article: article
            }
        }
        websocket.send(JSON.stringify(msg))
        res(id)
    })
}

/**
 * Callback for listening for a message from the LLM-API.
 * @returns 
 */
function webSocket_onResponse(id: string) {
    log.info(id)
    return new Promise<string[]>((res, rej) => {
        websocket.onmessage = (msg) => {
            log.info("Received message from LLM-API")
            const response = JSON.parse(msg.data.toString())
            const responseId: string = response.id
            if (responseId == id) {
                res(response.body.claims)
            } else {
                log.warn(`Received id ${response.id} which does not match.`)
                rej("ID mismatch")
            }
        }
    })
}