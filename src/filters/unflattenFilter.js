module.exports = function (content) {
  const contentById = {}
  const hierarchicalContents = []

  for (const item of content) {
    contentById[item.id] = item
    item.children = []
    if (item.parent === null) {
      hierarchicalContents.push({
        id: item.id,
        name: item.name,
        title: item.title,
        children: item.children,
      })
    } else {
      parent = contentById[item.parent.id]
      parent.children.push({
        id: item.id,
        name: item.name,
        title: item.title,
        parent: item.parent,
        children: item.children,
      })
    }
  }

  return hierarchicalContents
}
