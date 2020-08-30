const searchFilter = require("./src/filters/searchFilter");

module.exports = function (config) {
  config.addPassthroughCopy("src/js");
  config.addPassthroughCopy("src/assets/images");

  // config.addFilter("search", searchFilter);

  // config.addCollection("movies", (collection) => {
  //   return [...collection.getFilteredByGlob("./src/movies/**/*.md")];
  // });

  // config.addCollection("gesetze", (collection) => {
  //   return [...collection.getFilteredByGlob("./src/gesetze/*.json")];
  // });

  config.addLayoutAlias("main", "layouts/main.njk");

  return {
    dir: {
      input: "src",
      output: "_site",
    },
    passthroughFileCopy: true,
  };
};
