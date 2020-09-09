const requireDir = require("require-dir");
const laws = requireDir(__dirname + "/single/");

module.exports = function () {
  return Object.values(laws);
};
