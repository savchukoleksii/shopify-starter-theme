import serialize from "form-serialize";

export function addToCartSubmit(event) {
	event.preventDefault();

	const form = event.target;
	if (!form) {
		return;
	}

	const formData = serialize(form, {
		hash: true
	});

	if (!formData) {
		return;
	}

	form.classList.add("adding");

	document.dispatchEvent(
		new CustomEvent("product:add", {
			detail: {
				items: [formData],
				callback: () => {
					setTimeout(() => {
						form.classList.remove("adding");
					}, 500);
				},
				errorCallback: () => {
					form.classList.remove("adding");
				}
			}
		})
	);
}
