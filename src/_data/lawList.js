const axios = require('axios')
const path = require('path')
const flatCache = require('flat-cache')

const isDevelopment = process.env.ELEVENTY_ENV === 'development'

const ITEMS_PER_REQUEST = 100
const BASE_API_URL = 'https://api.rechtsinformationsportal.de'
const CACHE_KEY = 'lawList'
const CACHE_FOLDER = path.resolve('./.cache')
const CACHE_FILE = 'lawList.json'

async function requestLaws(page = 1) {
  try {
    const url = `${BASE_API_URL}/laws?per_page=${ITEMS_PER_REQUEST}&page=${page}`
    const response = await axios.get(url)
    return response.data
  } catch (err) {
    console.log(err)
    return []
  }
}

async function getLawList() {
  // load cache
  const cache = flatCache.load(CACHE_FILE, CACHE_FOLDER)
  const cachedItems = cache.getKey(CACHE_KEY)

  // if we have a cache, return cached data
  if (cachedItems) {
    return cachedItems
  }

  // variables
  let requests = []
  let apiData = []
  let additionalRequests = 0

  // make first request and merge results with array
  const request = await requestLaws()
  apiData.push(...request.data)

  // calculate how many additional requests we need
  additionalRequests = isDevelopment
    ? 0
    : Math.ceil(request.pagination.total / ITEMS_PER_REQUEST)

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

  // set and save cache
  if (apiData.length) {
    cache.setKey(CACHE_KEY, apiData)
    cache.save()
  }

  // return data
  return apiData
}

// export for 11ty
module.exports = getLawList
