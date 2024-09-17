import { Volume, createFsFromVolume } from "memfs";
import { describe, expect, it } from "vitest";
import webpack, { type OutputFileSystem } from "webpack";
import webpackPlugin from "./webpack.js";

async function build(config: webpack.Configuration): Promise<string> {
	return new Promise((resolve, reject) => {
		const compiler = webpack({
			mode: "production",
			output: {
				path: "/", // Set to '/' since we are using an in-memory filesystem
				filename: "bundle.js", // Output file name
			},
			...config,
		});
		const vol = new Volume();
		const memFs = createFsFromVolume(vol);
		compiler.outputFileSystem = memFs as OutputFileSystem;

		compiler.run((err, stats) => {
			if (err || stats?.hasErrors()) {
				reject(err || stats?.toJson().errors);
				return;
			}

			const transformedCode = memFs.readFileSync("/bundle.js", "utf-8");

			resolve(transformedCode.toString());
		});
	});
}

describe("Webpack plugin", () => {
	it("should handle a YAML schema with a reference", async () => {
		const code = await build({
			entry: "./src/fixtures/webpack/main.js",
			plugins: [webpackPlugin()],
		});

		expect(code).toMatchSnapshot();
		expect(code).toContain('type:"object",');
	});

	it("should handle a JSON schema with a reference", async () => {
		const code = await build({
			entry: "./src/fixtures/webpack/main-json.js",
			plugins: [
				webpackPlugin({
					extensions: [".openapi.json"],
				}),
			],
		});

		expect(code).toMatchSnapshot();
		expect(code).toContain('type:"object",');
	});
});
