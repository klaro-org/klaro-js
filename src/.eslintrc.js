/* eslint-env node */
module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        // "plugin:prettier/recommended",
        "plugin:react/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "eqeqeq": "error",
        "indent": ["error", 4, {"SwitchCase": 1}],
        "linebreak-style": ["error", "unix"],
        "no-alert": "error",
        "no-confusing-arrow": "error",
        "no-console": "error",
        "no-implied-eval": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-throw-literal": "error", // only allow Errors to be thrown; the name is a historical artifact
        "no-trailing-spaces": "error",
        "no-var": "error",
        "prefer-const": "error",
        "yoda": "error",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "react/prop-types": "warn", // to become an error
        "react/default-props-match-prop-types": "error",
        "react/forbid-foreign-prop-types": "error",
        "react/no-unused-prop-types": "error",
        "react/sort-prop-types": ["error", {"callbacksLast": true}],
        "react/no-string-refs": "warn", // to become an error
        "eol-last": ["error", "always"]
    }
};
