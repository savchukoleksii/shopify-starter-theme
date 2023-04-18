const { VueLoaderPlugin } 				= require('vue-loader');
const TerserPlugin 						= require("terser-webpack-plugin");
const BundleAnalyzerPlugin 				= require('webpack-bundle-analyzer')['BundleAnalyzerPlugin'];
const MiniCssExtractPlugin 				= require("mini-css-extract-plugin");
const path								= require("path");

module.exports = {
	webpack: function (config) {
		return {
			...config,
			optimization: {
				...config.optimization,
				minimize: true,
				minimizer: [
					new TerserPlugin({
						parallel: true,
						terserOptions: {
							format: {
								comments: false
							}
						},
						extractComments: false
					})
				]
			},
			module: {
				rules: [
					{
						test: /\.(scss|sass|css)$/i,
						use: [
							process.env.NODE_ENV !== 'production' ? "vue-style-loader" : {
								loader: MiniCssExtractPlugin.loader,
								options: {
									publicPath: path.resolve(__dirname, "dist/assets")
								}
							},
							"css-loader",
							{
								loader: "sass-loader",
								options: {
									// Prefer `dart-sass`
									implementation: require("sass")
								}
							}
						]
					},
					{
						test: /\.svg$/,
						use: [
							'babel-loader',
							'vue-svg-loader'
						]
					},
					{
						test: /\.vue$/,
						use: {
							loader: 'vue-loader',
							options: {
								extractCSS: true
							}
						}
					},
					...config.module.rules
				]
			},
			resolve: {
				...config.resolve,
				extensions: [
					...config.resolve.extensions,
					".vue"
				],
				alias: {
					...config.resolve.alias
				}
			},
			plugins: [
				...config.plugins,
				new VueLoaderPlugin(),
				...(process.env.BUNDLE_ANALIZER ? [
					new BundleAnalyzerPlugin()
				] : []),
				new MiniCssExtractPlugin({
					filename: `webpack.extract.build.css`
				})
			]
		};
	},
	postcss: function (plugins) {
		return [
			...plugins
		];
	}
};
