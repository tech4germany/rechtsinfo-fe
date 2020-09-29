const requireDir = require('require-dir')
const StreamArray = require('stream-json/streamers/StreamArray')
const fs = require('fs')
const isDevelopment = process.env.NODE_ENV === 'development'
const getLawList = require('./api')
const { pick } = require('stream-json/filters/Pick')
const { parser } = require('stream-json/Parser')
const { chain } = require('stream-chain')
const { streamValues } = require('stream-json/streamers/StreamValues')

const axios = require('axios')
const path = require('path')
const chalk = require('chalk')
const flatCache = require('flat-cache')

const CACHE_KEY = 'laws'
const CACHE_FOLDER = path.resolve('./.cache')
const CACHE_FILE = 'laws.json'
// const laws = isDevelopment
//   ? requireDir(__dirname + '/multiple/')
//   : requireDir(__dirname + '/multiple/')

// async function getLaws() {
//   const laws = []
//   console.log
//   const pipeline = fs
//     .createReadStream(__dirname + '/extracted.json')
//     .pipe(StreamArray.withParser())
//   pipeline.on('data', ({ key, value }) => {
//     laws.push(value)
//   })

//   pipeline.on('end', (data) => {
//     console.log('done')
//     return laws
//   })
// }

async function requestLaw(base) {
  const url = base + '?include=contents'
  try {
    const response = await axios.get(url)
    // return the total number of items to fetch and the data
    return response.data
  } catch (err) {
    console.log(err)
    console.error(chalk.red('API not responding, no data returned'))
    return []
  }
}

module.exports = async function () {
  // load cache
  const cache = flatCache.load(CACHE_FILE, CACHE_FOLDER)
  const cachedItems = cache.getKey(CACHE_KEY)

  // if we have a cache, return cached data
  if (cachedItems) {
    console.log(chalk.blue('Blogposts from cache'))
    return cachedItems
  }

  // if we do not, make queries
  console.log(chalk.blue('Blogposts from API'))

  let laws = []
  let requests = []
  let apiData = []

  const list = await getLawList()

  list.map((item, key) => {
    if (key < 50) {
      const request = requestLaw(item.url)
      requests.push(request)
    }
    return
  })

  const allResponses = await Promise.all(requests)
  allResponses.map((response) => {
    apiData.push(response.data)
  })

  // set and save cache
  if (apiData.length) {
    cache.setKey(CACHE_KEY, apiData)
    cache.save()
  }

  return apiData
}
