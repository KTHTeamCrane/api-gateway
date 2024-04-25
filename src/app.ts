import express, { Express, Request, Response } from "express";
import ep_extract from "./endpoints/ep_extract";
import ep_check_text from "./endpoints/ep_check_text";
import { log } from "./log";

const app: Express = express();
const port = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));

app.get("/", async (_: Request, res: Response) => {
    log.info("Request at /")
    let help = `GATEWAY API

Route                       Method      Parameters
/api/article/check-text     POST        { text: string }
/api/article/check-url      POST        { url: string }
/api/article/extract        POST        { url: string }`;
    res.send(help);
});

app.post("/api/article/extract", async (req: Request, res: Response) => {
    await ep_extract(req, res);
});

app.post("/api/article/check-text", async (req: Request, res: Response) => {
    await ep_check_text(req, res)
});

app.listen(port, "0.0.0.0", () => {

    log.info(`[server]: Server is running at http://localhost:${port}`);
});
