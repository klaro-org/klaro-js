module.exports = {
  "plugins": [
    "@babel/plugin-transform-runtime",
    "convert-to-json"
  ],
  "presets": [
    ["@babel/preset-env", {
      "modules": process.env.BABEL_ENV === 'cjs' ? 'cjs' : false,
      "targets": {
        "ie": "11",
        "firefox": "60" // firefox esr
      }
    }],
    "@babel/preset-react"
  ]
};
