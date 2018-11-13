var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var PUBLIC_DIR = path.resolve(BUILD_DIR, 'public');
var SRC_DIR = path.resolve(__dirname,'src');
var IS_DEV = process.env.NODE_ENV === 'development';
var WITH_CSS = process.env.APP_CSS || false;

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
        test: /\.scss|sass$/,
        use: ['style-loader', withEnvSourcemap('css-loader'), withEnvSourcemap('sass-loader')]
      },
      {
        test: /\.css$/,
        use: ['style-loader', withEnvSourcemap('css-loader')]
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
    SRC_DIR + '/klaro.js'
  ],
  output: {
    path: BUILD_DIR,
    filename: 'klaro-no-css.js',
    library: 'Klaro',
    libraryTarget: 'umd',
    publicPath: ''
  },
  plugins: []
};

if (IS_DEV) {
  config.devtool = 'inline-source-maps';
}

if (WITH_CSS) {
  config.entry = [SRC_DIR + '/scss/klaro.scss'].concat(config.entry);
  config.output.filename = 'klaro.js';
}

module.exports = config;

function withEnvSourcemap(loader) {
  return IS_DEV ? loader + '?sourceMap' : loader;
}
