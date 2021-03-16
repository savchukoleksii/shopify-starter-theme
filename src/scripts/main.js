require("./vendor/vendor");

import objects from "./core/objects";
import translations from "./core/translations";
import settings from "./core/settings";
import * as sections from "@shopify/theme-sections";

const DOMContentLoadedPromise = new Promise((resolve) => {
	document.addEventListener("DOMContentLoaded", async () => {
		resolve();
	});
});

import * as bodyScrollLock from "body-scroll-lock";
global.bodyScrollLock = bodyScrollLock;

import $ from "jquery";
global.jQuery = $;
global.$ = $;

window.theme = window.theme || {};

/*================ Components ================*/
require("./components/lazy-load-images");

/*================ Sections ================*/
require("./sections/product");

/*================ Templates ================*/
require("./templates/customers-addresses");
require("./templates/customers-login");

(async () => {
	try {
		await Promise.all([
			translations.load(),
			objects.load(),
			settings.load(),
			DOMContentLoadedPromise
		]);

		document.dispatchEvent(new CustomEvent("theme:all:loaded"));
	} catch (error) {}

	sections.load(["product"]);
})();
