/// <reference lib="dom" />

import api2 from "../api.openapi.json";
import api from "../api.yaml";

const root = document.getElementById("root");

if (root) {
	root.innerHTML = `
		<pre><code data-testid="yaml-full">${JSON.stringify(api, null, 2)}</code></pre>
		<pre><code data-testid="json-full">${JSON.stringify(api2, null, 2)}</code></pre>
	`;
}
