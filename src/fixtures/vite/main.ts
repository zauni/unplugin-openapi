/// <reference lib="dom" />

import api from "../api.yaml";

const root = document.getElementById("root");

if (root) {
	root.innerHTML = `
		<pre><code data-testid="yaml">${JSON.stringify(api, null, 2)}</code></pre>
	`;
}
