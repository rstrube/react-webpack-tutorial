# Building a React Client-Side Web Application from Scratch

## Introduction
React is a Javascript library that's typically used to build client-side web applications.  It's provides a convenient way of organizing your front-end code into reusable components.  It also provides some "syntactial sugar" (i.e. JSX) that makes it far easier to comingle HTML and Javascript.  Please note that client-side web applications *do not* provide server side application logic, and rely on a server to handle requests from the web application.  This server could be an external system (e.g. headless system), or it could be server that's been developed specifically to work with your client-side application.

This tutorial focuses on creating a React client-side web application (from scratch).  This tutorial focuses on creating a React client-side web application (from scratch).  It will not cover creating a backend for your web application.

When building a React client-side web application you'll need the following things:

* **Transpiler**: a transpiler can convert source code from one format to another.  It's recommended to use "modern"  Javascript when writing React applications.  The problem is that browsers can't interpret modern Javascript.  This is where the transpiler comes in, it transpiles modern Javascript to a form that browsers can understand.  **Babel** is typically used as the transpiler for React applications.

* **Module Bundler**: a module bundler takes a bunch of files of different types and bundles them into a *smaller* group of files.  It also helps ensure that modules are loaded in the correct order.  **Webpack** is typically used as the module bundler for React applications.

## Why aren't you using create-react-app?
`create-react-app` is an incredible tool, but it abstracts many important details from developers.  I've always been of the mindset that one first needs to understand the fundamentals before using heavy abstraction.  Hopefully after going through this tutorial you'll come away with a new understanding of how `create-react-app` works behind the scenes!

## Initialize a new project
The first step is to initialize a new project.   By using the `-y` flag npm will setup some sane defaults.

```shell
~/Projects/react-webpack-tutorial> npm init -y
```

At this point your `package.json` will look like:

```json
{
  "name": "react-webpack-tutorial",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## Install React
Install the neccessary React packages:

```shell
~/Projects/react-webpack-tutorial> npm install react react-dom
```

* `react`: the core React library.
* `react-dom`: provides binding between React and the DOM.

At this point your `package.json` should look something like (versions of packages might be different):

## Install Webpack
Install the Webpack module bundler, along with the CLI tools, and development server.  The Webpack development server supports "hot" reload.

*Note: we are installing Webpack as a development dependency.  This is an important distinction, as it is not required as part of a production deployment.  To install packages as development dependencies, use the `--save-dev` switch.  Alternatively you can use the `-D` switch.*

```shell
~/Projects/react-webpack-tutorial> npm install --save-dev webpack webpack-cli webpack-dev-server
```

## Install Babel
Install the Babel transpiler, presets, and loader as development dependencies:

*Note: any packages that start with @ are used to indicate a node group/namespace.  For example @babel/core will install the `core` package from the `babel` node group.*

```shell
~/Projects/react-webpack-tutorial> npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader
```

### What are Babel Presets?
A Babel preset is a collection of plugins that support lanuage features.
* `@babel/preset-env`: allows us to modern ECMA Script syntax (lambas, imports, etc.), without needing to manage which syntax transforms are needed for a target environent (e.g. browser).
* `@babel/preset-react`: includes plugins to support React language features (e.g. jsx files).

### What are Webpack Loaders?
Loaders allow Webpack to handle and process different file types.  In this case `babel-loader` transpiles and processes Javascript for Webpack.

## Install Loaders and Libraries for Styling
Specific loaders and libraries will need to be installed in order for Webpack to correctly process your styling code.

If you're *just* using plain CSS, you'll need to install the following packages as development dependencies:

```shell
~/Projects/react-webpack-tutorial> npm install --save-dev css-loader style-loader
```

* `css-loader`: handles processing of CSS files for Webpack.
* `style-loader`: handes processing of style definitions in the `<head><style>` tag.

If you're using Sass, you'll need the install the following packages as development dependencies:

```shell
~/Projects/react-webpack-tutorial> npm install --save-dev sass sass-loader css-loader style-loader
```

* `sass`: the core Sass library
* `sass-loader`: handles processing of .scss files for Webpack.
* `css-loader`: handles processing of .css files for Webpack.
* `style-loader`: handes processing of style definitions in the `<head><style>` tag

## Install HTML Webpack Plugin
The HTML Webpack Plugin simplies the process of adding bundled files to our HTML files.  In our case it will automatically inject our bundled JS and bundled style code.  Because this is only used by Webpack, it will also be installed as a development dependency.

```shell
~/Projects/react-webpack-tutorial> npm install --save-dev html-webpack-plugin
```

At this point your `package.json` should look something like (version numbers might be different):

*Note: in our example we are using Sass, so we've installed the `sass` and `sass-loader` packages.*

```json
{
  "name": "react-webpack-tutorial",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.19.3",
    "@babel/preset-env": "^7.19.3",
    "@babel/preset-react": "^7.18.6",
    "babel-loader": "^8.2.5",
    "css-loader": "^6.7.1",
    "html-webpack-plugin": "^5.5.0",
    "sass": "^1.55.0",
    "sass-loader": "^13.0.2",
    "style-loader": "^3.3.1",
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0",
    "webpack-dev-server": "^4.11.1"
  }
}
```

## Code Organization
For this tutorial  we'll be using fairly standard code organization:

```
~/Projects/react-webpack-tutorial
│
├── dist -- location for production builds
│	├── index.html -- Webpack generated HTML file (production)
│	├── main.css -- Webpack generated CSS file (production when using mini-css-extract-plugin)
│	└── main.js -- Webpack bundled JS file (production)
│
├── node_modules -- (auto gen) location for installed npm packages
│
├── src -- main source folder
│   │
│	├── components -- location for React components (other than main React component)
│   │   ├── myComponent1
│   │   └── myComponent2
│   │
│   ├── styles -- locations for styling code
│   │   ├── App.scss
│   │   ├── index.scss  -- global styles
│   │   ├── myComponent1.scss
│   │   └── myComponent2.scss
│   │
│	├── App.js -- main React component
│	├── index.html -- main HTML file to bootstrap JS application
│	└── index.js -- main JS file, serves as entry point for Webpack
│
├── package-lock.json -- records installed npm packages
├── package.json -- defines required npm packages and npm scripts
├── webpack.config.js -- Webpack configuration file
└── .babelrc -- Babel configuration file
```

## Configure Webpack
Webpack uses  `webpack.config.js` for configuration.  This file is standard JS code that is processed by Node.js.  It ultimately returns an object that defines the configuration for Webpack.  It's also important to note that because it's processed by Node.js, you might be limited in the JS language features and syntax you are able to use (e.g. require vs. import).

*Note: At this point it's still recommended to use the older require syntax as opposed to the newer import syntax.*

Below is good example of a "simple" Webpack configuration:

```js
// webpack.config.js is run via node.js therefore you might be limited
// on the JS language features and syntax you use (e.g. require vs. import)

