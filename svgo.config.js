module.exports = {
	plugins: [
		{
			name: 'preset-default',
			params: {
				overrides: {
					// customize default plugin options
					inlineStyles: {
						onlyMatchedOnce: false
					},

					// or disable plugins
					"removeViewBox": false
				}
			}
		},
		{
			name: "addClassesToSVGElement",
			params: {
				"classNames": [
					"icon"
				]
			}
		}
	]
};
