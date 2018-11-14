const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const HapiAuthCookie = require('hapi-auth-cookie');
const Crumb = require('crumb');
const Handlebars = require('handlebars');
const webpack = require('webpack');
const WebpackPlugin = require('hapi-webpack-plugin');

// Config read from .envs file
const { port, host } = require('./../../config');
const configDev = require('./../../webpack.dev');
const routes = require('./routes');

const compiler = webpack(configDev);

const server = Hapi.server({
  port,
  host,
  routes: {
    files: {
      relativeTo: __dirname,
    },
  },
});

const init = async () => {
  await server.register([
    Inert,
    Vision, // Needed for swagger
    HapiAuthCookie,
    {
      plugin: WebpackPlugin,
      options: {
        compiler, // Webpack configuration
        assets: { // Webpack dev-server configuration
          contentBase: './dist',
          hot: true,
        },
        hot: {}, // Webpack hot-middleware configuration
      },
    }, {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'Test API Documentation',
          version: '0.0.3',
        },
      },
    }, {
      plugin: Crumb,
      options: {
        restful: true,
        cookieOptions: {
          isSecure: false,
        },
      },
    },
  ]);

  // Setting the cookie to the server's cache
  const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
  server.app.cache = cache;

  server.auth.strategy('session', 'cookie', {
    password: 'KwGv0d828tkWEhI9WOGLg1pqHFXIs3Q4ENAJsnHjgEYgDYzZ', // Generated at random
    cookie: 'sid-example',
    redirectTo: false,
    // redirectTo: '/login',
    isSecure: false,
    validateFunc: async (request, session) => {
      const cached = await cache.get(session.sid);
      const out = {
        valid: !!cached,
      };

      if (out.valid) {
        out.credentials = cached.account;
      }

      return out;
    },
  });

  // Set default auth strategy begore registering any routes you want them to apply on
  server.auth.default('session');

  // Register the API routes
  await server.route(routes);

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
