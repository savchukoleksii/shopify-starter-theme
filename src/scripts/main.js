require('./vendor/vendor');

import * as sections from '@shopify/theme-sections';
import objects from './core/objects';
import translations from '@savchukoleksii/shopify-theme-translations-tool';
import settings from './core/settings';

const DOMContentLoadedPromise = new Promise((resolve) => {
	document.addEventListener('DOMContentLoaded', async () => {
		resolve();
	});
});

import * as bodyScrollLock from 'body-scroll-lock';
global.bodyScrollLock = bodyScrollLock;

import $ from 'jquery';
global.jQuery = $;
global.$ = $;

window.theme = window.theme || {};

/*================ Components ================*/
require('./components/lazy-load-images')
;(async () => {
	try {
		await Promise.all([
			translations.load(),
			objects.load(),
			settings.load(),
			DOMContentLoadedPromise
		]);

		document.dispatchEvent(new CustomEvent('theme:all:loaded'));
	} catch (error) {}

	sections.load(['product']);
})();
