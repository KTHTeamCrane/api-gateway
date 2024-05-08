import { log } from "../log"
import fetch from "node-fetch"
import { PolitifactEntry } from "../api/retrieval_api"

interface FactCheck {
    EXCERPT: string,
    LABEL: "TRUE" | "PARTIAL" | "FALSE",
    EXPLANATION: string,
    SOURCES: string[]
}

interface WSMessage<T> {
    type: string,
    body: T
}

interface ErrorResponse extends WSMessage<{ msg: string, other: any }> { }
interface FactCheckResponse extends WSMessage<{ factcheck: FactCheck[] }> { }
interface ClaimResponse extends WSMessage<{ claims: string[] }> { }
interface ClaimWithExcerptResponse extends WSMessage<{ claims: { claim: string, excerpt: string }[] }> { }

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

export async function llm_verify_article_with_sources(
    article: string,
    fact_sources: Record<string, PolitifactEntry>,
    article_sources: string[],
): Promise<FactCheck[]> {
    log.info("Sending get fact check to LLM-API");

    const factCheckResponse = await sendRequest("get_factcheck", {
        article: article,
        fact_sources: fact_sources,
        article_sources: article_sources,
    }) as ErrorResponse | FactCheckResponse;

    if (factCheckResponse.type === "error") {
        throw (factCheckResponse as ErrorResponse).body;
    }

    return (factCheckResponse as FactCheckResponse).body.factcheck;
}

export async function llm_verify_article_with_sources_multirun(
    article: string,
    claims: { claim: string, excerpt: string }[],
    politifact_sources: Record<string, PolitifactEntry[]>,
    article_sources: Record<string, string[]>,
): Promise<FactCheck[]> {
    log.info("Sending get fact check to LLM-API");

    const factCheckResponse = await sendRequest("get_factcheck_with_claims", {
        article, politifact_sources, article_sources, claims
    }) as ErrorResponse | FactCheckResponse;

    if (factCheckResponse.type === "error") {
        throw (factCheckResponse as ErrorResponse).body;
    }

    return (factCheckResponse as FactCheckResponse).body.factcheck;
}

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

export async function llm_get_claims_with_excerpts(article: string): Promise<{ claim: string, excerpt: string }[]> {
    log.info("Sending get claims to LLM-API");

    const claimResponse = await sendRequest("get_claims_with_excerpts", {
        article: article
    }) as ErrorResponse | ClaimWithExcerptResponse;

    if (claimResponse.type === "error") {
        throw (claimResponse as ErrorResponse).body;
    }

    return (claimResponse as ClaimWithExcerptResponse).body.claims;
}
