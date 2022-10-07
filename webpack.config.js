// webpack.config.js is run via node.js therefore you might be limited
// on the JS language features and syntax you use (e.g. require vs. import)

// use built in node path module
const path = require('path');
// use HTML Webpack plugin
const HTMLWebpackPlugin = require('html-webpack-plugin');
// use Mini CSS Extract plugin
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

// define default exported object (webpack configuration)
module.exports = {

    // entry point of the app (used to create a dependency graph)
    entry: './src/index.js',

    // bundled .js file will be created as ./dist/main.js
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'main.js'
    },

    // inject bundled files into HTML file
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html'
        }),
        new MiniCSSExtractPlugin()
    ],

    // define how to process different file types
    module: {

        rules: [
            // JS and JSX files
            {
                test: /.(js|jsx)$/,
                // exclude any .js and .jsx files in node_modules
                exclude: /node_modules/,
                // process using babel-loader
                use: {
                    loader: 'babel-loader'
                    // note: presets should be configured in .bablerc, but here is
                    // how you can explicitly provide them to webpack if you prefer:
                    /*
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ]
                    }
                    */
                }
            },
            // SCSS files
            {
                test: /\.scss$/,
                // exclude any .scss files in node_modules
                exclude: /node_modules/,
                // process using: (note reverse order)
                // 1. sass-loader
                // 2. css-loader
                // 3. MiniCSSExtractPlugin
                use: [
                    { loader: MiniCSSExtractPlugin.loader },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ]
            },
            //enable if using CSS and disable SCSS rule
            /*
            {
                test: /\.css$/,
                // exclude any .css files in node_modules
                exclude: /node_modules/,
                // process using: (note reverse order)
                // 1. css-loader
                // 2. MiniCSSExtractPlugin
                use: [
                    { loader: MiniCSSExtractPlugin.loader },
                    { loader: 'css-loader' }
                ]
            }
            */
        ]
    }
}