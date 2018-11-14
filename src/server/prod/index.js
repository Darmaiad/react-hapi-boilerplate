require('@babel/register');
require('@babel/polyfill');

const ENV = process.env.NODE_ENV.toUpperCase();

console.log(`Running in: ${ENV} mode`); // eslint-disable-line no-console

// Env config
const config = require('./../../../config');

// function that initializes the production server
const serverInitilizer = require('./prod');

// Start the production server
module.exports = serverInitilizer(config);
