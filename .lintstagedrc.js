module.exports = {
	"src/scripts/**/*.js": [
		"prettier --write",
		"eslint --fix -c .eslintrc"
	],
	"src/styles/**/*.scss": [
		"prettier --write",
		"stylelint --fix --config ./stylelint.config.js --custom-syntax postcss-scss"
	],
	"src/styles/**/*.sass": [
		"prettier --write",
		"stylelint --fix --config ./stylelint.config.js --custom-syntax postcss-sass"
	],
	"src/icons/*.svg": [
		"svgo --config=svgo.json",
		"prettier --write --parser html",
	],
	"src/snippets/*.html": [
		"prettier --write --parser html"
	],
}
