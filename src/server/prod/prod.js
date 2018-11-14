import Hapi from 'hapi';

import routes from '../routes';
import plugins from '../plugins';

/* eslint no-console: 0 */

const initializeServer = async ({ port, host }) => {
  const server = Hapi.server({
    port,
    host,
    routes: {
      files: {
        relativeTo: __dirname,
      },
    },
  });

  await server.register(plugins);

  // Setting the cookie to the server's cache
  const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
  server.app.cache = cache;

  server.auth.strategy('session', 'cookie', {
    password: 'KwGv0d828tkWEhI9WOGLg1pqHFXIs3Q4ENAJsnHjgEYgDYzZ', // Generated at random
    cookie: 'sid-example',
    redirectTo: '/login',
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
        path: './../../../dist',
        listing: false,
        index: true,
      },
    },
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);

  return server;
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

module.exports = async (configuration) => {
  try {
    return await initializeServer(configuration);
  } catch (e) {
    return console.error(e);
  }
};
