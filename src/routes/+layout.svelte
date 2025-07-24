<script lang="ts">
	import '../app.css';
	import '@fontsource/righteous';
	import '@fontsource-variable/montserrat';
	import '@shoelace-style/shoelace/dist/themes/dark.css';

	let { children } = $props(); // This displays +page.svelte file.
</script>

{@render children()}
