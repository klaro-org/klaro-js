# Klaro and Webpack

This example shows how to import and use Klaro as a node module via webpack.

**Note:** This example makes use of the NPM version of Klaro by default. If you want to use the local version instead (e.g. for development), do the following:

* Run the `npm install` step as usual.
* Delete the `klaro` folder in `node_modules`: `rm -rf node_modules/klaro`
* Link in your local `klaro` folder instead: `ln -s ../../.. node_modules/klaro`
* Make sure you run `make build` (**in the main Klaro directory**) to generate the required distribution files in the `dist` directory that this example will try to import.

To install the dependencies, run

    npm install

To build the distribution files, simply run

    npm run build

To run a development server run

    npm run dev

You can then go to http://localhost:9000 and should see the Klaro consent
manager with a very simple configuration.
