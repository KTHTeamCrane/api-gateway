const extractor = require("article-extractor")
const entities = require("entities")

/*
Function: extract article contents and `onSuccess` is called with the data JSON object as argument
            Structure of JSON:
            {
              domain: String,
              author: String,
              title: String,
              content: String,
              summary: String
            }
Return type: void
*/
module.exports = {
  ExtractArticle: async function(url, onSuccess) {
    extractor.extractData(url, (err, dat) => {
      dat.content = dat.content.replace(/<[^>]*>/g, '')
      dat.content = entities.decodeHTML(dat.content)
      onSuccess(err, dat)
    })
  }
}