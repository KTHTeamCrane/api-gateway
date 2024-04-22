import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import check_text from "./check_text";

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
    await check_text(req, res)
});

app.post("api/article/checkurl")

app.post("api/article/extract", async (req: Request, res: Response) => {
    
})




app.options("", async (req: Request, res: Response) => {

})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});