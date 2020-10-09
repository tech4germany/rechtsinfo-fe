import '../scss/index.scss'

const deeplink = require('./deeplink')
const scrollTop = require('./scrolltop')
const govUK = require('./govuk')
const search = require('./search')
const disclaimer = require('./disclaimer')

govUK.initAll()
search()
scrollTop()
deeplink()
disclaimer()
