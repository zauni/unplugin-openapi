import { vol } from "memfs";
import type { Plugin } from "vite";
import { beforeEach, describe, expect, it } from "vitest";
import vitePlugin from "./vite.js";

beforeEach(() => {
	// reset the state of in-memory fs
	vol.reset();

	vol.fromJSON({
		"/api.yaml": `---
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /my/path:
    get:
      summary: Some GET request
      responses:
        '200':
          description: Some response
          content:
            application/json:
              schema:
                $ref: './schema.yaml#/ApiObject'
              example:
                someKey: some value
`,
		"/api.yml": `---
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /my/path:
    get:
      summary: Some GET request
      responses:
        '200':
          description: Some response
          content:
            application/json:
              schema:
                $ref: './schema.yaml#/ApiObject'
              example:
                someKey: some value
`,
		"/schema.yaml": `---
ApiObject:
  type: object
  properties:
    someKey:
      type: string
  required:
    - someKey
`,
		"/api.openapi.json": `{
	"openapi": "3.0.0",
	"info": {
		"title": "My great API",
		"description": "Great description",
		"version": "1.0.0"
	},
	"paths": {
		"/my/path": {
			"get": {
				"summary": "Some GET request",
				"responses": {
					"200": {
						"description": "Some response",
						"content": {
							"application/json": {
								"schema": {
									"$ref": "./schema.openapi.json#/ApiObject"
								},
								"example": {
									"someKey": "some value"
								}
							}
						}
					}
				}
			}
		}
	}
}
`,
		"/schema.openapi.json": `{
		"ApiObject": {
		"type": "object",
		"properties": {
			"someKey": {
				"type": "string"
			}
		},
		"required": ["someKey"]
	}
}
`,
	});
});

describe("Vite plugin", () => {
	it("should handle a YAML schema with a reference", async () => {
		const plugin = vitePlugin() as Plugin<unknown>;

		// @ts-expect-error
		const result = await plugin.transform?.("", "/api.yaml");
		expect(result.code).toMatchSnapshot();
		expect(result.code).toContain("export default {");
	});

	it("should handle a JSON schema with a reference", async () => {
		const plugin = vitePlugin({
			extensions: [".openapi.json"],
		}) as Plugin<unknown>;

		// @ts-expect-error
		const result = await plugin.transform?.("", "/api.openapi.json");
		expect(result.code).toMatchSnapshot();
		expect(result.code).toContain("export default {");
	});

	it("should handle a `.yml` file extension", async () => {
		const plugin = vitePlugin() as Plugin<unknown>;

		// @ts-expect-error
		const result = await plugin.transform?.("", "/api.yml");
		expect(result.code).toMatchSnapshot();
		expect(result.code).toContain("export default {");
	});
});
