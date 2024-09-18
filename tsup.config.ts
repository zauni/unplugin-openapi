import { defineConfig } from "tsup";

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/astro.ts",
		"src/esbuild.ts",
		"src/rollup.ts",
		"src/vite.ts",
		"src/webpack.ts",
	],
	clean: true,
	format: ["cjs", "esm"],
	dts: true,
	target: "node18",
	splitting: true,
	cjsInterop: true,
});
