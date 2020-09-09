var requireDir = require("require-dir");
var laws = requireDir(__dirname + "/single/");
module.exports = function () {
  const sections = [];

  Object.keys(laws).forEach((item) => {
    const slug = laws[item].data.abbreviation;
    const articles = laws[item].data.contents.filter((article) => {
      return article.type === "article";
    });
    const test = articles.map((entry) => ({
      ...entry,
      abbreviation: slug,
    }));
    sections.push(...test);
  });
  return sections;
};
