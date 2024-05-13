import express, { Express, Request, Response } from "express";
import ep_extract from "./endpoints/ep_extract";
import ep_fact_check_text from "./endpoints/ep_fact_check_text";
import { log } from "./log";
import ep_get_claims from "./endpoints/ep_get_claims";
import ep_extract_fact_check from "./endpoints/ep_extract_fact_check";
import ep_fetchnews from "./endpoints/ep_fetchnews";
import cors from "cors"

const app: Express = express();
const port = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));

const corsOptions = {
    origin: 'https://litmusnews.se/'
}
app.use(cors(corsOptions));


app.get("/", async (_: Request, res: Response) => {
    log.info("Request at /")
    let help = `GATEWAY API

Route                       Method      Parameters
/api/article/check-text     POST        { text: string }
/api/article/check-url      POST        { url: string }
/api/article/extract        POST        { url: string }`;
    res.send(help);
});

app.get('/fetchnews/:country', async (req, res) => {
    await ep_fetchnews(req, res);
})

app.post("/api/article/extract", async (req: Request, res: Response) => {
    await ep_extract(req, res);
});

app.post("/api/article/fact-check-text", async (req: Request, res: Response) => {
    await ep_fact_check_text(req, res)
});

app.post("/api/article/extract-and-fact-check", async (req: Request, res: Response) => {
    await ep_extract_fact_check(req, res);
});

app.post("/api/article/get-claims", async (req: Request, res: Response) => {
    await ep_get_claims(req, res)
})

app.listen(port, "0.0.0.0", () => {
    log.info(`Server is running at http://0.0.0.0:${port}`);
});
