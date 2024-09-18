import { copyFile, mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import type { AstroIntegration } from "astro";
import { dev as createAstroServer } from "astro";
import { type Plugin, createServer } from "vite";

/**
 * Start the development server of Vite
 * @param root file system path to the root of the Vite project
 * @param plugin Vite plugin
 */
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

/**
 * Start the development server of Astro
 * @param root file system path to the root of the Astro project
 * @param plugin Astro integration plugin
 */
export async function startAstro(root: string, plugin: AstroIntegration) {
	const server = await createAstroServer({
		configFile: false,
		root,
		integrations: [plugin],
	});

	return {
		server,
		url: `http://localhost:${server.address.port}`,
	};
}

/**
 * Recursively copy a directory
 */
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
