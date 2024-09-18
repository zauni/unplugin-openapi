import { rm, writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { copyDirectory, startAstro } from "../test-utils.js";
import openapi from "./astro.js";

const folder = "src/__astrofiles";

test.describe.configure({
	mode: "serial",
});

test.beforeAll(async () => {
	await copyDirectory("src/fixtures", folder);
});

test.afterAll(async () => {
	await rm(folder, { recursive: true });
});

test("file changes in referenced YAML files should cause a reload", async ({
	page,
}) => {
	const { server, url } = await startAstro(`${folder}/astro`, openapi());

	await page.goto(url);

	await expect(page.getByTestId("yaml-full")).toHaveText(`{
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
                  "type": "object",
                  "properties": {
                    "someKey": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "someKey"
                  ]
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
}`);

	await writeFile(
		`${folder}/schema.yaml`,
		`---
ApiObject:
  type: object
  properties:
    foo:
      type: string
  required:
    - foo
`,
	);

	await expect(page.getByTestId("yaml-full")).toHaveText(`{
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
                  "type": "object",
                  "properties": {
                    "foo": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "foo"
                  ]
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
}`);

	await server.stop();
});

test("file changes in referenced JSON files should cause a reload", async ({
	page,
}) => {
	const { server, url } = await startAstro(
		`${folder}/astro`,
		openapi({ extensions: [".yaml", ".yml", ".openapi.json"] }),
	);

	await page.goto(url);

	await expect(page.getByTestId("json-full")).toHaveText(`{
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
                  "type": "object",
                  "properties": {
                    "someKey": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "someKey"
                  ]
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
}`);

	await writeFile(
		`${folder}/schema.openapi.json`,
		JSON.stringify({
			ApiObject: {
				type: "object",
				properties: {
					foo: {
						type: "string",
					},
				},
				required: ["foo"],
			},
		}),
	);

	await expect(page.getByTestId("json-full")).toHaveText(`{
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
                  "type": "object",
                  "properties": {
                    "foo": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "foo"
                  ]
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
}`);

	await server.stop();
});
