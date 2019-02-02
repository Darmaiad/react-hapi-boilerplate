const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// For favicon generation: https://medium.com/tech-angels-publications/bundle-your-favicons-with-webpack-b69d834b2f53

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        app: [
            './src/index.js',
            // another: './src/another-module.js',
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'RH Boilerplate',
            template: Path.join(__dirname, '../src/index.html'),
        }),
    ],
    output: {
        filename: '[name].js',
        path: Path.resolve(__dirname, '../dist'),
        publicPath: '/',
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: {
                loader: 'babel-loader',
            },
            exclude: /node_modules/,
        }, {
            test: /\.scss$/,
            use: [
                'style-loader', // creates style nodes from JS strings
                'css-loader', // translates CSS into CommonJS
                'sass-loader', // compiles Sass to CSS, using Node Sass by default
            ],
        }],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    resolve: {
        extensions: ['.js', '.jsx', 'scss'],
    },
};