// use built in node path module
const path = require('path');
// use HTML Webpack plugin
const HTMLWebpackPlugin = require('html-webpack-plugin');

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
        })
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
                // 3. style-loader
                use: [
                    { loader: 'style-loader' },
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
                // 2. style-loader
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
            */
        ]
    }
}
```

## Configure Babel
Although it is possible to put Babel related configuration directly in `webpack.config.js` (see comments in the example `webpack.config.js` file above) many developers prefer to store Babel specific configuration in a separate file.  The file should be placed at the root level and should be named `.babelrc`.  At this point we will configure Babel to use our two installed babel presets when loading and processing JS files (`@babel/preset-env` and `@babel/preset-react`).

```json
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ]
}
```

## Update npm scripts
The `package.json` doesn't currently contain any scripts.  We will add two scripts:

* `start`: start the Webpack development server with "hot" reloads
* `build`: create a production build in `/dist`

We'll add these new scripts in the `scripts` object.  Refer to the `package.json` below for reference:

```json
{
  "name": "react-webpack",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack serve --mode development --open --hot --port 3000",
    "build": "webpack --mode production"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.17.8",
    "@babel/preset-env": "^7.16.11",
    "@babel/preset-react": "^7.16.7",
    "babel-loader": "^8.2.4",
    "css-loader": "^6.7.1",
    "html-webpack-plugin": "^5.5.0",
    "sass": "^1.49.11",
    "sass-loader": "^12.6.0",
    "style-loader": "^3.3.1",
    "webpack": "^5.71.0",
    "webpack-cli": "^4.9.2",
    "webpack-dev-server": "^4.7.4"
  }
}
```

## Create Entry HTML and JS, and React App Component
At this point you'll create the following files:

* `src/index.html`: The main HTML page for your application.  The bundled JS and styles will be automatically injected here.
* `src/index.js`: Entry point for the application.  It bootstraps React and binds the React `App` component to a specific DOM element.
* `src/App.js`: Main React component.

### src/index.html
Here is a minimal boilerplate main HTML page.  Note that Webpack will automatically inject bundled JS and style code into the HTML file (via the `html-webpack-plugin` plugin).

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
</head>
<body>
    <!-- React will bind to this DOM element -->
    <div id="app"></div>
</body>
</html>
```

