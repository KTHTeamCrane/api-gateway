async function sendRetrievalRequest(path: string, body: any) {
    const API_URL = `http://localhost:6970/${path}`;
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`Failed to send request to ${API_URL}. Status code: ${response.status}`);
    }

    const json = await response.json();

    return json;
}

interface GetSourcesRequest {
    claims: string[]
}

export interface PolitifactEntry {
    body: string
    score: number
    label: string
}

export interface ArticleEntry {
    body: string
    score: number
}

interface GetPolitifactResponse {
    sources: Record<string, PolitifactEntry>
}

interface GetArticlesResponse {
    sources: string[]
}

interface GetSourcesError {
    error: string
}

export async function retrieval_get_politifact(claim: string[]): Promise<GetPolitifactResponse> {
    const response = await sendRetrievalRequest("api/politifact", { claims: claim }) as GetPolitifactResponse | GetSourcesError;

    if ("error" in response) {
        throw new Error(response.error);
    }

    return response;
}

export async function retrieval_get_articles(refArticle: string): Promise<GetArticlesResponse> {
    const response = await sendRetrievalRequest("api/articles", { article: refArticle }) as GetArticlesResponse | GetSourcesError;

    if ("error" in response) {
        throw new Error(response.error);
    }

    return response;
}