import { rollup } from "rollup";
import { describe, expect, it } from "vitest";
import rollupPlugin from "./rollup.js";

describe("Rollup plugin", () => {
	it("should handle a YAML schema with a reference", async () => {
		const build = await rollup({
			input: "src/fixtures/esbuild/main.ts",
			plugins: [rollupPlugin()],
		});

		const {
			output: [{ code }],
		} = await build.generate({});

		expect(code).toMatchSnapshot();
		expect(code).toContain('type: "object",');
	});

	it("should handle a JSON schema with a reference", async () => {
		const build = await rollup({
			input: "src/fixtures/esbuild/main-json.ts",
			plugins: [
				rollupPlugin({
					extensions: [".openapi.json"],
				}),
			],
		});

		const {
			output: [{ code }],
		} = await build.generate({});

		expect(code).toMatchSnapshot();
		expect(code).toContain('type: "object",');
	});
});
