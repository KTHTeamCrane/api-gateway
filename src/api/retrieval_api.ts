import { log } from "../log";

async function sendRetrievalRequest(path: string, body: any) {
    // const API_URL = `http://localhost:6970`;
    const API_URL = `https://retrieval-api-slixmjmf2a-ez.a.run.app`;
    const response = await fetch(`${API_URL}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`Failed to send request to ${API_URL}. Status code: ${response.status}`);
    }

    const json = await response.json();

    return json;
}

async function sendProxyRetrievalRequest(
    path: "api/politifact" | "api/articles",
    body: GetArticleSourcesRequest | GetPolitifactSourcesRequest
) {
    let type: string;

    if (path == "api/politifact") {
        type = "get_politifact_sources";
    } else if (path == "api/articles") {
        type = "get_article_sources";
    } else {
        throw new Error(`Invalid path: ${path}`);
    }

    const API_URL = "https://llm-proxy-server-slixmjmf2a-ez.a.run.app/proxy";
    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            id: Math.random().toString(36).substring(7),
            type: type,
            body: body
        })
    });

    const respJson = await response.json();

    return respJson.body;
}

interface GetPolitifactSourcesRequest {
    claims: string[]
}

interface GetArticleSourcesRequest {
    title: string
    url: string
    article: string
    claim?: string
    search_engine?: string
    limit_articles?: number
}

export interface PolitifactEntry {
    body: string
    score: number
    label: string
    url: string
}

export interface ArticleEntry {
    body: string
    url: string
    title: string
    publisher: string
}

interface GetPolitifactResponse {
    sources: Record<string, PolitifactEntry[]>
}

interface GetArticlesResponse {
    sources: ArticleEntry[]
}

interface GetSourcesError {
    error: string
}

export async function retrieval_get_politifact(claims: string[]): Promise<GetPolitifactResponse> {
    const reqBody: GetPolitifactSourcesRequest = { claims };
    log.info("Sending data to the retrieval API")
    const response = await sendProxyRetrievalRequest("api/politifact", reqBody) as GetPolitifactResponse | GetSourcesError;

    if ("error" in response) throw new Error(response.error);

    return response;
}

export async function retrieval_get_articles(
    refArticle: string,
    refArticleTitle: string,
    refArticleURL: string,
    checkClaim?: string,
): Promise<GetArticlesResponse> {
    const reqBody = {
        title: refArticleTitle,
        url: refArticleURL,
        article: refArticle,
        claim: checkClaim,
        // search_engine: "google"
    };
    const response = await sendProxyRetrievalRequest("api/articles", reqBody) as GetArticlesResponse | GetSourcesError;

    if ("error" in response) throw new Error(response.error);

    return response;
}