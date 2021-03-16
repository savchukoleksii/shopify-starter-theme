module.exports = {
	webpack: function (config) {
		return config;
	},
	postcss: function (plugins) {
		return [
			...plugins
		];
	}
};
