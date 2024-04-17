const express = require("express")
const extractor = require("./extract.js")

const server = express()

server.get('/article/*', (req, res) => {
  console.log(req.url)
  res.statusCode = 200
  res.setHeader("Content-Type", "application/JSON")

  const end = req.url.length - 1
  let url = req.url.replace("/article/", "", 1)
  // Sanitize input (maybe https://github.com/expressjs/body-parser)

  const echo = __data => {
    let strjson = JSON.stringify(__data)
    res.write(strjson, e => { if (e) console.log("Error writing response: " + e) })
    res.end()
  }
  extractor.ExtractArticle(url, echo)
})

server.listen(8000, e => {
  if (e) console.log("Error listening.")
  console.log("SRVR listening PORT: " + 8000)
})