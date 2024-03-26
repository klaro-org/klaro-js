const webpack = require('webpack');
const path = require('path');
const SRC_DIR = path.resolve(__dirname, 'src');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    optimization: {
        minimize: false,
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify('development'),
        })
    ],
    devServer: {
        hot: true,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        historyApiFallback: true,
        client: {
            overlay: true,
        },
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:5000',
                secure: false,
            },
        ],
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
        allowedHosts: 'all',
    }
};
