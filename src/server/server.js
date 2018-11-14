import Hapi from 'hapi';
import Inert from 'inert';
import Vision from 'vision';
import HapiSwagger from 'hapi-swagger';
import HapiAuthCookie from 'hapi-auth-cookie';
import Crumb from 'crumb';
import webpack from 'webpack';
import WebpackPlugin from 'hapi-webpack-plugin';

// // Config read from .envs file
// const { port, host } = require('./../../config');
// const configDev = require('../../webpack.dev');
import routes from './routes';

const initializeServer = async ({ envConfig, webpackConfig }) => {
  const compiler = webpack(webpackConfig);

  const server = Hapi.server({
    port: envConfig.port,
    host: envConfig.host,
    routes: {
      files: {
        relativeTo: __dirname,
      },
    },
  });

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
          hot: process.env.NODE_ENV.toUpperCase() === 'DEVELOPMENT', // HMR only in development
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

  return server;
};

// process.on('unhandledRejection', (err) => {
//   console.log(err);
//   process.exit(1);
// });

module.exports = async (configuration) => {
  try {
    return await initializeServer(configuration);
  } catch (e) {
    return console.error(e);
  }
};
