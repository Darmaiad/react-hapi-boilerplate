const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision')
const Handlebars = require('handlebars');
const Joi = require('joi');

const webpack = require('webpack');
const WebpackPlugin = require('hapi-webpack-plugin');

const config = require('./webpack.dev');

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

// const rootHandler = (request, h) => h.view('index', {
//   message: 'Hello Handlebars!',
//   path: '/dist',
// });

const init = async () => {
  await server.register([
    Inert,
    {
      plugin: WebpackPlugin,
      options: {
        compiler, // Webpack configuration
        assets: { // Webpack dev-server configuration
          contentBase: './dist',
          hot: true,
        },
        hot: {
          // hrm conf
        },
      },
    },
  ]);

  // await server.route({ method: 'GET', path: '/', handler: rootHandler });

  // await server.route({
  //   method: 'GET',
  //   path: '/dist/app.js',
  //   handler: (request, h) => h.file(Path.join(__dirname, 'dist') + '/app.js'),
  // });

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

  // await server.route(require(Path.join(__dirname, 'dist') + '/app.js'))

  // await server.views({
  //   engines: { html: Handlebars },
  //   relativeTo: __dirname,
  //   path: Path.join(__dirname, 'src/layout'),
  // });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
