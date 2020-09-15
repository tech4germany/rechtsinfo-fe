var requireDir = require("require-dir");
var laws = requireDir(__dirname + "/single/");
module.exports = function () {
  const sections = [];

  Object.keys(laws).forEach((item) => {
    const currentLaw = laws[item].data;
    const articles = currentLaw.contents.filter((article) => {
      return article.type === "article";
    });
    const articleArray = articles.map((articleItem) => ({
      ...articleItem,
      abbreviation: currentLaw.abbreviation,
    }));
    sections.push(...articleArray);
  });
  return sections;
};
