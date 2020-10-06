import '../scss/index.scss'

const deeplink = require('./deeplink')
const scrollTop = require('./scrolltop')
const govUK = require('./govuk')

govUK.initAll()
scrollTop()
deeplink()
