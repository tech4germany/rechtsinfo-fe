const axios = require('axios')
const SEARCH_URL = 'https://api.rechtsinformationsportal.de/search?q='
const RESULTS_PER_PAGE = 10
const slugRegex = /laws\/(.*)\/article/ // regex to get slug in article url
const origin = window.location.origin
const searchForm = document.getElementById('search')
const searchInput = document.getElementById('search-input')

const search = (e) => {
  // fetch using query params
  e.preventDefault()
  const input = searchInput.value
  const query = encodeURIComponent(input)
  window.location.href = origin + '/suche/?query=' + query
}

function displayResults(response) {
  //display first 10 results + pagination
  const resEl = document.getElementById('search-results')
  const total = response.pagination.total
  resEl.innerHTML = ''
  response.data.map((entry) => {
    const el = document.createElement('li')
    resEl.appendChild(el)
    const h2 = document.createElement('h2')
    el.classList.add('article-name')
    el.appendChild(h2)
    const a = document.createElement('a')
    // open in new tab?
    let url = ''
    if (entry.type === 'article') {
      a.textContent = entry.name + ' ' + entry.title
      const slug = entry.url.match(slugRegex)
      url = origin + '/' + slug[1] + '/index.html#' + entry.id
    } else if (entry.type === 'law') {
      a.textContent = entry.titleShort || entry.titleLong
      if (entry.titleShort) a.innerHTML += `<br/>${entry.titleLong}`
      url = origin + '/' + entry.slug + '/'
    }
    console.log(url)
    a.setAttribute('href', url)
    h2.appendChild(a)
  })
}

async function fetchResults(query) {
  const url = SEARCH_URL + query
  try {
    const response = await axios.get(url)
    // return the data and the total number of search results
    displayResults(response.data)
    return response
  } catch (err) {
    console.log(err)
    return []
  }
}

const init = () => {
  searchForm.onsubmit = search
  const urlParams = new URLSearchParams(window.location.search)
  const query = urlParams.get('query')
  if (query) {
    searchInput.value = decodeURIComponent(query)
    fetchResults(query)
  }
}

module.exports = init
