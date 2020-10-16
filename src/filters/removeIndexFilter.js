module.exports = function (array) {
  const content = array.filter((item) => {
    return (
      item.name !== 'Inhaltsverzeichnis' &&
      item.name !== 'Inhalts\u00fcbersicht'
    )
  })
  return content
}
