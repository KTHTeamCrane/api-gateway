const express = require("express")
const extractor = require("./extract.js")

const server = express()
const request = require("request")

const COMPUTE_API_DOMAIN = "127.0.0.1/"
const COMPUTE_API_HOSTNAME = "127.0.0.1"
const COMPUTE_API_PORT = 8000

function Sanitize(str) { return str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"").trim(); }

// ownFailure = true if error was caused internally
function SendErrMsg(res, msg, ownFailure = true) {
  console.log(`#### ERROR ####\nInternal Error: ${ownFailure}\n${msg}`)
  const fail = (e) => { console.log(`RESPONSE_ERROR: ${e}`) }
  if (ownFailure) res.write(`GATEWAY_API_ERROR: ${msg}`, fail)
  else res.write(`EXTERNAL_ERROR: ${msg}`, fail)
  res.end()
}

server.get('/article/*', (clientReq, clientRes) => {
  clientRes.statusCode = 200
  clientRes.setHeader("Content-Type", "application/JSON")

  let url = clientReq.url.replace("/article/", "", 1) // Rid of keyword
  url = Sanitize(url) // Sanitize client input

  const echo = (articleErr, articleData) => {
    if (articleErr) { SendErrMsg(clientRes, articleErr); return }
    let strjson = JSON.stringify(articleData)
    let opts = {
      hostname: COMPUTE_API_HOSTNAME,
      port: COMPUTE_API_PORT,
      body: strjson,
      method: "POST",
      headers: {
        "Content-Length": strjson.length,
        "Content-Type": "application/json"
      }
    }

    const cReq = request(COMPUTE_API_DOMAIN, opts, (computeErr, computeData) => {
      if (computeErr) {
        SendErrMsg(clientRes, computeErr, false)
        return
      }
      if (computeData.statusCode < 200 && computeData.statusCode > 299) {
        SendErrMsg(clientRes, computeData.body, false)
        return
      }
      // Send data to client
      clientRes.write(computeData.body, e => { if (e) SendErrMsg(clientRes, e) })
      clientRes.end()
    })

    cReq.on("error", (e) => { SendErrMsg(clientRes, e) })
  }
  extractor.ExtractArticle(url, echo)
})

server.listen(8000, e => {
  if (e) console.log("Error listening.")
  console.log("SRVR listening PORT: " + 8000)
})