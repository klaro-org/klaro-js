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

const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function withEnvSourcemap(loader) {
    return APP_ENV === 'dev' ? loader + '?sourceMap' : loader;
}

let config = {
    mode: 'development',
    target: 'web',
    context: SRC_DIR,
    resolve: {
        symlinks: false,
        extensions: ['.jsx', '.js', '.tsx', '.ts'],
        modules: [SRC_DIR, 'node_modules'],
        alias: {},
    },
    module: {
        rules: [
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: 'url-loader?limit=100000',
            },
            {
                test: /\.yaml|yml$/,
                use: ['json-loader', 'yaml-loader'],
            },
            {
                test: /\.jsx?/,
                include: [SRC_DIR],
                loader: 'babel-loader',
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    entry: {
        // here we only define the consent manager and the translations, the
        // main Klaro files are defined below as they require special naming rules
        cm: SRC_DIR + '/consent-manager.js',
        translations: SRC_DIR + '/translations.js',
        ide: SRC_DIR + '/ide.js',
    },
    output: {
        path: BUILD_DIR,
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        publicPath: '',
    },
    plugins: [],
};

if (ANALYZE_BUNDLE) {
    config.plugins.push(new BundleAnalyzerPlugin());
}

if (SEPARATE_CSS) {
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    // no CSS does not apply to the consent manager and translations
    config.module.rules.push({
        test: STYLE_FILES,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                // options: {
                //     // hmr: APP_ENV === 'dev',
                //     // reloadAll: true,
                // },
            },
            {
                loader: 'css-loader',
                options: {
                    sourceMap: APP_ENV === 'dev',
                },
            },
            withEnvSourcemap({
                loader: 'postcss-loader',
                options: { postcssOptions: { path: 'postcss.config.js' } },
            }),
            {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                        sourceMap: APP_ENV === 'dev',
                        outputStyle: NO_MINIFY_CSS ? 'expanded' : 'compressed',
                    },
                },
            },
        ],
    });
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: NO_MINIFY_CSS ? 'klaro.css' : 'klaro.min.css',
        })
    );
} else {
    config.module.rules.push({
        test: STYLE_FILES,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    sourceMap: APP_ENV === 'dev',
                },
            },
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                    postcssOptions: {
                        path: 'postcss.config.js',
                    },
                },
            },
            // withEnvSourcemap({loader: 'postcss-loader', options: {config: {path: 'postcss.config.js'}}}),
            {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                        sourceMap: APP_ENV === 'dev',
                    },
                },
            },
        ],
    });
}

if (APP_ENV === 'dev') {
    config = {
        ...config,
        devtool: 'inline-source-map',
        plugins: [
            ...config.plugins,
            new webpack.DefinePlugin({
                VERSION: JSON.stringify('development'),
            }),
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
            static: {
                directory: path.join(__dirname, 'dist'),
            },

            // match the output `publicPath`
            // publicPath: '',
            // always render index.html if the document does not exist (we need this for correct routing)
            historyApiFallback: true,

            client: {
                overlay: true,
            },

            proxy: {
                '/api': {
                    target: 'http://localhost:5000/',
                    secure: false,
                },
            },

            // we enable CORS requests (useful for testing)
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':
                    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers':
                    'X-Requested-With, content-type, Authorization',
            },
            allowedHosts: 'all',
        },
        plugins: [...config.plugins],
    };
}

if (APP_ENV === 'production') {
    config = {
        ...config,
        mode: 'production',
        optimization: {
            minimize: true,
        },
        plugins: [
            ...config.plugins,
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false,
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"',
                VERSION: JSON.stringify(
                    process.env.CI_APP_VERSION ||
                        process.env.APP_VERSION ||
                        process.env.APP_COMMIT ||
                        'unknown'
                ),
            }),
            new webpack.optimize.AggressiveMergingPlugin(),
        ],
    };
}

// we create separate configs for Klaro with and without translations as
// Webpack isn't able to generate two modules with different filenames but
// the same module name...

const klaroWithTranslationsConfig = {
    ...config,
    ...{
        output: {
            path: BUILD_DIR,
            filename: SEPARATE_CSS ? 'klaro-no-css.js' : 'klaro.js',
            library: 'klaro',
            libraryTarget: 'umd',
            publicPath: '',
        },
        entry: {
            klaro: SRC_DIR + '/klaro.js',
        },
    },
};

const klaroWithoutTranslationsConfig = {
    ...config,
    ...{
        output: {
            path: BUILD_DIR,
            filename: SEPARATE_CSS
                ? 'klaro-no-translations-no-css.js'
                : 'klaro-no-translations.js',
            library: 'klaro',
            libraryTarget: 'umd',
            publicPath: '',
        },
        entry: {
            klaro: SRC_DIR + '/klaro-no-translations.js',
        },
    },
};

if (APP_DEV_MODE === 'server') {
    // we only serve the regular version
    module.exports = klaroWithTranslationsConfig;
} else {
    // we build all variations
    module.exports = [
        klaroWithoutTranslationsConfig,
        klaroWithTranslationsConfig,
    ];    
}
