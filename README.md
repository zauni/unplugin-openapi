# unplugin-openapi

A bundler agnostic plugin which converts OpenAPI 3.0, 3.1 and Swagger files to ESM modules.

- **💡** Support for `$ref` references!
- **🤖** `YAML` and `JSON` support!
- **📋** OpenAPI version 3.0, 3.1 and 2.0 (Swagger)
- **📦** Bundler agnostic! Works with [Vite](https://vitejs.dev/), [Rollup](https://rollupjs.org/), [Rolldown](https://rolldown.rs/), [esbuild](https://esbuild.github.io/), [Rspack](https://rspack.dev/), [Astro](https://astro.build/) and [Webpack](https://webpack.js.org/)!

<p align="center">
  <a href="https://npmjs.com/package/unplugin-openapi"><img src="https://img.shields.io/npm/v/unplugin-openapi.svg" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/unplugin-openapi.svg" alt="node compatibility"></a>
  <a href="https://github.com/zauni/unplugin-openapi/actions/workflows/ci.yml"><img src="https://github.com/zauni/unplugin-openapi/actions/workflows/ci.yml/badge.svg?branch=main" alt="build status"></a>
  <a href="https://jsr.io/@zauni/unplugin-openapi"><img src="https://jsr.io/badges/@zauni/unplugin-openapi" alt="JSR"></a>
  <a href="https://jsr.io/@zauni/unplugin-openapi"><img src="https://jsr.io/badges/@zauni/unplugin-openapi/score" alt="JSR Score"></a>
</p>

## Install

Using npm:

```console
npm install unplugin-openapi --save-dev
```

## Usage

### Configure the bundler

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import openapi from 'unplugin-openapi/vite'

export default defineConfig({
  plugins: [
    openapi(),
  ],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import openapi from 'unplugin-openapi/rollup'

export default {
  plugins: [
    openapi(),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-openapi/webpack')()
  ]
}
```

<br></details>

<details>
<summary>Rspack</summary><br>

```ts
// rspack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-openapi/rspack')()
  ]
}
```

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-openapi/webpack')(),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import openapi from 'unplugin-openapi/esbuild'

build({
  plugins: [openapi()],
})
```

<br></details>

<details>
<summary>Astro</summary><br>

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import openapi from 'unplugin-openapi/astro'

export default defineConfig({
  integrations: [
    openapi(),
  ],
})
```

<br></details>

### Use

With an accompanying file `src/index.js`, the local `src/api.yaml` file would
now be importable as seen below:

_src/api.yaml_

```yaml
openapi: '3.0.0'
info:
  title: My great API
  description: Great description
  version: '1.0.0'

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
                type: object
                properties:
                  someKey:
                    type: string
              example:
                someKey: some value
```

_src/index.js_

```js
import api from "./api.yaml";

console.log(api);
```

If you have
[SwaggerUI in the React flavor](https://www.npmjs.com/package/swagger-ui-react)
installed you can now render it.

_src/index.jsx_

```jsx
import React from "react";
import ReactDOM from "react-dom";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

import api from "./api.yaml";

ReactDOM.render(<SwaggerUI spec={api} />, document.getElementById("root"));
```

### Use with TypeScript

If you use TypeScript you need to create a file like `yaml.d.ts` with the
following contents:

_src/yaml.d.ts_

```ts
/// <reference types="unplugin-openapi/types/yaml" />
```

_src/index.ts_

```ts
import api from "./api.yaml";

console.log(api);
```

Otherwise TypeScript will fail with the error
`Cannot find module './api.yaml' or its corresponding type declarations.`

## Options

### `exclude`

Type: `String` | `Array[...String]`<br>
Default: `null`

A [picomatch pattern](https://github.com/micromatch/picomatch), or array of patterns, which specifies the files in the build the plugin should _ignore_. By default no files are ignored.

### `include`

Type: `String` | `Array[...String]`<br>
Default: `null`

A [picomatch pattern](https://github.com/micromatch/picomatch), or array of patterns, which specifies the files in the build the plugin should operate on. By default all files are targeted.

### `extensions`

Type: `Array[...String]`<br>
Default: `[".yaml", ".yml"]`

A list of extensions that the plugin should consider for OpenAPI spec files. By default we use YAML, but it can be extended to also use JSON file extensions like `.openapi.json` to distinguish the OpenAPI specs from other JSON files.

If you use TypeScript and want to use JSON files, be sure to also set the `compilerOptions.resolveJsonModule` to `true` in your `tsconfig.json`.

## Meta

[LICENSE (MIT)](/LICENSE)
