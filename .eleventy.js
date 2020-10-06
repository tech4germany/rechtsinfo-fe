const unflattenFilter = require('./src/filters/unflattenFilter')
const emptyFilter = require('./src/filters/emptyFilter')
const lookupFilter = require('./src/filters/lookupFilter')
const htmlmin = require('html-minifier')

module.exports = function (config) {
  config.addNunjucksFilter('lookup', lookupFilter)
  config.addNunjucksFilter('unflatten', unflattenFilter)
  config.addNunjucksFilter('empty', emptyFilter)

  config.addWatchTarget('./src/compiled-assets/main.css')
  config.addWatchTarget('./src/compiled-assets/main.js')
  config.addWatchTarget('./src/compiled-assets/vendor.js')

  config.addPassthroughCopy('src/assets/images')
  config.addPassthroughCopy('src/assets/fonts')
  config.addPassthroughCopy({ 'src/compiled-assets': 'assets' })
  config.addLayoutAlias('main', 'layouts/main.njk')

  if (process.env.ELEVENTY_ENV === 'production') {
    config.addTransform('htmlmin', (content, outputPath) => {
      if (outputPath.endsWith('.html')) {
        const minified = htmlmin.minify(content, {
          collapseInlineTagWhitespace: false,
          collapseWhitespace: true,
          removeComments: true,
          sortClassName: true,
          useShortDoctype: true,
        })

        return minified
      }

      return content
    })
  }

  return {
    dir: {
      input: 'src',
      output: '_site',
    },
    passthroughFileCopy: true,
  }
}
