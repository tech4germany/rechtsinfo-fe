const requireDir = require('require-dir')

const isDevelopment = process.env.NODE_ENV === 'development'

const laws = isDevelopment
  ? requireDir(__dirname + '/test/')
  : requireDir(__dirname + '/multiple/')

module.exports = () => {
  return Object.values(laws)
}
