<script lang="ts">
	import '@shoelace-style/shoelace/dist/components/animation/animation.js';
	import '@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js';
	import '@shoelace-style/shoelace/dist/components/carousel/carousel.js';
	import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
	import LandingPage from '$lib/landing_page/components/LandingPage.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {});
</script>

<div class="flex h-full w-full flex-col text-white">
	<LandingPage />
</div>
