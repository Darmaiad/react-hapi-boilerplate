const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.common.js');

// Webpack-dev-server configuration is in the file that sets up the deveopment mode of Hapi

module.exports = merge(common, {
    entry: {
        app: [
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
            // another: './src/another-module.js',
        ],
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
});
