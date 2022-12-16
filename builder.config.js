const { VueLoaderPlugin } 				= require('vue-loader');
const TerserPlugin 						= require("terser-webpack-plugin");
const BundleAnalyzerPlugin 				= require('webpack-bundle-analyzer')['BundleAnalyzerPlugin'];

module.exports = {
	webpack: function (config) {
		return {
			...config,
			optimization: {
				...(config.optimization || {}),
				splitChunks: {
					chunks: 'async',
					minSize: 20000,
					minRemainingSize: 0,
					minChunks: 1,
					maxAsyncRequests: 30,
					maxInitialRequests: 30,
					enforceSizeThreshold: 50000,
					cacheGroups: {
						defaultVendors: {
							test: /[\\/]node_modules[\\/]/,
							priority: -10,
							reuseExistingChunk: true
						},
						default: {
							minChunks: 2,
							priority: -20,
							reuseExistingChunk: true
						}
					}
				},
				minimize: true,
				minimizer: [
					new TerserPlugin()
				]
			},
			module: {
				rules: [
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
							loader: 'vue-loader'
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
				] : [])
			]
		};
	},
	postcss: function (plugins) {
		return [
			...plugins
		];
	}
};
