import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/esbuild.ts", "src/vite.ts"],
	clean: true,
	format: ["cjs", "esm"],
	dts: true,
	target: "node18",
	splitting: true,
	cjsInterop: true,
});
