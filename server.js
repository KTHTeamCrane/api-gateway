const express = require('express')
const extractor = require("./extract")

const apiDomain = process.env.FLASK_API_DOMAIN

const app = express()
const port = 8000

console.log(apiDomain)


app.get("/article", async (req, res) => {
    console.log("Request at /article")
    let articleUrl = req.query.article
    let result = await fetch(apiDomain + "/api/fake?article=" +  articleUrl, {method: "POST"}) 
    res.send(JSON.stringify(await result.json())) 



    // const  func = async (_, dat) => {
    //     let result = await fetch(apiDomain + "/api/fake?query=" + dat.content)
    //     res.send(result)
    // }
    // let articleUrl = req.query.article
    // console.log(articleUrl)
    // extractor.ExtractArticle(articleUrl, func)
})

app.listen(port, () => {
    console.log("Started server on port " + port)
})
