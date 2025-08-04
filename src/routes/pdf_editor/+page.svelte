<script lang="ts">
	import '@shoelace-style/shoelace/dist/components/animation/animation.js';
	import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
	import '@shoelace-style/shoelace/dist/components/badge/badge.js';
	import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';
	import '@shoelace-style/shoelace/dist/components/button/button.js';
	import '@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js';
	import '@shoelace-style/shoelace/dist/components/carousel/carousel.js';
	import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
	import '@shoelace-style/shoelace/dist/components/details/details.js';
	import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
	import '@shoelace-style/shoelace/dist/components/divider/divider.js';
	import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
	import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
	import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
	import '@shoelace-style/shoelace/dist/components/icon/icon.js';
	import '@shoelace-style/shoelace/dist/components/input/input.js';
	import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
	import '@shoelace-style/shoelace/dist/components/menu/menu.js';
	import '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js';
	import '@shoelace-style/shoelace/dist/components/tag/tag.js';
	import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
	import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

	import Header from '$lib/pdf_editor/components/Header.svelte';
	import Footer from '$lib/pdf_editor/components/Footer.svelte';
	import MainArea from '$lib/pdf_editor/components/MainArea.svelte';
	import { pdf_db } from '$lib/pdf_editor/ts/main_logic.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		await pdf_db();
	});
</script>

<div class="relative flex h-screen w-screen flex-col bg-gray-200">
	<Header />
	<MainArea />
	<Footer />
</div>
