const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const prodConfig = require('./webpack.prod.js');
const devConfig = require('./webpack.dev.js');

module.exports = (env, argv) => {
  switch (argv.mode) {
    case 'development':
      return merge(baseConfig, devConfig);
    case 'production':
      return merge(baseConfig, prodConfig);
    default:
      throw new Error('No matching configuration was found!');
  }
};
