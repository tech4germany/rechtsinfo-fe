// const laws = isDevelopment
//   ? requireDir(__dirname + '/test/')
//   : requireDir(__dirname + '/multiple/')

module.exports = function () {
  const sections = []

  // const pipeline = fs
  //   .createReadStream(__dirname + '/all_laws.json')
  //   .pipe(StreamArray.withParser())
  // pipeline.on('data', ({ key, value }) => {
  //   const articles = value.contents.filter((article) => {
  //     return article.type === 'article'
  //   })
  // const pipeline = chain([
  //   fs.createReadStream(__dirname + '/all_laws.json'),
  //   parser(),
  //   pick({ filter: /^\d+\.contents\.\d+/ }),
  //   streamValues(),
  //   (data) => {
  //     const value = data.value
  //     return value && value.type === 'article' ? data : null
  //   },
  // ])

  // pipeline.on('data', (data) => {
  //   sections.push(data.value)
  // })
  //sections.push(...articles)

  // Object.keys(laws).forEach((item) => {
  //   const currentLaw = laws[item].data
  //   const articles = currentLaw.contents.filter((article) => {
  //     return article.type === 'article'
  //   })
  //   const articleArray = articles.map((articleItem) => ({
  //     ...articleItem,
  //     abbreviation: currentLaw.abbreviation,
  //     statusInfo: currentLaw.statusInfo,
  //   }))
  //   sections.push(...articleArray)
  // })

  // jsonStream.on('data', ({ key, value }) => {
  //   const slug = value.abbreviation
  //   const articles = value.contents.filter((article) => {
  //     return article.type === 'article'
  //   })

  //   const articleArray = articles.map((articleItem) => ({
  //     ...articleItem,
  //     abbreviation: slug,
  //     //statusInfo: currentLaw.statusInfo,
  //   }))
  //   sections.push(...articleArray)
  // })

  return sections
}
