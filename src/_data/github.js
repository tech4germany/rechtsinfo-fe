// const fetch = require("node-fetch");

// module.exports = async function () {
//   console.log("Fetching new github stargazers count…");

//   // GitHub API: https://developer.github.com/v3/repos/#get
//   return fetch("https://api.github.com/repos/11ty/eleventy")
//     .then((res) => res.json()) // node-fetch option to transform to json
//     .then((json) => {
//       // prune the data to return only what we want
//       return {
//         stargazers: json.stargazers_count,
//       };
//     });
// };
