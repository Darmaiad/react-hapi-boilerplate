require('@babel/register');

const ENV = process.env.NODE_ENV.toUpperCase();

console.log(`Running in: ${ENV} environment`);

// Depending on ENV, decide which webpack config will be used
let webpackConfig = require('./../../webpack.dev');
// let suffix = 'dev';
if (ENV === 'PRODUCTION') webpackConfig = require('./../../webpack.prod'); // eslint-disable-line global-require

// Config read from .envs file
const envConfig = require('./../../config');

// Get a server initialization function and pass it the two configuration objects in order to start the server
const Server = require('./server')({ envConfig, webpackConfig });

module.exports = Server;
