var path = require('path');
var webpack = require('webpack');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var packageInfo = require('./package.json');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var SRC_DIR = path.resolve(__dirname,'src');
var IS_DEV = process.env.NODE_ENV === 'development';

var config = {
  mode: IS_DEV ? 'development' : 'production',
  target: 'web',
  context: SRC_DIR,
  resolve: {
    symlinks: false,
    extensions: ['.js', '.jsx'],
    alias: {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  },
  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/,
        use: [
            MiniCssExtractPlugin.loader,
            withEnvSourcemap('css-loader'),
            withEnvSourcemap('sass-loader')
        ],
      },
      {
        test: /\.jsx?/,
        include: [SRC_DIR],
        use: ['babel-loader']
      }
    ]
  },
  entry: [
    SRC_DIR + '/orejime.js',
    SRC_DIR + '/scss/orejime.scss'
  ],
  output: {
    path: BUILD_DIR,
    filename: 'orejime.js',
    library: 'Orejime',
    libraryTarget: 'umd',
    publicPath: ''
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'orejime.css'
    }),
    new webpack.BannerPlugin({
      banner: packageInfo.name + ' v' + packageInfo.version + ' - ' + packageInfo.license + ' license, '
        + 'original work Copyright (c) 2018 DPKit, '
        + 'modified work Copyright (c) 2019 Empreinte Digitale, '
        + 'all rights reserved.'
    })
  ]
};

if (IS_DEV) {
  config.devtool = 'inline-source-maps';
}

module.exports = config;

function withEnvSourcemap(loader) {
  return IS_DEV ? loader + '?sourceMap' : loader;
}
