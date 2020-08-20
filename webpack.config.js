const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const SRC_DIR = path.resolve(__dirname, 'src');
const APP_ENV = process.env.APP_ENV || 'dev';
const ANALYZE_BUNDLE = process.env.ANALYZE_BUNDLE !== undefined;
const SEPARATE_CSS = process.env.SEPARATE_CSS !== undefined;
const NO_MINIFY_CSS = process.env.NO_MINIFY_CSS !== undefined;
const APP_DEV_MODE = APP_ENV === 'dev' && process.env.APP_DEV_MODE;
const STYLE_FILES = /\.(sa|sc|c)ss$/;

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function withEnvSourcemap(loader) {
  return APP_ENV === 'dev' ? loader + '?sourceMap' : loader;
}

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
  entry: {
    klaro: SRC_DIR + '/klaro.js',
    'consent-manager': SRC_DIR + '/consent-manager.js'
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    publicPath: ''
  },
  plugins: [
  ]
};

if (ANALYZE_BUNDLE){
  config.plugins.push(new BundleAnalyzerPlugin());
}

if (SEPARATE_CSS){
  config.output.filename = 'klaro-no-css.js'
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  // no CSS does not apply to the consent manager
  delete config.entry['consent-manager']
  config.module.rules.push({
      test: STYLE_FILES,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: APP_ENV === 'dev',
            // reloadAll: true,
          },
        },
        withEnvSourcemap('css-loader'),
        withEnvSourcemap({loader: 'postcss-loader', options: {config: {path: 'postcss.config.js'}}}),
        withEnvSourcemap({loader: 'sass-loader', options: {sassOptions: {outputStyle: NO_MINIFY_CSS ? 'expanded' : 'compressed'}}}),
      ],
    }
  )
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: NO_MINIFY_CSS ? 'klaro.css' : 'klaro.min.css'
    })
  )
} else {
  config.module.rules.push(
    {
      test: STYLE_FILES,
      use: [
        'style-loader',
        withEnvSourcemap('css-loader'),
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            config: {
              path: 'postcss.config.js'
            }
          }
        },
        // withEnvSourcemap({loader: 'postcss-loader', options: {config: {path: 'postcss.config.js'}}}),
        withEnvSourcemap('sass-loader')]
    }
  )
}

if (APP_ENV === 'dev') {
  config = {
    ...config,
    devtool: 'inline-source-maps',
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin({
        VERSION: JSON.stringify('development'),
      })
    ],
  };
}

if (APP_DEV_MODE === 'server') {
  config = {
    ...config,
    devServer: {
      // enable Hot Module Replacement on the server
      hot: true,

      // match the output path
      contentBase: ['dist'],

      // match the output `publicPath`
      publicPath: '',
      // always render index.html if the document does not exist (we need this for correct routing)
      historyApiFallback: true,

      proxy: {
        '/api': {
          target: 'http://localhost:5000/',
          secure: false
        }
      },

      disableHostCheck: true
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
        VERSION: JSON.stringify(process.env.CI_APP_VERSION || process.env.APP_VERSION || process.env.APP_COMMIT || 'unknown'),
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ]
  };
}

module.exports = config;
