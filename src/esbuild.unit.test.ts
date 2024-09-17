import { build } from "esbuild";
import { describe, expect, it } from "vitest";
import esbuildPlugin from "./esbuild.js";

describe("esbuild plugin", () => {
	it("should handle a YAML schema with a reference", async () => {
		const result = await build({
			entryPoints: ["./src/fixtures/esbuild/main.ts"],
			bundle: true,
			plugins: [esbuildPlugin()],
			write: false,
		});

		const code = result.outputFiles.map((f) => f.text).join("");

		expect(code).toMatchSnapshot();
		expect(code).toContain('type: "object",');
	});

	it("should handle a JSON schema with a reference", async () => {
		const result = await build({
			entryPoints: ["./src/fixtures/esbuild/main-json.ts"],
			bundle: true,
			plugins: [
				esbuildPlugin({
					extensions: [".openapi.json"],
				}),
			],
			write: false,
		});

		const code = result.outputFiles.map((f) => f.text).join("");

		expect(code).toMatchSnapshot();
		expect(code).toContain('type: "object",');
	});
});
