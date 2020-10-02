// // required packages
// const axios = require("axios");
// const path = require("path");
// const chalk = require("chalk");
// const flatCache = require("flat-cache");

// // Config
// const ITEMS_PER_REQUEST = 1;
// const BASE_API_URL = "https://jsonplaceholder.typicode.com";
// const CACHE_KEY = "blogposts";
// const CACHE_FOLDER = path.resolve("./.cache");
// const CACHE_FILE = "blogposts.json";

// /**
//  * Request blogposts
//  * @param {Int} skipRecords - number or records to skip
//  * @return {Object} - Total number of items and API data
//  */
// async function requestPosts(skipRecords = 0) {
//   try {
//     const url = `${BASE_API_URL}/posts?_start=${skipRecords}&_limit=${ITEMS_PER_REQUEST}`;
//     const response = await axios.get(url);

//     // return the total number of items to fetch and the data
//     return {
//       total: parseInt(response.headers["x-total-count"], 10),
//       data: response.data
//     };
//   } catch (err) {
//     console.error(chalk.red("API not responding, no data returned"));
//     return {
//       total: 0,
//       data: []
//     };
//   }
// }

// /**
//  * Get all posts
//  * - check if we have a cache
//  * - if not make api requests and create cache
//  * @return {Array} - array of API data (from cache if there is one or from API)
//  */
// async function getAllPosts() {
//   // load cache
//   const cache = flatCache.load(CACHE_FILE, CACHE_FOLDER);
//   const cachedItems = cache.getKey(CACHE_KEY);

//   // if we have a cache, return cached data
//   if (cachedItems) {
//     console.log(chalk.blue("Blogposts from cache"));
//     return cachedItems;
//   }

//   // if we do not, make queries
//   console.log(chalk.blue("Blogposts from API"));

//   // variables
//   let requests = [];
//   let apiData = [];
//   let additionalRequests = 0;

//   // make first request and marge results with array
//   const request = await requestPosts();
//   apiData.push(...request.data);
//   // calculate how many additional requests we need
//   additionalRequests = Math.ceil(request.total / ITEMS_PER_REQUEST) - 1;

//   // create additional requests
//   for (let i = 1; i <= additionalRequests; i++) {
//     let start = i * ITEMS_PER_REQUEST;
//     const request = requestPosts(start);
//     requests.push(request);
//   }

//   // resolve all additional requests in parallel
//   const allResponses = await Promise.all(requests);
//   allResponses.map((response) => {
//     apiData.push(...response.data);
//   });

//   // sort data as needed
//   apiData.sort((a, b) => {
//     return a.id - b.id;
//   });

//   // set and save cache
//   if (apiData.length) {
//     cache.setKey(CACHE_KEY, apiData);
//     cache.save();
//   }

//   // return data
//   return apiData;
// }

// // export for 11ty
// module.exports = getAllPosts;
