import { copyFile, mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import { type Plugin, createServer } from "vite";

export async function startVite(root: string, plugin: Plugin) {
	const server = await createServer({
		configFile: false,
		root,
		plugins: [plugin],
	});
	await server.listen();
	return {
		server,
		url: server.resolvedUrls?.local[0] ?? "http://localhost:5173",
	};
}

export async function copyDirectory(src: string, dest: string) {
	await mkdir(dest, { recursive: true });
	const entries = await readdir(src, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = join(src, entry.name);
		const destPath = join(dest, entry.name);

		if (entry.isDirectory()) {
			await copyDirectory(srcPath, destPath);
		} else {
			await copyFile(srcPath, destPath);
		}
	}
}
