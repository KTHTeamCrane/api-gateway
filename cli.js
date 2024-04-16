/*
CLI Use: node cli.js <article_url>
*/
const extractor = require("./extract.js")

const OnExtract = (data) => {
  // send to AI
  console.log(data)
}

extractor.ExtractArticle(process.argv[2], OnExtract)