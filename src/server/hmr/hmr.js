import Hapi from '@hapi/hapi';
import WebpackPlugin from 'hapi-webpack-plugin';
import webpack from 'webpack';

import routes from '../routes/routes';
import plugins from '../plugins';

import sessionConfiguration from '../auth/session/strategy';
import jwtConfiguration from '../auth/jwt/strategy';

/* eslint no-console: 0 */

const initializeServer = async ({ envConfig: { port, host }, webpackConfig }) => {
    const compiler = webpack(webpackConfig);

    const server = Hapi.server({
        port,
        host,
    // routes: {
    //   files: {
    //     relativeTo: __dirname,
    //   },
    // },
    });


    // Register the plugins
    await server.register([
        ...plugins,
        { // Webpack plugin uses webpack-dev-server/middleware underneath, meaning we only want for development
            plugin: WebpackPlugin,
            options: {
                compiler, // Webpack configuration
                assets: { // Webpack dev-server configuration
                    contentBase: './dist',
                    hot: true,
                },
                hot: {}, // Webpack hot-middleware configuration
            },
        },
    ]);

    // Setting the cookie to the server's cache
    const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
    server.app.cache = cache;

    // Name and configure the Authentication strategies
    server.auth.strategy('session', 'cookie', sessionConfiguration(server));
    server.auth.strategy('jwt', 'jwt', jwtConfiguration(server));

    // Set default auth strategies. These strategies will apply to any routes declared AFTER this point
    server.auth.default({ strategies: ['session', 'jwt'] });

    // Register the API routes
    await server.route(routes);

    // Serve the static content that webpack created
    // await server.route({
    //   method: 'GET',
    //   path: '/{path*}',
    //   handler: {
    //     directory: {
    //       path: './dist',
    //       listing: false,
    //       index: true,
    //     },
    //   },
    // });

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
