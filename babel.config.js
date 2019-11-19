// This is the configuration file for babel
/* eslint-env node */
module.exports = {
    presets: [
        ["@babel/preset-env", {
            useBuiltIns: "entry",
            corejs: 3,
        }],
        "@babel/preset-react"
    ],
    plugins: [
        "@babel/plugin-proposal-object-rest-spread"
    ]
};
