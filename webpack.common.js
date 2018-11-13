const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const webpack = require('webpack');

const config = require('./config');

console.log('process.env.NODE_ENV:\n', process.env.NODE_ENV)

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    // app: [
    //   'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    //   './src/index.js',
    //   // another: './src/another-module.js',
    // ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'RH Boilerplate',
      template: Path.join(__dirname, '/src/index.html'),
    }),
    // new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    filename: '[name].js',
    path: Path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
