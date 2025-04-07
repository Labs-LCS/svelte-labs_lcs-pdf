import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	optimizeDeps: {
		exclude: ["mupdf"],
		esbuildOptions: {
			target: "esnext", //esnext is subject to change, es2022 should work too (untested)
		},
	},
	build: {
		target: "esnext", //same
	},
	plugins: [sveltekit(), tailwindcss()],	
});
