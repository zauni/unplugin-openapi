// tell vitest to use fs mock from __mocks__ folder

import { patchFs } from "fs-monkey";
import memfs from "memfs";

// Path the fs module to use memfs
// Vitest mocks are not working because the fs module is used by a module
// outside of the Vite module graph
// @see node_modules/@readme/json-schema-ref-parser/lib/resolvers/file.js
patchFs({
	readFile: memfs.fs.readFile,
});
