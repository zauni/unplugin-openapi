import { rolldown } from "rolldown";
import { describe, expect, it } from "vitest";
import rolldownPlugin from "./rolldown.js";

describe("Rolldown plugin", () => {
	it("should handle a YAML schema with a reference", async () => {
		const build = await rolldown({
			input: "src/fixtures/esbuild/main.ts",
			plugins: [rolldownPlugin()],
		});

		const result = await build.generate();
		const { code } = result.output[0];

		expect(code).toMatchSnapshot();
		expect(code).toContain('properties: { someKey: { type: "string" } },');
	});

	it("should handle a JSON schema with a reference", async () => {
		const build = await rolldown({
			input: "src/fixtures/esbuild/main-json.ts",
			plugins: [
				rolldownPlugin({
					extensions: [".openapi.json"],
				}),
			],
		});

		const result = await build.generate();
		const { code } = result.output[0];

		expect(code).toMatchSnapshot();
		expect(code).toContain('properties: { someKey: { type: "string" } },');
	});
});