### src/index.js
Here is a minimal boilerplate main JS file. It bootstraps React and binds the React `App` component to a specific DOM element.

Here is an example using React 17 which uses `ReactDOM.render()`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

// bind the React 'App' compontent to the DOM element with id="app"
const container = document.getElementById('app');
ReactDOM.render(<App />, container);
```

Here is an example using React 18, which no longer uses `ReactDOM.render()`.  Instead you'll use `createRoot()` and `root.render()`:

```js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(<App />);
```

### src/App.js
Here is a minimal boilerplate main React compontent for your application.  This lambda function returns JSX code.

```jsx
import React from 'react';
import './styles/App.scss';

export const App = () => {

    const dateTime = new Date().toString();

    return (
        <div>
            <h1>React Webpack Tutorial</h1>
            <p>Page loaded at: <code>{dateTime}</code></p>
        </div>
    );
}
```

## Running Application
Start up your application via the Webpack development server:

```shell
~/Projects/react-webpack-tutorial> npm run start
```

At this point you should see something like:

![React Web App](https://github.com/rstrube/react-webpack-tutorial/blob/main/doc/img/20221006171727.png)

If you right click on the page and select `View Page Source`, you'll see the following:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
<script defer src="main.js"></script></head>
<body>
    <!-- React will bind to this DOM element -->
    <div id="app"></div>
</body>
</html>
```

Notice that the `<div id="app">` is completely empty! This might seem strange to you until you consider what's actually happening behind the scenes.  Our server (in this case it's the Webpack development server) is serving up an initial HTML file which includes a reference to the bundled `main.js` file (injected by Webpack).  This JS file executes on the client side (within the browser) and manipulates the DOM, adding the content which displays the current date and time.  In fact if you use your browser development tools to inspect the page, you'll see the addiitonal content in the DOM:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
	<script defer="" src="main.js"></script>
</head>
<body>
    <!-- React will bind to this DOM element -->
    <div id="app">
	    <div>
		    <h1>React Webpack Tutorial</h1>
		    <p>Page loaded at: Thu Oct 06 2022 17:15:58 GMT-0600 (Mountain Daylight Time)</p>
		</div>
	</div>
</body>
</html>
```

## Adding Styling
Now we'll add some simple styling code to illustrate the way Webpack will bundle and inject styling into your application.  You'll create the following files:

* `src/styles/index.scss`: Global styles for your web application.
* `src/styles/App.scss`: Styles for your main React component.

*Note: you should be able to keep the Webpack development server running and it will automatically refresh the browser as you apply your changes.*

### src/styles/index.scss
This file will provide global styling for our web application (it is shamelessly ripped from the `index.css` that comes with `create-react-app`):

```scss
body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
}
```

### Update src/components/index.js
Now update our main JS file to reference our global styles:

```js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/index.scss';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(<App />);
```

### src/styles/App.scss
This file will provide styling for our main React component:

```scss
.App {

    margin: 0 5rem 0 5rem;

    &-header {
        text-align: center;
        color: indigo;
    }

    &-dateTime {
        text-align: center;
    }
}
```

### Update src/components/App.js
Now update our main React component to reference the new style code.  We'll also add some `className` declarations in our JSX code to reference specific CSS classes.

```jsx
import React from 'react';
import './styles/App.scss';

export const App = () => {

    const dateTime = new Date().toString();

    return (
        <div className="App">
            <h1 className="App-header">React Webpack Tutorial</h1>
            <p className="App-dateTime">Page loaded at: <code>{dateTime}</code></p>
        </div>
    );
}
```

At this point your application should look something like:

![React Web App with Styling](https://github.com/rstrube/react-webpack-tutorial/blob/main/doc/img/20221006173251.png)

Inspecting the page using your brower's development tools we see:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	    <title>React App</title>
		<script defer="" src="main.js"></script>
		<style>
			.App {
				margin: 0 5rem 0 5rem;
			}
			.App-header {
			  text-align: center;
			  color: indigo;
			}
			.App-dateTime {
			  text-align: center;
			}
		</style>
		<style>
			body {
			  margin: 0;
			  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
			  -webkit-font-smoothing: antialiased;
			  -moz-osx-font-smoothing: grayscale;
			}
			code {
			  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
			}
		</style>
	</head>
	<body>
	    <!-- React will bind to this DOM element -->
	    <div id="app">
		    <div class="App">
			    <h1 class="App-header">React Webpack Tutorial</h1>
			    <p class="App-dateTime">Page loaded at: <code>Thu Oct 06 2022 17:31:33 GMT-0600 (Mountain Daylight Time)</code></p>
			</div>
		</div>
	</body>
</html>
```

