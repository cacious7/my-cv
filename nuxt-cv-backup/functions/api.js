const serverless = require('serverless-http');
const app = require('../server'); // Our main express app

module.exports.handler = serverless(app);
