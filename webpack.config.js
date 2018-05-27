var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var PUBLIC_DIR = path.resolve(BUILD_DIR, 'public');
var SRC_DIR = path.resolve(__dirname,'src');


var config = {
  target: 'web',
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
  devtool: 'inline-source-maps',
  module : {
    loaders : [
        { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
        {
          test: /\.scss|sass$/,
          loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
        },
        {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader?sourceMap']
        },
        {
          test: /\.yaml|yml$/,
          loaders: ['json-loader', 'yaml-loader'],
        },
        {
        test: /\.less$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "less-loader" // compiles Less to CSS
        }]
        },
        {
        test : /\.jsx?/,
        include : [path.resolve('node_modules'), SRC_DIR],
        loader : 'babel-loader',
        query : {
          presets: [["env", { "modules": false }], 'react', 'stage-2'],
          }
      }
    ]
  },
  entry: [
    'webpack/hot/only-dev-server',
    SRC_DIR + '/consent.js' 
  ],
  output: {
    path: PUBLIC_DIR,
    filename: 'consent.js',
    library: 'consent',
    libraryTarget: 'umd',
    publicPath: ''
  },
  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: ['dist'],
    // match the output path

    publicPath: '',
    // match the output `publicPath`
    historyApiFallback: true,
    //always render index.html if the document does not exist (we need this for correct routing)

    proxy: {
      '/api': {
        target: 'http://localhost:5000/',
        secure: false
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
};

module.exports = config;
