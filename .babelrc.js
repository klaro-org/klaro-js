module.exports = {
  "plugins": (process.env.BABEL_ENV === 'umd')
    ? ["@babel/plugin-transform-runtime"]
    : [],
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
