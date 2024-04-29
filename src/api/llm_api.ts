import { log } from "../log"
import fetch from "node-fetch"

interface FactCheck {
    excerpt: string,
    label: "TRUE" | "PARTIAL" | "FALSE",
    reason: string,
    sources: string[]
}

interface WSMessage<T> {
    type: string,
    body: T
}

interface ErrorResponse extends WSMessage<{ msg: string, other: any }> { }
interface FactCheckResponse extends WSMessage<{ factcheck: FactCheck[] }> { }
interface ClaimResponse extends WSMessage<{ claims: string[] }> { }

async function sendRequest(type: string, body: any) {
    const API_URL = "https://llm-proxy-server-slixmjmf2a-ez.a.run.app/proxy";
    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            id: Math.random().toString(36).substring(7),
            type: type,
            body: body
        })
    });
    return await response.json();
}

/**
 * Sends a list of sources and the article to the LLM API to fact check.
 */
export async function llm_verify_article_with_sources(article: string, sources: string[]): Promise<FactCheck[]> {
    log.info("Sending get fact check to LLM-API");

    // const factCheckReq = fetch("")
    const factCheckResponse = await sendRequest("get_factcheck", {
        article: article,
        sources: sources
    }) as ErrorResponse | FactCheckResponse;

    if (factCheckResponse.type === "error") {
        throw (factCheckResponse as ErrorResponse).body;
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

    const claimResponse = await sendRequest("get_claims", {
        article: article
    }) as ErrorResponse | ClaimResponse;

    if (claimResponse.type === "error") {
        throw (claimResponse as ErrorResponse).body;
    }

    return (claimResponse as ClaimResponse).body.claims;
}
