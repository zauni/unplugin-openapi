import Parser from "@readme/json-schema-ref-parser";
import {
	type FilterPattern,
	createFilter,
	dataToEsm,
} from "@rollup/pluginutils";
import type { OpenAPI, OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";

export * from "openapi-types";

export interface Options {
	/**
	 * A minimatch pattern, or array of patterns, which specifies the files in the build the plugin
	 * should operate on.
	 * By default all files are targeted.
	 */
	include?: FilterPattern;

	/**
	 * A minimatch pattern, or array of patterns, which specifies the files in the build the plugin
	 * should _ignore_.
	 * By default no files are ignored.
	 */
	exclude?: FilterPattern;

	/**
	 * File extensions that this plugin should operate on.
	 *
	 * Default: `['.yaml', '.yml']`
	 */
	extensions?: string[];
}

const defaults: Options = {
	extensions: [".yaml", ".yml"],
};

export const unpluginFactory: UnpluginFactory<Options | undefined> = (opts) => {
	const options = { ...defaults, ...opts };
	const filter = createFilter(options?.include, options?.exclude);

	// Set of ids which were transformed by this plugin (used for HMR handling)
	const rootIds = new Set<string>();

	function shouldTransform(id: string) {
		return (
			options.extensions?.some((ext) => id.toLowerCase().endsWith(ext)) &&
			filter(id)
		);
	}

	return {
		name: "unplugin-openapi",
		transformInclude(id) {
			return shouldTransform(id);
		},
		async transform(_, id) {
			if (!shouldTransform(id)) {
				return null;
			}

			if (this.addWatchFile) {
				// Also watch for changes in referenced YAML files
				const refs = await Parser.resolve(id);
				const filteredRefs = refs.paths("file").filter((path) => path !== id);

				for (const ref of filteredRefs) {
					this.addWatchFile(ref);
				}

				rootIds.add(id);
			}

			const content = await Parser.bundle(id);

			return {
				code: dataToEsm(content, {
					namedExports: false,
				}),
				map: { mappings: "" }, // Swagger CLI doesn't provide a source map
			};
		},
		vite: {
			/**
			 * Handle HMR in Vite
			 *
			 * This is a Vite specific workaround because it doesn't support HMR for files that are not referenced by any other file. (or Vite doesn't know about it)
			 * Even if `watchFile` is used in the transform hook, Vite doesn't trigger HMR for the file.
			 */
			handleHotUpdate(ctx) {
				// if we want to process the file and it is a referenced file, invalidate the root files
				if (
					shouldTransform(ctx.file) &&
					!rootIds.has(ctx.file) &&
					!ctx.modules.length
				) {
					for (const rootId of rootIds) {
						const root = ctx.server.moduleGraph.getModuleById(rootId);
						if (root) {
							ctx.server.moduleGraph.invalidateModule(root);
						}
					}
					ctx.server.ws.send({
						type: "full-reload",
						path: "*",
					});
				}
				return ctx.modules;
			},
		},
		esbuild: {
			loader: "js",
		},
		webpack(compiler) {
			compiler.options.module.rules.push({
				test: (value) =>
					(options.extensions ?? []).some((ext) => value.includes(ext)),
				type: "javascript/auto", // Treat JSON files as JavaScript modules
			});
		},
	};
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;

// Type guard for OpenAPI 3.0 and 3.1
export function isOpenAPIV3(
	doc: OpenAPI.Document,
): doc is OpenAPIV3.Document | OpenAPIV3_1.Document {
	return "openapi" in doc;
}

// Type guard for OpenAPI 2.0
export function isOpenAPIV2(doc: OpenAPI.Document): doc is OpenAPIV2.Document {
	return "swagger" in doc;
}

// Utility functions to get the narrowed type
export function getOpenAPIV3(
	doc: OpenAPI.Document,
): OpenAPIV3.Document | OpenAPIV3_1.Document | undefined {
	return isOpenAPIV3(doc) ? doc : undefined;
}

export function getOpenAPIV2(
	doc: OpenAPI.Document,
): OpenAPIV2.Document | undefined {
	return isOpenAPIV2(doc) ? doc : undefined;
}
