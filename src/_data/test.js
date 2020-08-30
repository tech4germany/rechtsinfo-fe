var alg = require("./single/alg.json");

const paragraphs = [];
const gliederung = {};

const getArticles = (data) => {
  data.map((item) => {
    if (item.type === "article") {
      paragraphs.push(item);
    }
    if (item.children) {
      getArticles(item.children);
    }
  });
};

module.exports = function () {
  alg.content.map((item) => {
    if (item.type === "article") {
      paragraphs.push(item);
    }
    if (item.children) {
      getArticles(item.children);
    }
  });

  return paragraphs;
};
