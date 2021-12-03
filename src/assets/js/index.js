import '../scss/index.scss'

const deeplink = require('./deeplink')
const scrollTop = require('./scrolltop')
const govUK = require('./govuk')
const search = require('./search')
const disclaimerModal = require('./disclaimer-modal')

govUK.initAll()
search()
scrollTop()
deeplink()
disclaimerModal()
