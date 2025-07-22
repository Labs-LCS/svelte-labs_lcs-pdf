<script lang="ts">
	import '../../app.css';
	import '@fontsource/righteous';
	import '@shoelace-style/shoelace/dist/themes/light.css';

	let { children } = $props(); // This displays +page.svelte file.
</script>

{@render children()}

<style>
	:root {
		--sl-color-primary-50: rgb(254 248 246);
		--sl-color-primary-100: rgb(252 232 223);
		--sl-color-primary-200: rgb(250 215 199);
		--sl-color-primary-300: rgb(247 195 172);
		--sl-color-primary-400: rgb(244 168 134);
		--sl-color-primary-500: rgb(239 130 81);
		--sl-color-primary-600: rgb(216 95 40);
		--sl-color-primary-700: rgb(178 78 33);
		--sl-color-primary-800: rgb(147 65 27);
		--sl-color-primary-900: rgb(105 46 20);
		--sl-color-primary-950: rgb(65 29 12);
		filter: saturate(1.3);
	}
</style>
