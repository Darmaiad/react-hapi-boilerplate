const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.common.js');

// Dev server configuration is in the file that sets up Hapi in dev mode

module.exports = merge(common, {
  entry: {
    app: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
      './src/index.js',
      // another: './src/another-module.js',
    ],
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
