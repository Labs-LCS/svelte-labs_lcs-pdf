<script lang="ts">
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';
	import BasicTools from './BasicTools.svelte';
	import ListItem from './ListItem.svelte';
	import { addPdf, pdfObjects } from '$lib/pdf_editor/ts/main_logic.svelte';

	let listArea: HTMLUListElement,
		dragoverHint: boolean = $state(false),
		{ loggedIn = $bindable() } = $props();

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

<!-- eslint-disable-next-line svelte/valid-compile -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	ondrop={async (e) => {
		e.preventDefault();
		const files = e.dataTransfer?.files;
		await addPdf(files);
		dragoverHint = false;
	}}
	ondragover={(e) => {
		e.preventDefault();
		dragoverHint = true;
	}}
	ondragleave={(e) => {
		e.preventDefault();
		dragoverHint = false;
	}}
	class="flex h-screen flex-col"
>
	<div class="flex w-screen flex-col pt-16">
		<div class="flex w-full flex-col items-center gap-y-4 pt-4 pb-4 shadow-2xs">
			<!-- <PremiumTools /> -->
			<BasicTools {loggedIn} />
		</div>
	</div>

	<ul bind:this={listArea} class="list-area relative flex flex-col overflow-auto pt-2 pb-[10vh]">
		{#if pdfObjects.length < 1}
			<div
				class={[
					'absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-row gap-x-2 text-3xl select-none',
					{ 'text-gray-500': !dragoverHint },
					{ 'text-orange-500': dragoverHint }
				]}
			>
				<span>&#8623</span>
				<span class="text-center">Drop your PDFs here</span>
				<span>&#8623</span>
			</div>
		{/if}
		{#each pdfObjects as pdf}
			<ListItem {pdf} {loggedIn} />
		{/each}
	</ul>
</div>
