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

function splitToChunks(items, chunkSize = 50) {
  const result = []
  for (let i = 0; i < items.length; i += chunkSize) {
    result.push(items.slice(i, i + chunkSize))
  }
  return result
}

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

const mapSeries = async (iterable) => {
  let apiData = []
  for (const x of iterable) {
    console.log('filling a new request array')
    // for group of urls in group
    let requests = []
    x.map((item, key) => {
      // map array in group of arrays
      const request = requestLaw(item.url)
      requests.push(request)
    })
    const allResponses = await Promise.all(requests)
    console.log(allResponses.length)
    allResponses.map((response) => {
      apiData.push(response.data)
    })
  }
  return apiData
}

module.exports = async function () {
  let apiData = []
  // load cache
  const cache = flatCache.load(CACHE_FILE, CACHE_FOLDER)
  const cachedItems = cache.getKey(CACHE_KEY)

  // if we have a cache, return cached data
  if (cachedItems) {
    console.log(chalk.blue('Blogposts from cache'))
    let laws = cachedItems.filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    )
    return laws
  }

  // if we do not, make queries
  console.log(chalk.blue('Blogposts from API'))

  const list = await getLawList()
  //const list = []
  const groups = splitToChunks(list)
  // returns an array of 131 arrays with all of the links
  apiData = await mapSeries(groups)
  // set and save cache
  if (apiData.length) {
    cache.setKey(CACHE_KEY, apiData)
    cache.save()
  }

  return apiData
}
