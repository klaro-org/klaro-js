const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const PUBLIC_DIR = path.resolve(BUILD_DIR, 'public');
const SRC_DIR = path.resolve(__dirname,'src');
const APP_ENV = process.env.APP_ENV || 'dev';
const APP_DEV_MODE = APP_ENV === 'dev' && process.env.APP_DEV_MODE;


let config = {
  mode: 'development',
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
      "react": "preact/compat",
      "react-dom": "preact/compat"
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: 'url-loader?limit=100000'
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
        use: ['json-loader', 'yaml-loader'],
      },
      {
        test: /\.jsx?/,
        include: [SRC_DIR],
        loader: 'babel-loader'
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
  },
  plugins: []
};

if (APP_ENV === 'dev') {
  config = {
    ...config,
    devtool: 'inline-source-maps',
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin({
        VERSION : JSON.stringify('development'),
      })
    ],
  };
}

if (APP_DEV_MODE === 'server') {
  config = {
    ...config,
    entry: [
      'webpack/hot/only-dev-server',
      config.entry[0]
    ],
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
      ...config.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ]
  }
}

if (APP_ENV === 'production') {
  config = {
    ...config,
    mode: 'production',
    optimization: {
      minimize: true
    },
    plugins: [
      ...config.plugins,
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
        VERSION : JSON.stringify(process.env.CI_APP_VERSION || process.env.APP_VERSION || process.env.APP_COMMIT || 'unknown'),
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ]
  };
}

module.exports = config;

function withEnvSourcemap(loader) {
  return APP_ENV === 'dev' ? loader + '?sourceMap' : loader;
}
