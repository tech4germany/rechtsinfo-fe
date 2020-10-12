const axios = require('axios')
const config = require('../../_data/config')

const SEARCH_URL = config.BASE_API_URL + '/search?q='
const RESULTS_PER_PAGE = 10

const slugRegex = /laws\/(.*)\/article/ // regex to get slug in article url
const origin = window.location.origin
const searchForm = document.getElementById('search-bar')
const searchInput = document.getElementById('search-bar__input')

let page = 1

// remove html tags from strings
const removeTags = (string) => {
  string && string.length ? string.replace(/(<([^>]+)>)/gi, '') : string
}

const search = (e) => {
  // fetch using query params
  e.preventDefault()
  const input = searchInput.value
  const query = encodeURIComponent(input)
  window.location.href = origin + '/suche/?query=' + query
}

const displayResults = (data) => {
  //display first 10 results + pagination
  const resEl = document.getElementById('search-results')
  data.map((entry) => {
    const el = document.createElement('li')
    resEl.appendChild(el)
    const h2 = document.createElement('h2')
    el.classList.add('article-name')
    el.appendChild(h2)
    const a = document.createElement('a')
    // open in new tab?
    let url = ''
    if (entry.type === 'article') {
      a.textContent = entry.name
      if (entry.title) a.textContent += ` ${entry.title}`
      const slug = entry.url.match(slugRegex)
      url = origin + '/' + slug[1] + '/index.html#' + entry.id
    } else if (entry.type === 'law') {
      a.textContent = entry.titleShort || entry.titleLong
      if (entry.titleShort) a.innerHTML += `<br/>${entry.titleLong}`
      url = origin + '/' + entry.slug + '/index.html'
    }
    a.setAttribute('href', url)
    h2.appendChild(a)
  })
}

const showPagination = (pagination) => {
  document.getElementById('pagination').classList.remove('hidden')
  const totalPages = document.getElementById('total-pages')
  const pages = Math.ceil(pagination.total / RESULTS_PER_PAGE)
  totalPages.innerText = pages
}

const getMoreResults = (url) => {
  // TODO: show button only if page < total pages
  const moreResultsBtn = document.getElementById('pagination-btn')
  const currentPage = document.getElementById('current-page')
  currentPage.innerText = page
  moreResultsBtn.onclick = () => {
    page++
    if (url) fetchResults(url, page)
  }
}

const fetchResults = async (url, page) => {
  try {
    const response = await axios.get(url)
    const { pagination, links, data } = response.data
    if (page === 1) showPagination(pagination)
    displayResults(data)
    if (links.next) getMoreResults(links.next)
    return response
  } catch (err) {
    console.log(err)
    return []
  }
}

const init = () => {
  searchForm.onsubmit = search
  const urlParams = new URLSearchParams(window.location.search)
  const query = urlParams ? urlParams.get('query') : ''
  if (query) {
    const url = SEARCH_URL + query
    searchInput.value = decodeURIComponent(query)
    fetchResults(url, page)
  }
}

module.exports = init
