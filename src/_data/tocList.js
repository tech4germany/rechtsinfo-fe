// const requireDir = require('require-dir')
// const unflattenFilter = require('../filters/unflattenFilter')
// const slugify = require('slugify')

// const isDevelopment = process.env.NODE_ENV === 'development'

// const laws = isDevelopment
//   ? requireDir(__dirname + '/test/')
//   : requireDir(__dirname + '/multiple/')

// module.exports = function () {
//   const tocList = []
//   Object.keys(laws).forEach((item) => {
//     const currentLaw = laws[item].data
//     const toc = unflattenFilter(currentLaw.contents)
//     const slug = slugify(currentLaw.abbreviation, { lower: true, strict: true })
//     tocList.push({ name: slug, toc: toc })
//   })
//   return tocList
// }
