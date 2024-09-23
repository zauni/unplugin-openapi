/// <reference lib="dom" />

import api from "../api.openapi.json";

const root = document.getElementById("root");

if (root) {
	root.innerHTML = `
		<pre><code data-testid="json">${JSON.stringify(api, null, 2)}</code></pre>
	`;
}
