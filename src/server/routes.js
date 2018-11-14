const Joi = require('joi');
const { generate, genericGet, genericPost, logout, login } = require('./manager');

const routes = [{
  method: 'GET',
  path: '/crumb',
  options: {
    tags: ['api'],
    description: 'Generate crumb token for the given client',
    notes: 'Generate crumb token for the given client',
  },
  handler: generate,
}, {
  method: 'GET',
  path: '/logout',
  options: {
    tags: ['api'],
  },
  handler: logout,
}, {
  method: 'GET',
  path: '/generic',
  options: {
    description: 'generic endpoint desc',
    notes: 'generic endpoint note',
    tags: ['api'],
  },
  handler: genericGet,
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
  handler: genericPost,
}, {
  method: ['POST'],
  path: '/login',
  options: {
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
  handler: login,
}, {
  method: ['GET'],
  path: '/login',
  options: {
    auth: { mode: 'try' },
    plugins: { 'hapi-auth-cookie': { redirectTo: false } },
    tags: ['api'],
  },
  handler: login,
}];

module.exports = routes;
