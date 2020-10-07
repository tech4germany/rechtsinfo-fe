import '../scss/index.scss'

const deeplink = require('./deeplink')
const scrollTop = require('./scrolltop')
const govUK = require('./govuk')
const search = require('./search')

govUK.initAll()
search()
scrollTop()
deeplink()
