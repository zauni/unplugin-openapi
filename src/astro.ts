import type { AstroIntegration } from "astro";
import type { Options } from "./index.js";

import vitePlugin from "./vite.js";

export default (options?: Options): AstroIntegration => ({
	name: "unplugin-openapi",
	hooks: {
		"astro:config:setup": async ({ updateConfig }) => {
			updateConfig({
				vite: {
					plugins: [vitePlugin(options)],
				},
			});
		},
	},
});
