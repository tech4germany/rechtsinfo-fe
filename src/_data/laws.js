const getLawList = require('./lawList')

const axios = require('axios')
const path = require('path')
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

const replaceAttachments = (data) => {
  // contents is an array of objects
  let newContents = data.contents.map((contentItem) => {
    // check if contentItem.body contains an attachment
    Object.entries(data.attachments).forEach(([key, value]) => {
      if (contentItem.body && contentItem.body.includes(key)) {
        contentItem.body = contentItem.body.replace(key, value)
        return contentItem
      }
    })
    return contentItem
  })
  return newContents
}

async function requestLaw(base) {
  const url = base + '?include=contents'
  try {
    const response = await axios.get(url)
    const item = response.data.data
    const hasAssets = item.attachments
    // if item has attachments, replace all images in the contents with absolute paths to s3 bucket
    response.data.data.contents = hasAssets
      ? replaceAttachments(item)
      : response.data.data.contents
    return response.data
  } catch (err) {
    console.log(err)
    return []
  }
}

const mapSeries = async (iterable) => {
  let apiData = []
  for (const x of iterable) {
    // for group of urls in group
    let requests = []
    x.map((item) => {
      // map array in group of arrays
      const request = requestLaw(item.url)
      requests.push(request)
    })
    const allResponses = await Promise.all(requests)
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
    let laws = cachedItems.filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    )
    return laws
  }

  // await list of laws from API
  const list = await getLawList()
  // split all requests into arrays of 50 requests each
  const groups = splitToChunks(list)
  // await all responses
  apiData = await mapSeries(groups)

  // set and save cache
  if (apiData.length) {
    cache.setKey(CACHE_KEY, apiData)
    cache.save()
  }

  // TODO: remove once API returns unique values
  let laws = apiData.filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i
  )

  return laws
}
