/**
 * Declare all *.yaml imports as an OpenAPI.Document type for OpenAPI 2, 3.0, and 3.1
 */
declare module "*.yaml" {
	import type { OpenAPI } from "openapi-types";

	const content: OpenAPI.Document;
	export default content;
}

/**
 * Declare all *.yml imports as an OpenAPI.Document type for OpenAPI 3.0 and 3.1
 */
declare module "*.yml" {
	import type { OpenAPI } from "openapi-types";

	const content: OpenAPI.Document;
	export default content;
}
