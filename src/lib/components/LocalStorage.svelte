<script lang="ts">
	import { pdfObjects } from '$lib/ts/globals.svelte';
	import StorageItem from './StorageItem.svelte';
	import type { SlDrawer } from '@shoelace-style/shoelace';

	let { localStorageDrawer = $bindable(),
		} : { localStorageDrawer: SlDrawer; } = $props();
</script>

<sl-drawer bind:this={localStorageDrawer} label="Local storage" style="--size: calc(50vw)">
	<div class="flex h-full w-full flex-col bg-gray-100">
		{#each pdfObjects as pdf}
			<StorageItem {pdf} />
		{/each}
	</div>
</sl-drawer>
