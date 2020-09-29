const unflattenFilter = require('./src/filters/unflattenFilter')
const emptyFilter = require('./src/filters/emptyFilter')
const lookupFilter = require('./src/filters/lookupFilter')

module.exports = function (config) {
  config.addPassthroughCopy('src/js')
  config.addPassthroughCopy('src/assets')
  config.addNunjucksFilter('lookup', lookupFilter)
  config.addNunjucksFilter('unflatten', unflattenFilter)
  config.addNunjucksFilter('empty', emptyFilter)

  config.addLayoutAlias('main', 'layouts/main.njk')

  return {
    dir: {
      input: 'src',
      output: '_site',
    },
    passthroughFileCopy: true,
  }
}
