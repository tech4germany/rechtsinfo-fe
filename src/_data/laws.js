const requireDir = require("require-dir");
const laws = requireDir(__dirname + "/single/");

module.exports = async function () {
  return Object.values(laws);
};
