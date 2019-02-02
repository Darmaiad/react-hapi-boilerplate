import Joi from 'joi';

import hanlders from '../handlers';
import AbstractManager from '../managers/abstractManager';

const { generate, genericGet, genericPost, logout, login, token, getConfiguration } = hanlders;

const routes = [{
    method: 'GET',
    path: '/crumb',
    options: {
        tags: ['api'],
        description: 'Generate crumb token for the given client',
        notes: 'Generate crumb token for the given client',
    },
    handler: AbstractManager(generate),
}, {
    method: 'GET',
    path: '/logout',
    options: {
        tags: ['api'],
    },
    handler: AbstractManager(logout),
}, {
    method: 'GET',
    path: '/generic',
    options: {
        description: 'generic endpoint desc',
        notes: 'generic endpoint note',
        tags: ['api'],
    },
    handler: AbstractManager(genericGet),
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
    handler: AbstractManager(genericPost),
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
    handler: AbstractManager(login),
}, {
    method: ['GET'],
    path: '/login',
    options: {
        auth: { mode: 'try' },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } },
        tags: ['api'],
    },
    handler: AbstractManager(login),
}, {
    method: 'GET',
    path: '/unrestricted',
    options: {
        auth: false,
        description: 'generic token unprotected endpoint desc',
        notes: 'generic token unprotected endpoint',
        tags: ['api'],
    },

    handler: AbstractManager((request, h) => ({ text: 'Token not required' })),
}, {
    method: 'GET',
    path: '/restricted',
    options: {
        description: 'generic token protected endpoint desc',
        notes: 'generic token protected endpoint',
        tags: ['api'],
        validate: {
            headers: Joi.object({ authorization: Joi.string().label('Token') }).unknown(0).label('Headers'),
        },
    },
    handler: AbstractManager((request, h) => {
        const response = h.response({ message: 'You used a Valid JWT Token to access /restricted endpoint!' });
        response.header('Authorization', request.headers.authorization);
        return response;
    }),
}, {
    method: 'POST',
    path: '/token',
    options: {
        auth: false,
        description: 'get token based on user credentials',
        notes: 'get token based on user credentials',
        tags: ['api'],
        validate: {
            payload: {
                username: Joi.string(),
                password: Joi.string(),
            },
        },
        plugins: {
            'hapi-auth-cookie': { redirectTo: false },
            crumb: false,
        },

    },
    handler: AbstractManager(token),
}, {
    method: 'GET',
    path: '/config',
    options: {
        auth: false,
        description: 'Get current configuration object',
        notes: 'Get current configuration object',
        tags: ['api'],
    },

    handler: AbstractManager(getConfiguration),
}];

module.exports = routes;
