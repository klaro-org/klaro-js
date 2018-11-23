var path = require('path');
var webpack = require('webpack');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 100000
          }
        }]
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
            MiniCssExtractPlugin.loader,
            withEnvSourcemap('css-loader'),
            withEnvSourcemap('sass-loader')
        ],
      },
      {
        test: /\.yaml|yml$/,
        use: ['json-loader', 'yaml-loader']
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
