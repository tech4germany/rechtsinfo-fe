const requireDir = require("require-dir");
const laws = requireDir(__dirname + "/multiple/");

module.exports = () => {
  return Object.values(laws);
};
