require('@babel/register');

const ENV = process.env.NODE_ENV.toUpperCase();

console.log(`Running in: ${ENV} mode`); // eslint-disable-line no-console

// Env config
const envConfig = require('./../../../config');
// Development webpack config
const webpackConfig = require('./../../../webpack.dev');
// function that initializes the development server
const serverInitilizer = require('./dev');

// Start the development server
module.exports = serverInitilizer({ envConfig, webpackConfig });