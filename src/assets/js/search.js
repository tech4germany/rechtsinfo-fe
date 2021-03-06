const axios = require('axios')
const config = require('../../_data/config')

const SEARCH_URL = config.BASE_API_URL + '/search'
const RESULTS_PER_PAGE = 10

const origin = window.location.origin

const searchForm = document.getElementById('search-bar')
const searchInput = document.getElementById('search-bar__input')
const sections = [...document.querySelectorAll('.search-results')]

// remove html tags from strings
const removeTags = (string) => {
  const clean =
    string && string.length ? string.replace(/(<([^>]+)>)/gi, ' ') : string
  return clean
}

const search = (e) => {
  e.preventDefault()
  const input = searchInput.value
  const searchURL = new URL(origin + '/suche/')
  // add input to query params
  searchURL.searchParams.append('query', input)
  // navigate to search template
  window.location.href = searchURL
}

const displayResults = (response, element, page) => {
  // create markup for search results
  const list = element.querySelector('ul')
  const { data, pagination, links } = response
  data.map((entry) => {
    const el = document.createElement('li')
    list.appendChild(el)
    const h2 = document.createElement('h2')
    el.classList.add('article-name')
    el.appendChild(h2)
    const a = document.createElement('a')
    a.target = '_blank'
    let url = ''
    const tag = document.createElement('span')
    tag.classList.add('search-result-tag')
    if (entry.type === 'article') {
      a.textContent = removeTags(entry.name)
      if (entry.title) a.textContent += ` ${removeTags(entry.title)}`
      const slug = entry.law.slug
      url = origin + '/' + slug + '/index.html#' + entry.id
      const h3 = document.createElement('h3')
      const a2 = document.createElement('a')
      a2.target = '_blank'
      a2.setAttribute('href', origin + '/' + slug + '/index.html')
      a2.textContent = entry.law.titleShort
        ? entry.law.titleShort
        : entry.law.titleLong
      el.appendChild(h3)
      h3.appendChild(a2)
      tag.innerHTML = "<i class='fas section-icon'>§</i> Paragraf"
    } else if (entry.type === 'law') {
      a.textContent = entry.titleShort || entry.titleLong
      if (entry.titleShort) a.innerHTML += `<br/>${entry.titleLong}`
      url = origin + '/' + entry.slug + '/index.html'
      tag.innerHTML = "<i class='fas fa-landmark'></i> Gesetz"
    }
    a.setAttribute('href', url)
    h2.appendChild(a)
    el.appendChild(tag)
  })
  // show total pages + load more button
  if (page === 1) {
    showPagination(pagination, element)
  }
  // fetch next page
  if (links.next) getMoreResults(links.next, element, page)
}

const showPagination = (pagination, element) => {
  element.querySelector('.pagination').classList.remove('hidden')
  const totalPages = element.querySelector('.total-pages')
  const id = element.id
  const totalResults = document.querySelector('.filter-number' + '.' + id)
  const pages = Math.ceil(pagination.total / RESULTS_PER_PAGE)
  totalResults.innerText = pagination.total
  totalPages.innerText = pages
}

const getMoreResults = (url, element, page) => {
  // TODO: show button only if page < total pages
  const moreResultsBtn = element.querySelector('.pagination-btn')
  const currentPage = element.querySelector('.current-page')
  currentPage.innerText = page
  moreResultsBtn.onclick = () => {
    page++
    if (url) fetchResults(url, element, page)
  }
}

const fetchResults = async (url, element, page) => {
  try {
    const response = await axios.get(url)
    displayResults(response.data, element, page)
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
    const url = new URL(SEARCH_URL)
    url.searchParams.append('q', query)
    searchInput.value = decodeURIComponent(query)
    const filterItems = sections.filter((item) => {
      return item.dataset.filter
    })
    fetchResults(url, sections[0], 1).then(() => {
      // load first page of results, then first pages of each filter
      filterItems.map((item) => {
        const filterUrl = new URL(url)
        filterUrl.searchParams.append('type', item.dataset.filter)
        fetchResults(filterUrl, item, 1)
      })
    })
  }
}

module.exports = init
