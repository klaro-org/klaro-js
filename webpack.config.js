var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var PUBLIC_DIR = path.resolve(BUILD_DIR, 'public');
var SRC_DIR = path.resolve(__dirname,'src');
var APP_ENV = process.env.APP_ENV || 'dev';


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
  module: {
    loaders: [
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },
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
        test: /\.jsx?/,
        include: [path.resolve('node_modules'), SRC_DIR],
        loader: 'babel-loader',
        query: {
          presets: [["env", { "modules": false }], 'react', 'stage-2'],
        }
      }
    ]
  },
  entry: [
    SRC_DIR + '/klaro.js'
  ],
  output: {
    path: BUILD_DIR,
    filename: 'klaro.js',
    library: 'klaro',
    libraryTarget: 'umd',
    publicPath: ''
  }
};

if (APP_ENV === 'dev') {
  config.devtool = 'inline-source-maps';
  config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      VERSION : JSON.stringify('development'),
    })
  ];
  config.entry = [
    'webpack/hot/only-dev-server',
    config.entry[0]
  ];
  config.devServer = {
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
  };
}

if (APP_ENV === 'production') {
  config.plugins = [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      VERSION : JSON.stringify(process.env.CI_APP_VERSION || process.env.APP_VERSION || process.env.APP_COMMIT || 'unknown'),
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
  ];
}

module.exports = config;
