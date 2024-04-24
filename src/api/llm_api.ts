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
    return []
}