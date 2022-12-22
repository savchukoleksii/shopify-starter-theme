/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

import { register } from "@shopify/theme-sections";
import { formatMoney } from "@shopify/theme-currency";
import {
	ProductForm,
	getUrlWithVariant
} from "@savchukoleksii/shopify-product-form";
import { addToCartSubmit } from "../core/helpers/addToCartSubmit";
import translations from "@savchukoleksii/shopify-theme-translations-tool";

const selectors = {
	addToCartButton: "[data-add-to-cart]",
	addToCartButtonText: "[data-add-to-cart-text]",
	productPrice: "[data-product-price]",
	comparePrice: "[data-compare-price]",
	productForm: "[data-product-form]",
	productSlider: "[data-product-slider]",
	thumbnailsSlider: "[data-product-thumbnails]",
	productSku: "[data-product-sku]",
	productSkuValue: "[data-product-sku-value]",
	quantityInput: ".js-quantity-input",
	quantityButton: ".js-quantity-button",
	quantityIncrement: "[data-quantity-increment]",
	quantityDecrement: "[data-quantity-decrement]",
	inventoriesJson: "[data-inventories-json]"
};

const classes = {
	hidden: "hidden",
	notInitialized: "not-initialized"
};

register("product", {
	product: {},
	inventories: {},
	productForm: null,
	enableHistoryState: false,
	productSlider: null,
	thumbnailsSlider: null,
	quantityLimit: {
		min: 1,
		max: 99
	},
	onLoad: async function () {
		const productHandle = this.container.dataset.productHandle;
		if (!productHandle) {
			return;
		}

		this.product = await this.getProductJson(productHandle);

		const inventoriesJson = this.container.querySelector(
			selectors.inventoriesJson
		);

		try {
			this.inventories = JSON.parse(inventoriesJson.innerHTML);
		} catch (e) {}

		const form = this.container.querySelector(selectors.productForm);

		this.productForm = new ProductForm(form, this.product, {
			onOptionChange: this.onOptionChange.bind(this),
			onFormSubmit: (event) => {
				addToCartSubmit(event);
			},
			onQuantityChange: () => {},
			onPropertyChange: () => {}
		});

		this.enableHistoryState =
			this.container.dataset.enableHistoryState || false;

		this.initQuantityLimit();
		this.disableQuantityButton();

		this.onQuantityChange = this.onQuantityChange.bind(this);

		this.initEvents();
	},
	initEvents: function () {
		this.container.addEventListener("click", this.onQuantityChange);
	},
	getProductJson: function (handle) {
		const url = `/products/${handle}.js`;

		return fetch(url).then((response) => {
			return response.json();
		});
	},
	onOptionChange: function (event) {
		const variant = event.dataset.variant;

		this.updatePrice(variant);
		this.updateAddToCartState(variant);
		this.updateSku(variant);
		this.updateQuantityLimit(variant);

		this.updateHistoryState(variant);
	},
	updatePrice: function (variant) {
		if (!variant) {
			return null;
		}

		const price = this.container.querySelector(selectors.productPrice);

		price.innerHTML = formatMoney(variant.price, null);

		const comparePrice = this.container.querySelector(
			selectors.comparePrice
		);

		if (!comparePrice) {
			return null;
		}

		if (variant.compare_at_price > variant.price) {
			comparePrice.innerText = formatMoney(
				variant.compare_at_price,
				null
			);
			comparePrice.classList.remove(classes.hidden);
		} else {
			comparePrice.innerText = "";
			comparePrice.classList.add(classes.hidden);
		}
	},
	updateAddToCartState: function (variant) {
		const button = this.container.querySelector(selectors.addToCartButton);

		const buttonText = this.container.querySelector(
			selectors.addToCartButtonText
		);

		if (!button || !buttonText) {
			return null;
		}

		if (!variant) {
			button.disabled = false;
			buttonText.innerText = translations.get(
				"products.product.unavailable"
			);
		}

		const available = variant.available;

		if (available) {
			button.disabled = false;
			buttonText.innerText = translations.get(
				"products.product.add_to_cart"
			);
		} else {
			button.disabled = true;
			buttonText.innerText = translations.get(
				"products.product.sold_out"
			);
		}
	},
	updateSku: function (variant) {
		if (!variant) {
			return null;
		}

		const sku = this.container.querySelector(selectors.productSku);

		const skuValue = this.container.querySelector(
			selectors.productSkuValue
		);

		if (!sku || !skuValue) {
			return null;
		}

		if (variant.sku) {
			skuValue.innerHTML = variant.sku;
			sku.classList.remove(classes.hidden);
		} else {
			skuValue.innerHTML = "";
			sku.classList.add(classes.hidden);
		}
	},
	initQuantityLimit: function () {
		const input = this.container.querySelector(selectors.quantityInput);

		if (!input) {
			return null;
		}

		this.quantityLimit.min = input.min;
		this.quantityLimit.max = input.max;
	},
	updateQuantityLimit: function (variant) {
		if (!variant) {
			return null;
		}

		const quantity = this.inventories[variant.id].inventory_quantity;

		this.quantityLimit.max = quantity ? quantity : 1;

		const input = this.container.querySelector(selectors.quantityInput);

		const value = +input.value;

		if (this.quantityLimit.max <= value) {
			input.value = this.quantityLimit.max;
		}

		this.disableQuantityButton();
	},
	updateHistoryState: function (variant) {
		if (!variant || !this.enableHistoryState) {
			return null;
		}

		const url = getUrlWithVariant(window.location.href, variant.id);

		window.history.replaceState({ path: url }, "", url);
	},
	onQuantityChange: function (event) {
		const input = this.container.querySelector(selectors.quantityInput);

		if (!input) {
			return null;
		}

		const target = event.target;
		const isIncrement = target.closest(selectors.quantityIncrement);
		const isDecrement = target.closest(selectors.quantityDecrement);

		if (!isIncrement && !isDecrement) {
			return;
		}

		const changeValue = isIncrement ? 1 : -1;

		const valueBefore = +input.value;
		const valueAfter = valueBefore + changeValue;

		const canIncrement =
			isIncrement && valueAfter <= this.quantityLimit.max;
		const canDecrement =
			isDecrement && valueAfter >= this.quantityLimit.min;

		if (canIncrement || canDecrement) {
			input.value = valueAfter;
		}

		this.disableQuantityButton();
	},
	disableQuantityButton: function () {
		const input = this.container.querySelector(selectors.quantityInput);

		if (!input) {
			return null;
		}

		const decrementButton = this.container.querySelector(
			selectors.quantityDecrement
		);

		const incrementButton = this.container.querySelector(
			selectors.quantityIncrement
		);

		decrementButton.disabled = +input.value - 1 < this.quantityLimit.min;
		incrementButton.disabled = +input.value + 1 > this.quantityLimit.max;
	}
});
