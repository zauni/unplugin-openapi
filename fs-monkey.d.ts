declare module "fs-monkey" {
	export interface FS {
		readFile: typeof import("memfs").fs.readFile;
	}
	export function patchFs(fs: FS): void;
}
