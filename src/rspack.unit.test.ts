import { type RspackOptions, rspack } from "@rspack/core";
import { Volume, createFsFromVolume } from "memfs";
import { describe, expect, it } from "vitest";
import rspackPlugin from "./rspack.js";

async function build(config: RspackOptions): Promise<string> {
	return new Promise((resolve, reject) => {
		const compiler = rspack({
			mode: "production",
			output: {
				path: "/", // Set to '/' since we are using an in-memory filesystem
				filename: "bundle.js", // Output file name
			},
			...config,
		});
		const vol = new Volume();
		const memFs = createFsFromVolume(vol);
		compiler.outputFileSystem = memFs as unknown as typeof import("fs");

		compiler.run((err, stats) => {
			if (err || stats?.hasErrors()) {
				reject(err);
				return;
			}

			const transformedCode = memFs.readFileSync("/bundle.js", "utf-8");

			resolve(transformedCode.toString());
		});
	});
}

describe("Rspack plugin", () => {
	it("should handle a YAML schema with a reference", async () => {
		const code = await build({
			entry: "./src/fixtures/webpack/main.js",
			plugins: [rspackPlugin()],
		});

		expect(code).toMatchSnapshot();
		expect(code).toContain('type:"object",');
	});

	it("should handle a JSON schema with a reference", async () => {
		const code = await build({
			entry: "./src/fixtures/webpack/main-json.js",
			plugins: [
				rspackPlugin({
					extensions: [".openapi.json"],
				}),
			],
		});

		expect(code).toMatchSnapshot();
		expect(code).toContain('type:"object",');
	});
});
