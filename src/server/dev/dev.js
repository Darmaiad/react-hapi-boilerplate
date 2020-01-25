import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';

import routes from '../routes/routes';
import plugins from '../plugins';

import sessionConfiguration from '../auth/session/strategy';
import jwtConfiguration from '../auth/jwt/strategy';

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

    // Register the plugins
    await server.register(plugins);
    server.validator(Joi);

    // Setting the cookie to the server's cache
    server.app.cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });

    // Name and configure the Authentication strategies
    server.auth.strategy('session', 'cookie', sessionConfiguration(server));
    server.auth.strategy('jwt', 'jwt', jwtConfiguration(server));

    // Set default auth strategies. These strategies will apply to any routes declared AFTER this point
    server.auth.default({ strategies: ['session', 'jwt'] });

    // Register the API routes
    await server.route(routes);

    // Serve the static content that webpack created
    await server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './../../../dist',
                listing: false,
                index: true,
            },
        },
    });

    server.ext('onPreResponse', (req, h) => {
        const { response } = req;

        console.log('--> Status Code: ', response.statusCode);

        if (response.isBoom && response.output.statusCode === 404) {
            return h.file('./../../../dist/index.html', { confine: false });
        }
        return h.continue;
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
