async function sendRetrievalRequest(path: string, body: any) {
    const API_URL = `http://localhost:6970/${path}`;
    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(body)
    });
    return await response.json();
}

interface GetSourcesRequest {
    claims: string[]
}

export interface SourceEntry {
    body: string
    score: number
    label: string
}

interface GetSourcesResponse {
    sources: Record<string, SourceEntry>
}

interface GetSourcesError {
    error: string
}

export async function retrieval_get_sources(claim: string[]): Promise<GetSourcesResponse> {
    const response = await sendRetrievalRequest("retrieval/get_sources", { claims: claim }) as GetSourcesResponse | GetSourcesError;

    if ("error" in response) {
        throw new Error(response.error);
    }

    return response;
}