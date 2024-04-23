import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import ep_check_text from "./check_text";
import ep_check_url from "./check_url";
import ep_extract from "./extract";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.get("/", async (req: Request, res: Response) => {
    let help = 
`
GATEWAY API

Route                   Method      Parameters
/api/article/checktext  POST        { text: string }
/api/article/checkurl   POST        { url: string }
/api/article/extract    POST        { url: string }
`
    res.send(help)
})

app.post("/api/article/checktext", async (req: Request, res: Response) => {
    await ep_check_text(req, res)
});

app.post("/api/article/checkurl", async (req: Request, res: Response) => {
    await ep_check_url(req, res)
})

app.post("/api/article/extract", async (req: Request, res: Response) => {
    await ep_extract(req, res)
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});