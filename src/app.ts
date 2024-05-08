import express, { Express, Request, Response } from "express";
import ep_extract from "./endpoints/ep_extract";
import ep_fact_check_text from "./endpoints/ep_fact_check_text";
import { log } from "./log";
import ep_get_claims from "./endpoints/ep_get_claims";
import ep_extract_fact_check from "./endpoints/ep_extract_fact_check";

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

app.get('/fetchnews/:country', async (req, res) => {
    // const country = req.url.replace("/fetchnews/", "").replaceAll("%20", " ")
    const country = req.params.country;
  
    // Set cors headers
    //   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1002')
    //   res.setHeader('Access-Control-Allow-Methods', 'GET')
    //   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  
    let date = new Date()
    let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate()
    date.setDate(date.getDate() - 7);
    
    let dayStr, monthStr, yearStr;
    dayStr = `${day}`
    monthStr = `${month}`
    yearStr = `${year}`

    if (day < 10) dayStr = `0${day}`
    if (month < 10) monthStr = `0${month}`
    console.log(`Since ${yearStr}-${monthStr}-${dayStr}`)
    console.log(country)
    
    const url = 'https://newsapi.org/v2/everything?' +
            `q=${country}&` +
            `from=${yearStr}-${monthStr}-${dayStr}&sortBy=publishedAt&` +
            'apiKey=' + '2546a9a33a3e464ca8d5887df53c14d6'
    console.log(url)
    const newsReq = new Request(url)
    const newsRes = await fetch(newsReq)
    const json = newsRes.json()
    res.json(json);
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
