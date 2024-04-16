const extractor = require("article-extractor")
const entities = require("entities")

module.exports = {
  ExtractArticle: async function(url, onSuccess) {
    extractor.extractData(url, (err, dat) => {
      dat.content = dat.content.replace(/<[^>]*>/g, '')
      dat.content = entities.decodeHTML(dat.content)
      onSuccess(dat)
    })
  }
}