Notice that Webpack automatically injected a `<script>` element in `<head>` that points to the bundled JS.  The bundled JS then executes and injects multiple `<style>` elements into the DOM based on the styles that are required for the page.

*Note: it's important to remember that when the page is intially loaded, the `<style>` elements are **not** present.  These elements are added to the DOM via JavaScript after the initial page load.*

We'll be making changes to the webpack configuration in the next section of this tutorial, so for now terminate the webpack development server using `CTRL+C`.

## Eliminating FOUC (Flash of Unstyled Content)
Currently JavaScript is injecting the neccessary styles as `<style>` elements within the `<head>` element of the DOM.  Because this technically happens after the browser has already rendered the raw HTML, there is a potential for the page to be loaded and then briefly presented to the user *before* the styles have been added to the DOM.  This creates can create "flash" of content that is unstyled to the user.

To eliminate this, you can use the `mini-css-extract-plugin`.  This will plugin will automatically pregenerate a separate `main.css` file that is referenced via a `<link>` element with the HTML.  The disadvantage of using this plugin is that you might potentially be serving styles to the browser that might not be required for a specific component.

To begin with install the `mini-css-extract-plugin` as a dev dependency:

```shell
~/Projects/react-webpack-tutorial> npm install --save-dev mini-css-extract-plugin
```

Now you'll need to update your `webpack.config.js` to leverage the new plugin.  There are three changes you need to make:

1. Require the `mini-css-extract-plugin`.
2. Intantiate a new instance of the plugin within the `plugins` array.
3. Replace all instances of the `style-loader` loader with the `mini-css-extract-plugin` loader.

Below is an updated `webpack.config.js` with the changes (marked via `*NEW*` in the comments):

```js
// webpack.config.js is run via node.js therefore you might be limited
// on the JS language features and syntax you use (e.g. require vs. import)

// use built in node path module
const path = require('path');
// use HTML Webpack plugin
const HTMLWebpackPlugin = require('html-webpack-plugin');
// *NEW* use Mini CSS Extract plugin
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
        // *NEW* for mini-css-extract-plugin
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
	                // *NEW* replace style-loader with mini-css-extract plugin loader
                    { loader: MiniCSSExtractPlugin.loader },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ]
            }
        ]
    }
}
```

Startup your web application using `npm run start`.  The application should look identical to before, but now if you view the page source, you'll notice that webpack is including a `<link>` element that points to a generated `main.css` file.  This `<link>` element is *even* present in the initial HTML that's served up to the browser, elimating any FOUC that might occur otherwise.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
    <script defer src="main.js"></script>
    <link href="main.css" rel="stylesheet">
</head>
<body>
    <!-- React will bind to this DOM element -->
    <div id="app"></div>
</body>
</html>
```

For now terminate the webpack development server using `CTRL+C`.

## Production Builds
Up until now we've been running everything via the Webpack development server.  This is the preferred way to develop, but it's worthwhile understanding how you would create a production build for you application.  This could be served up by an application server like Nginx if you felt inclined.  For the purposes of this tutorial we won't actually setup a separate application server, we'll just show you how webpack creates the optimized bundled files that should be deployed to a production environment.

Previously we setup an npm script called `build`:

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack serve --mode development --open --hot --port 3000",
    "build": "webpack --mode production"
  },
```

The `build` script simply runs Webpack in production mode, which by default will:
* Create the main HTML file which bootstraps the JS web application
* Bundles and minifies the JS (our `webpack.config.js` defines that our bundled JS file will be created as `/dist/main.js` )
* Because we're using `mini-css-extract-plugin`, Webpack will bundle and minify the CSS (our bundled CSS is created as `/dist/main.css`)

Go ahead and run the following command to create a production build of your web application:

```shell
~/Projects/react-webpack-tutorial> npm run build
```

