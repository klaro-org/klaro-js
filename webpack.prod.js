const webpack = require('webpack');

module.exports = {
    mode: 'production',
    optimization: {
        minimize: true,
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
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
