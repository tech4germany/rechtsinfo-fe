const requireDir = require('require-dir')
const unflattenFilter = require('../filters/unflattenFilter')

const isDevelopment = process.env.NODE_ENV === 'development'

const laws = isDevelopment
  ? requireDir(__dirname + '/test/')
  : requireDir(__dirname + '/multiple/')

module.exports = function () {
  const sections = []
  Object.keys(laws).forEach((item) => {
    const currentLaw = laws[item].data
    // generate table of contents
    //const toc = unflattenFilter(currentLaw.contents)
    const articles = currentLaw.contents.filter((article) => {
      return article.type === 'article'
    })
    const articleArray = articles.map((articleItem) => ({
      ...articleItem,
      abbreviation: currentLaw.abbreviation,
      //toc: toc,
      //statusInfo: currentLaw.statusInfo,
    }))
    sections.push(...articleArray)
  })

  return sections
}
