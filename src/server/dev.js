const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const HapiAuthCookie = require('hapi-auth-cookie');
const Crumb = require('crumb');
const Handlebars = require('handlebars');
const Joi = require('joi');
const webpack = require('webpack');
const WebpackPlugin = require('hapi-webpack-plugin');

const config = require('./../../webpack.dev');

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

let uuid = 1; // Replace it with v4 or something

const users = {
  jo: {
    id: 'jo',
    password: 'pass',
    name: 'jo Doe',
  },
};

const login = async (request, h) => {
  if (request.auth.isAuthenticated) {
    console.log(request.state);
    return 'User isAuthenticated';
    // return h.redirect('/');
  }

  let message = '';
  let account = null;

  if (request.method === 'post') {
    if (!request.payload.username || !request.payload.password) {
      message = 'Missing username or password';
    } else {
      account = users[request.payload.username];
      if (!account || account.password !== request.payload.password) {
        message = 'Invalid username or password';
      }
    }
  }

  if (request.method === 'get') {
    return 'Login to access this API';
  }

  if (message) {
    return `message: ${message}`;
  }

  const sid = String(uuid += 1);

  await request.server.app.cache.set(sid, { account }, 0);
  request.cookieAuth.set({ sid });

  return true;
};

const logout = (request, h) => {
  request.server.app.cache.drop(request.state['sid-example'].sid);
  request.cookieAuth.clear();
  return h.redirect('/');
};

const generate = (request, h) => ({
  crumb: server.plugins.crumb.generate(request, h),
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

  await server.route({
    method: 'GET',
    path: '/crumb',
    options: {
      tags: ['api'],
      description: 'Generate crumb token for the given client',
      notes: 'Generate crumb token for the given client',
    },
    handler: generate,
  });

  server.route([{
    method: ['POST'],
    path: '/login',
    options: {
      handler: login,
      auth: { mode: 'try' },
      // Any request that does not adhere to the session strategy will be redicted to /login
      // weel, we must prevent this one from redirecting to itself
      plugins: {
        'hapi-auth-cookie': { redirectTo: false },
        crumb: false,
      },
      tags: ['api'],
      validate: {
        payload: {
          username: Joi.string(),
          password: Joi.string(),
        },
      },
    },
  }, {
    method: ['GET'],
    path: '/login',
    options: {
      handler: login,
      auth: { mode: 'try' },
      plugins: { 'hapi-auth-cookie': { redirectTo: false } },
      tags: ['api'],
    },
  }, {
    method: 'GET',
    path: '/logout',
    options: { handler: logout, tags: ['api'] },
  }, {
    method: 'POST',
    path: '/generic',
    options: {
      description: 'generic endpoint desc',
      notes: 'generic endpoint note',
      tags: ['api'],
      validate: {
        headers: Joi.object({ 'X-CSRF-Token': Joi.string() }).unknown(0).label('Headers'),
      },
    },
    handler: (request, h) => {
      console.log('POST request.state:\n', request.state);
      return h.response('Generic reply');
    },
  }, {
    method: 'GET',
    path: '/generic',
    options: {
      description: 'generic endpoint desc',
      notes: 'generic endpoint note',
      tags: ['api'],
    },
    handler: (request, h) => {
      console.log('request.state:\n', request.state);
      return h.response('Generic GET reply');
    },
  }]);

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
