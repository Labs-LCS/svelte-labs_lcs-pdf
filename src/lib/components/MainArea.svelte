<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->

<script lang="ts">
	import Sortable from 'sortablejs';
	import PremiumTools from './PremiumTools.svelte';
	import BasicTools from './BasicTools.svelte';
	import ListItem from './ListItem.svelte';
	import { pdfObjects } from '$lib/ts/globals.svelte';
	import { onMount } from 'svelte';

	let listArea: HTMLUListElement,
		mergedPdfName: string = $state('');

	onMount(() => {
		Sortable.create(listArea, {
			group: 'items-list',
			animation: 200,
			swapThreshold: 0.55,
			ghostClass: 'hidden-item',
			handle: '.handle'
		});
	});
</script>

<div class="flex h-screen flex-col">
	<div class="flex w-screen flex-col pt-16">
		<div class="flex w-full flex-col items-center gap-y-4 pt-4 pb-4 shadow-2xs">
			<!-- <PremiumTools /> -->
			<BasicTools bind:mergedPdfName />
		</div>
	</div>

	<ul bind:this={listArea} class="list-area flex flex-col overflow-auto pt-2 pb-[10vh]">
		{#each pdfObjects as pdf}
			<ListItem {pdf} />
		{/each}
	</ul>
</div>
