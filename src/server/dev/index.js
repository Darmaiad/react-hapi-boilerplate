require('@babel/register');
require("core-js/stable");
require("regenerator-runtime/runtime");

const ENV = process.env.NODE_ENV.toUpperCase();

console.log(`Running in: ${ENV} mode`); // eslint-disable-line no-console

// Env config
const config = require('./../../../config');

// function that initializes the development server
const serverInitializer = require('./dev');

// Start the development server
module.exports = serverInitializer(config);
