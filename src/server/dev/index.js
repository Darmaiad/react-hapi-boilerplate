require('@babel/register');
require('@babel/polyfill');

const ENV = process.env.NODE_ENV.toUpperCase();

console.log(`Running in: ${ENV} mode`); // eslint-disable-line no-console

// Env config
const config = require('./../../../config');

// function that initializes the development server
const serverInitializer = require('./dev');

// Start the development server
module.exports = serverInitializer(config);
