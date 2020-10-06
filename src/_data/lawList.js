const axios = require('axios')
const path = require('path')
const chalk = require('chalk')
const flatCache = require('flat-cache')
const mocks = require('./mocks')
const isDevelopment = process.env.ELEVENTY_ENV === 'development'

const ITEMS_PER_REQUEST = 100
const BASE_API_URL = 'https://api.rechtsinformationsportal.de'
const CACHE_KEY = 'lawList'
const CACHE_FOLDER = path.resolve('./.cache')
const CACHE_FILE = 'lawList.json'

/**
 * Request list of laws
 */
async function requestLaws(page = 1) {
  try {
    const url = `${BASE_API_URL}/laws?per_page=${ITEMS_PER_REQUEST}&page=${page}`
    const response = await axios.get(url)
    // return the total number of items to fetch and the data
    console.log(response)
    return response.data
  } catch (err) {
    console.log(err)
    console.error(chalk.red('API not responding, no data returned'))
    return []
  }
}

/**
 * Get all laws
 * - check if we have a cache
 * - if not make api requests and create cache
 */
async function getLawList() {
  if (isDevelopment) return mocks
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

  // variables
  let requests = []
  let apiData = []
  let additionalRequests = 0

  // make first request and merge results with array
  const request = await requestLaws()
  apiData.push(...request.data)

  // calculate how many additional requests we need
  additionalRequests = Math.ceil(request.pagination.total / ITEMS_PER_REQUEST)

  // create additional requests
  for (let i = 2; i <= additionalRequests; i++) {
    let start = i
    const request = requestLaws(start)
    requests.push(request)
  }

  // resolve all additional requests in parallel
  const allResponses = await Promise.all(requests)
  allResponses.map((response) => {
    apiData.push(...response.data)
  })

  //sort data as needed
  apiData.sort((a, b) => {
    return a.abbreviation
      .toLowerCase()
      .localeCompare(b.abbreviation.toLowerCase())
  })

  let list = Array.from(new Set(apiData))

  // set and save cache
  if (list.length) {
    cache.setKey(CACHE_KEY, list)
    cache.save()
  }

  // return data
  return list
}

// export for 11ty
module.exports = getLawList
