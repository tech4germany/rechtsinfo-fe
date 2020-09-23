module.exports = function (array, filterString) {
  const result = array.find((obj) => {
    return obj.name === filterString
  })
  return result.toc
}
