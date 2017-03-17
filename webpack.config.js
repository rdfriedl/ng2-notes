// Helper: root() is defined at the bottom
var path = require('path');
var webpack = require('webpack');

// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
	/**
	 * Config
	 * Reference: http://webpack.github.io/docs/configuration.html
	 * This is the object where all configuration gets set
	 */
	var config = {};

	/**
	 * Devtool
	 * Reference: http://webpack.github.io/docs/configuration.html#devtool
	 * Type of sourcemap to use per build type
	 */
	if (isProd) {
		config.devtool = 'source-map';
	}
	else {
		config.devtool = 'source-map';
	}

	/**
	 * Entry
	 * Reference: http://webpack.github.io/docs/configuration.html#entry
	 */
	config.entry = {
		'polyfills': './src/polyfills.ts',
		'vendor': './src/vendor.ts',
		'app': './src/main.ts' // our angular app
	};

	/**
	 * Output
	 * Reference: http://webpack.github.io/docs/configuration.html#output
	 */
	config.output = {
		path: root('dist'),
		publicPath: isProd ? './' : 'http://localhost:8080/',
		filename: isProd ? 'js/[name].js' : 'js/[name].js',
		chunkFilename: isProd ? '[id].chunk.js' : '[id].chunk.js'
	};

	/**
	 * Resolve
	 * Reference: http://webpack.github.io/docs/configuration.html#resolve
	 */
	config.resolve = {
		// only discover files that have those extensions
		extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
	};

	config.externals = {
		"@angular/common": "ng.common",
		"@angular/compiler": "ng.compiler",
		"@angular/core": "ng.core",
		"@angular/forms": "ng.forms",
		"@angular/http": "ng.http",
		"@angular/platform-browser": "ng.platformBrowser",
		"@angular/platform-browser-dynamic": "ng.platformBrowserDynamic",
		"@angular/router": "ng.router",
		"bootstrap": "undefined",
		"core-js": "undefined",
		"dexie": "Dexie",
		"jquery": "$",
		"reflect-metadata": "undefined",
		"rxjs": "Rx",
		"tether": "Tether"
	}

	/**
	 * Loaders
	 * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
	 * List: http://webpack.github.io/docs/list-of-loaders.html
	 * This handles most of the magic responsible for converting modules
	 */
	config.module = {
		rules: [
			// Support for .ts files.
			{
				test: /\.ts$/,
				loaders: ['awesome-typescript-loader', 'angular2-template-loader', '@angularclass/hmr-loader'],
				exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
			},

			// copy those assets to output
			{
				test: /\.(woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader?name=fonts/[name].[ext]'
			},
			{
				test: /\.png|jpe?g|gif|svg$/,
				loader: 'file-loader?name=img/[name].[ext]'
			},

			// Support for *.json files.
			{test: /\.json$/, loader: 'json-loader'},

			// support for markdown files
			{test: /\.md$/, use: ['html-loader','markdown-loader']},

			// Support for CSS as raw text
			// all css in src/style will be bundled in an external css file
			{
				test: /\.css$/,
				exclude: root('src', 'app'),
				loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'postcss-loader']})
			},
			// all css required in src/app files will be merged in js files
			{test: /\.css$/, include: root('src', 'app'), loader: 'raw-loader!postcss-loader'},

			// support for .scss files
			// all css in src/style will be bundled in an external css file
			{
				test: /\.(scss|sass)$/,
				exclude: root('src', 'app'),
				loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'postcss-loader', 'sass-loader']})
			},
			// all css required in src/app files will be merged in js files
			{test: /\.(scss|sass)$/, exclude: root('src', 'style'), loader: 'raw-loader!postcss-loader!sass-loader'},

			// support for .html as raw text
			// todo: change the loader to something that adds a hash to images
			{test: /\.html$/, loader: 'raw-loader',	exclude: root('src', 'public')}
		]
	};

	// tslint support
	config.module.rules.push({
		test: /\.ts$/,
		enforce: 'pre',
		loader: 'tslint-loader'
	});

	/**
	 * Plugins
	 * Reference: http://webpack.github.io/docs/configuration.html#plugins
	 * List: http://webpack.github.io/docs/list-of-plugins.html
	 */
	config.plugins = [
		// Define env variables to help with builds
		// Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
		new webpack.DefinePlugin({
			// Environment helpers
			'process.env': {
				ENV: JSON.stringify(ENV)
			}
		}),

		// Workaround needed for angular 2 angular/angular#11580
		new webpack.ContextReplacementPlugin(
			// The (\\|\/) piece accounts for path separators in *nix and Windows
			/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
			root('./src') // location of your src
		),

		// Tslint configuration for webpack 2
		new webpack.LoaderOptionsPlugin({
			options: {
				/**
				 * Apply the tslint loader as pre/postLoader
				 * Reference: https://github.com/wbuchwalter/tslint-loader
				 */
				tslint: {
					emitErrors: false,
					failOnHint: false
				},
				/**
				 * Sass
				 * Reference: https://github.com/jtangelder/sass-loader
				 * Transforms .scss files to .css
				 */
				sassLoader: {
					//includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
				},
				/**
				 * PostCSS
				 * Reference: https://github.com/postcss/autoprefixer-core
				 * Add vendor prefixes to your css
				 */
				postcss: [
					autoprefixer({
						browsers: ['last 2 version']
					})
				]
			}
		})
	];

	config.plugins.push(
		// Generate common chunks if necessary
		// Reference: https://webpack.github.io/docs/code-splitting.html
		// Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
		new CommonsChunkPlugin({
			name: ['vendor', 'polyfills']
		}),

		// Inject script and link tags into html files
		// Reference: https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			template: './src/public/index.html',
			chunksSortMode: 'dependency'
		}),

		// Extract css files
		// Reference: https://github.com/webpack/extract-text-webpack-plugin
		// Disabled when in test mode or not in build mode
		new ExtractTextPlugin({filename: 'css/[name].css', disable: !isProd})
	);

	// Add build specific plugins
	if (isProd) {
		config.plugins.push(
			// Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
			// Only emit files when there are no errors
			new webpack.NoErrorsPlugin(),

			// // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
			// // Dedupe modules in the output
			// new webpack.optimize.DedupePlugin(),

			// Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
			// Minify all javascript, switch loaders to minimizing mode
			new webpack.optimize.UglifyJsPlugin({sourceMap: true, mangle: { keep_fnames: true }}),

			// Copy assets from the public folder
			// Reference: https://github.com/kevlened/copy-webpack-plugin
			new CopyWebpackPlugin([{
				from: root('src/public')
			}])
		);
	}

	/**
	 * Dev server configuration
	 * Reference: http://webpack.github.io/docs/configuration.html#devserver
	 * Reference: http://webpack.github.io/docs/webpack-dev-server.html
	 */
	config.devServer = {
		contentBase: './src/public',
		historyApiFallback: true,
		quiet: true,
		stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
	};

	return config;
}();

// Helper functions
function root(args) {
	args = Array.prototype.slice.call(arguments, 0);
	return path.join.apply(path, [__dirname].concat(args));
}
