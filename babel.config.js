// This is the configuration file for babel
/* eslint-env node */
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: false,
            },
        ],
        '@babel/preset-react',
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
    ],
};
