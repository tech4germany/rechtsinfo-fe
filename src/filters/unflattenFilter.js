module.exports = function (content) {
  const contentById = {};
  const hierarchicalContents = [];

  for (const item of content) {
    contentById[item.id] = item;
    item.children = [];
    if (item.parent === null) {
      hierarchicalContents.push(item);
    } else {
      parent = contentById[item.parent.id];
      parent.children.push(item);
    }
  }

  return hierarchicalContents;
};
