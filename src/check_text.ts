import { Request, Response } from "express";

// This function should never throw an error to the caller.
export default async function check_text(req: Request, res: Response) {
    try {
        await fetch_claims_from_llm()
        await fetch_fact_check_from_llm()
        await fetch_fact_check_from_llm()
    } catch {
        res.statusCode = 500
    }
}

// TODO: Fetch data to the LLM API
// This function can throw.
async function fetch_claims_from_llm() {
    console.log("Fetch API")
}

async function fetch_sources_from_retrival() {

}

async function fetch_fact_check_from_llm() {

}