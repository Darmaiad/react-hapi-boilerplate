const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const Joi = require('joi');
const webpack = require('webpack');
const WebpackPlugin = require('hapi-webpack-plugin');

const config = require('./../../webpack.prod');

const compiler = webpack(config);

const server = Hapi.server({
  port: 3001,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: __dirname,
    },
  },
});

const init = async () => {
  await server.register([
    Inert,
    {
      plugin: WebpackPlugin,
      options: { compiler, assets: {}, hot: {} },
    },
  ]);

  // Serve the static content that webpack created
  await server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: './dist',
        listing: false,
        index: true,
      },
    },
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
