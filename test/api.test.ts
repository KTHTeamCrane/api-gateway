import { llm_extract_claims } from "../src/api/llm_api"
import fs from "fs"


describe("Test for backend API calls", () => {
    test("Get SOME response from the WebSocket proxy", async () => {
        let article_utf8 = fs.readFileSync("./test/data/cnn.txt", "utf-8")
        await llm_extract_claims(article_utf8)
    })
})