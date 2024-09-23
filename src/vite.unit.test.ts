import type { RollupOutput, RollupWatcher } from "rollup";
import type { Plugin } from "vite";
import { build as viteBuild } from "vite";
import { describe, expect, it } from "vitest";
import vitePlugin from "./vite.js";

function build(folder: string, plugin: Plugin) {
	return viteBuild({
		configFile: false,
		root: folder,
		plugins: [plugin],
		mode: "production",
		build: {
			minify: false,
			write: false,
		},
	});
}

function getCode(result: RollupOutput | RollupOutput[] | RollupWatcher) {
	if (Array.isArray(result)) {
		return result[0].output[0].code;
	}
	return (result as RollupOutput).output[0].code;
}

describe("Vite plugin", () => {
	it("should handle a YAML schema with a reference", async () => {
		const result = await build("src/fixtures/vite", vitePlugin() as Plugin);

		const code = getCode(result);

		expect(code).toMatchSnapshot();
		expect(code).toContain('type: "object",');
	});

	it("should handle a JSON schema with a reference", async () => {
		const result = await build(
			"src/fixtures/vite-json",
			vitePlugin({
				extensions: [".openapi.json"],
			}) as Plugin,
		);

		const code = getCode(result);

		expect(code).toMatchSnapshot();
		expect(code).toContain('type: "object",');
	});
});
