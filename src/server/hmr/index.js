require('@babel/register');

const ENV = process.env.NODE_ENV.toUpperCase();

console.log(`Running in: ${ENV} mode with HMR`); // eslint-disable-line no-console

// Env config
const envConfig = require('./../../../config');
// Development webpack config
const webpackConfig = require('./../../../webpack/webpack.hmr');
// function that initializes the webpack dev server
const serverInitializer = require('./hmr');

// Start the development server
module.exports = serverInitializer({ envConfig, webpackConfig });
