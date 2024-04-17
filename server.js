const express = require('express')
const extractor = require("./extract")

const apiDomain = process.env.FLASK_API_DOMAIN

const app = express()
const port = 8000

console.log(apiDomain)


app.get("/article", async (req, res) => {
    console.log("Request at /article")
    let articleUrl = req.query.article

    // TODO: Send request as a body instead of a parameter
    const  func = async (_, dat) => {
        let result = await fetch(apiDomain + "/api/fake?article=" +  dat.content, {method: "POST"}) 
        console.log(result)
    res.send(JSON.stringify(await result.json())) 
    }
    console.log(articleUrl)
    extractor.ExtractArticle(articleUrl, func)
})

app.listen(port, () => {
    console.log("Started server on port " + port)
})
