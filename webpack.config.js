const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

const PAGES_DIR = path.resolve(__dirname, 'src/pug/pages/')
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
	mode,
	target,
	devtool,
	devServer:{
		port: 3000,
		open: true,
		hot: true,
	},
	entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],
	output: {
		path: path.resolve(__dirname, 'dist'),
		clean: true,
		filename: '[name].[contenthash].js',
		assetModuleFilename: 'assets/[name][ext]',
		// assetModuleFilename: path.join('images', '[name].[contenthash][ext]'),
	},
	plugins: [
		...PAGES.map(page => new HtmlWebpackPlugin({
			template: `${PAGES_DIR}/${page}`,
			filename: `./${page.replace(/\.pug/,'.html')}`,
			minify: false,
		})),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		})
	],
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: "html-loader",
				options: {
					pretty: true,
					minimize: false
			   }
			},
			{
				test: /\.pug$/,
				loader: 'pug-loader',
				// use: [
				// 	'html-loader?minimize=false', 
				// 	'pug-html-loader?pretty=true'
				// ],
				// options: {
				// 	pretty: true,
				// 	minimize: false,
				// },
				
				// options: {
				// 	query: { pretty: true },
				// 	minimize: false
				//   },
				options: {
					pretty: true,
					minimize: false
			   }
			},
			{
				test: /\.(c|sa|sc)ss$/i,
				use: [
					devMode ? "style-loader": MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [require('postcss-preset-env')],
							}
						}
					},
					"sass-loader"
				],
			},
			{
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[name][ext]'
				}
			},
			{
				test: /\.(jpe?g|png|webp|gif|svg)$/i,
				use: [
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
							},
							// optipng.enabled: false will disable optipng
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: [0.65, 0.90],
								speed: 4
							},
							gifsicle: {
								interlaced: false,
							},
							// the webp option will enable WEBP
							webp: {
								quality: 75
							}
						}
					}
				],
				type: 'asset/resource',
				generator: {
					filename: 'assets/img/[name][ext]'
				}
			},
			{
				test: /\.(?:js|mjs|cjs)$/i,
				exclude: /node_modules/,
				use: {
				  loader: 'babel-loader',
				  options: {
					presets: [
					  ['@babel/preset-env', { targets: "defaults" }]
					]
				  }
				}
			}
		],
	},
}