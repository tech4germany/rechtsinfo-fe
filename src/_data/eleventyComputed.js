module.exports = {
  tableOfContents: function (abbreviation, current) {
    const item = laws.find((law) => {
      law.data.abbreviation === abbreviation
    })
    return 'Hello'
  },
}
