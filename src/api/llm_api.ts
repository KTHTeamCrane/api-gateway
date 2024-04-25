import WebSocket from "ws"
import { log } from "../log"
import { createId } from "@paralleldrive/cuid2"
import { websocket } from "./websocket"
import WSReqManager from "./ws_req_manager"

const REQ_MANAGER = new WSReqManager()
REQ_MANAGER.register(websocket)

interface FactCheck {
    excerpt: string,
    label: "TRUE" | "PARTIAL" | "FALSE",
    reason: string,
    sources: string[]
}

interface WSMessage<T> {
    id: string,
    type: string,
    body: T
}

interface ErrorResponse extends WSMessage<{ msg: string, other: any }> { }
interface FactCheckResponse extends WSMessage<{ factcheck: FactCheck[] }> { }
interface ClaimResponse extends WSMessage<{ claims: string[] }> { }

/**
 * Sends a list of sources and the article to the LLM API to fact check.
 */
export async function llm_verify_article_with_sources(article: string, sources: string[]): Promise<FactCheck[]> {
    log.info("Sending get fact check to LLM-API");

    const factCheckResponse: ErrorResponse | FactCheckResponse = await REQ_MANAGER.send("get_factcheck", {
        article: article,
        sources: sources
    });

    if (factCheckResponse.type === "error") {
        throw (factCheckResponse as ErrorResponse).body.msg;
    }

    return (factCheckResponse as FactCheckResponse).body.factcheck;
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
    log.info("Sending get claims to LLM-API");

    const claimResponse: ErrorResponse | ClaimResponse = await REQ_MANAGER.send("get_claims", {
        article: article
    });

    if (claimResponse.type === "error") {
        throw (claimResponse as ErrorResponse).body.msg;
    }

    return (claimResponse as ClaimResponse).body.claims;
}
