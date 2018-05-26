var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'docs');
var PUBLIC_DIR = path.resolve(BUILD_DIR, 'public');
var SRC_DIR = path.resolve(__dirname,'src');
var APP_ENV = process.env.APP_ENV || 'dev';

var config = {
  context: SRC_DIR,
  resolve: {
    symlinks: false,
    extensions: ['.js', '.jsx'],
    modules: [
      SRC_DIR,
      "node_modules"
    ],
    alias: {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  },
  module : {
    loaders : [
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      {
        test: /\.(scss|sass)$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.yaml|yml$/,
        loaders: ['json-loader', 'yaml-loader'],
      },
      {
        test : /\.jsx?/,
        include : [SRC_DIR, path.resolve("node_modules")],
        loader : 'babel-loader',
        query : {
          presets: [["env", { "modules": false }], 'react', 'stage-2']
        }
      }
    ]
  },
  entry: [
    SRC_DIR + '/consent.js'
  ],
  output: {
    path: BUILD_DIR,
    filename: 'consent.js',
    publicPath: '/public'
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.DefinePlugin({
             'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        comments: false,
        minimize: true,
        sourceMaps: false,
    }),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
};

module.exports = config;
