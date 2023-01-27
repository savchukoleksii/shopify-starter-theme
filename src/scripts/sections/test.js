/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

import { register } from '@shopify/theme-sections';
import { createApp } from 'vue';
import Test from '../vue/Test';

console.log(234);

register('test', {
	onLoad() {
		createApp(Test).mount('#app');
	}
});