You should now see the following files created in your `/dist` folder:

```
~/Projects/react-webpack-tutorial
│
└── dist -- location for production builds
	├── index.html -- webpack generated HTML file (production)
	├── main.css -- webpack generated CSS file (production when using mini-css-extract-plugin)
	└── main.js -- webpack bundled JS file (production)
```

If you open the `main.js` and `main.css` you'll notice optimized production ready code.

## Optimizing Babel JS Transpilation using Browserlists
By default Bable will transpile JS written in modern syntax to JS using older syntax that more browsers can understand.  The default Babel configuration today is actually quite optimized and has already dropped support for "dead" browsers like Internet Explorer.  Even so, it might be useful to learn how to tune the browsers you wish to support using `browserlist` configuration (normally defined in `package.json` ).  This configuration defines the browsers you want Babel to target when it transpiles JS code.

If you use `create-react-app` you'll notice the following default browserlist configuration in `package.json`:

```json
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
```

This is actually a quite tuned browserlist configuration.  For production builds this targets:
* All browsers that have >0.2% market share
* All browsers that are not "dead"
* NOT Opera Mini

To get an idea of browser coverage you can visit: https://browsersl.ist

Here you can put in browserlist queries and see exactly what your coverage will be as well as exactly what browsers are supported.

![Browserlist Coverage Defaults for create-react-app](https://github.com/rstrube/react-webpack-tutorial/blob/main/doc/img/20221006201648.png)

Here you can see we have almost 92% browser coverage, which is quite tuned overall.  Compared to the `defaults` browerlist configuration there isn't much difference:

*Note: `defaults` is a shortcut for: `> 0.5%, last 2 versions, Firefox ESR, not dead`*

![Browserlist Coverage Defaults](https://github.com/rstrube/react-webpack-tutorial/blob/main/doc/img/20221006203212.png)

This has slightly less coverage, mostly because it removes support for a whole bunch of older Safari on iOS versions.

At this point we're going to demonstrate how using different browserlist configurations can have an effect on your code size and optimization.

*Note: because we have a relatively small amount of JS code for our tutorial, the differences in file size won't be as noticable.  For larger JS applications, this file size and optimization can be substantial!*

To begin with, we will update our `package.json` with an explicit browserlist configuration that targets older browsers (e.g. Internet Explorer).  The rule for production builds is:

* > 0.2% marketshare (this includes IE11)

Your `package.json` file should now look like:

```json
{
  "name": "react-webpack-tutorial",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exsyntaxit 1",
    "start": "webpack serve --mode development --open --hot --port 3000",
    "build": "webpack --mode production"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.19.3",
    "@babel/preset-env": "^7.19.3",
    "@babel/preset-react": "^7.18.6",
    "babel-loader": "^8.2.5",
    "css-loader": "^6.7.1",
    "html-webpack-plugin": "^5.5.0",
    "mini-css-extract-plugin": "^2.6.1",
    "sass": "^1.55.0",
    "sass-loader": "^13.0.2",
    "style-loader": "^3.3.1",
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0",
    "webpack-dev-server": "^4.11.1"
  },
  "browserslist": {
    "production": [
      "> 0.2%"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

This is a much more conservative and supports IE 11 which is cerrently at 0.48% marketshare. Putting this query into https://browsersl.ist we see the following coverage:

![Browserlist Coverage Greater 0.2 Percent](https://github.com/rstrube/react-webpack-tutorial/blob/main/doc/img/20221006205827.png)

Run `npm run build` and note the filesize of `/dist/main.js`.  On my machine it was **140,078 bytes**.

Now tweak the browserlist configuration so that the value is `defaults and supports es6`.  This only targets browers that are included in the default set, that *also* support ECMAScript 6 (also referred to as ECMAScript 2015) language features.  Almost all modern browsers support ES6 and above language features.

![Browserlist Coverage Defaults and ES6 Support](https://github.com/rstrube/react-webpack-tutorial/blob/main/doc/img/20221006204238.png)

No go ahead and run `npm run build` again.  Note the filesize of the generated `/dist/main.js` file.  It should be a little bit smaller (**140,039** bytes in my case).  The difference here is negiblie, but this is mostly because of the relatively small amount of JS code in our application, and the fact that we're not using advanced ECMAScript language features that would need to be polyfilled / transpiled for older browsers.

In general most developers can target `defaults`, but it's good to be aware of how the browserlist configuration works and how it affects the transpiled code.
