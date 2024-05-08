import * as Express from "express";

export default async function ep_fetchnews(req: Express.Request, res: Express.Response) {
    // const country = req.url.replace("/fetchnews/", "").replaceAll("%20", " ")
    const country = req.params.country;
  
    // Set cors headers
    //   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1002')
    //   res.setHeader('Access-Control-Allow-Methods', 'GET')
    //   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  
    let date = new Date()
    date.setDate(date.getDate() - 7);
    let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate()
    console.log(date);
    
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
    const json = await newsRes.json()
    res.json(json);
}