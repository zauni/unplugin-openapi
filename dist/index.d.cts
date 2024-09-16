import * as _unplugin from 'unplugin';
import { UnpluginFactory } from 'unplugin';
import { FilterPattern } from '@rollup/pluginutils';
import { OpenAPI, OpenAPIV3, OpenAPIV3_1, OpenAPIV2 } from 'openapi-types';
export * from 'openapi-types';

interface Options {
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
declare const unpluginFactory: UnpluginFactory<Options | undefined>;
declare const unplugin: _unplugin.UnpluginInstance<Options | undefined, boolean>;

declare function isOpenAPIV3(doc: OpenAPI.Document): doc is OpenAPIV3.Document | OpenAPIV3_1.Document;
declare function isOpenAPIV2(doc: OpenAPI.Document): doc is OpenAPIV2.Document;
declare function getOpenAPIV3(doc: OpenAPI.Document): OpenAPIV3.Document | OpenAPIV3_1.Document | undefined;
declare function getOpenAPIV2(doc: OpenAPI.Document): OpenAPIV2.Document | undefined;

export { type Options, unplugin as default, getOpenAPIV2, getOpenAPIV3, isOpenAPIV2, isOpenAPIV3, unplugin, unpluginFactory };
