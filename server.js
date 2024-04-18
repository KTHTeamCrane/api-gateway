const express = require('express')
const extractor = require("./extract")
const cors = require('cors')
const apiDomain = process.env.FLASK_API_DOMAIN

const app = express()
const port = 8000


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept")
  next()
})

console.log(apiDomain)

function Sanitize(str) { return str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"").trim(); }

app.get("/", async (req, res) => {
    let help = 
    `
Routes available

method  endpoint                params

POST    /echo                   echo
GET     /article/get-content    article
GET     /article/fake           article
GET     /env-test               <none>
    `
    res.send(help)
})

app.get("/article/get-content", async(req, res) => {
    console.log("Request at /article/get-content")
    let articleUrl = req.query.article
    Sanitize(articleUrl)

    if (articleUrl == undefined) {
        let articleNotProvide = {
            error: true,
            error_msg: "Article not provided",
            data: null
        }
        console.log("No article was provided. Returning error")
        res.send(JSON.stringify(articleNotProvide))
        return
    }

    const returnArticle = (_, dat) => {
        let articleExtracted = {
            error: false,
            error_msg: null,
            data: {
                content: dat.content
            }
        }
        console.log("Content of an article returned.")
        res.send(JSON.stringify(articleExtracted))
    }

    extractor.ExtractArticle(articleUrl, returnArticle)

})

app.get("/article/fake", async (req, res) => {
    console.log("Request at /article")
    let articleUrl = req.query.article
    if (articleUrl == undefined) {
      let article404Error = {
        error: true,
        error_msg: "Article URL not provided",
        data: null
      }

      res.send(JSON.stringify(article404Error))
      return
    }

    Sanitize(articleUrl)
    
    const func = async (_, dat) => {
        const result = await fetch(apiDomain + "/api/fake", {
            method: "POST",
            headers: {
                "Content-Type":"text/plain"
            },
            body: dat.content,
            port: port
        })
        console.log(result)
        res.send(JSON.stringify(await result.json())) 
    }
    console.log(articleUrl)
    extractor.ExtractArticle(articleUrl, func)
})

app.post("/echo", async (req, res) => {
    res.send(req.query.echo)
})

app.get("/env-test", async (req, res) => {
    res.send(process.env.FLASK_API_DOMAIN)
})


app.listen(port, () => {
    console.log("Started server on port " + port)
})
