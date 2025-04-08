<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->

<script lang="ts">
	import Sortable from 'sortablejs';
	// import PremiumTools from './PremiumTools.svelte';
	import BasicTools from './BasicTools.svelte';
	import ListItem from './ListItem.svelte';
	import { pdfObjects } from '$lib/ts/globals.svelte';
	import { onMount } from 'svelte';
	import { addPdfFn } from '$lib/ts/Buttons.svelte';
	import { PDFDocument } from 'mupdf/mupdfjs';
	import { storeFile } from '$lib/ts/db.svelte';
	import { getDocument } from 'pdfjs-dist';
	import { renderPdf } from '$lib/ts/render.svelte';

	let mainArea: HTMLDivElement,
		listArea: HTMLUListElement,
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

<div
	bind:this={mainArea}
	ondrop={async (e) => {
		e.preventDefault();
		const addPdfButton = document.querySelector('.add-pdf-button')!;
		const files = e.dataTransfer?.files;
		if (files) {
			const filesArray = Array.from(files);
			for (const file of filesArray) {
				if (file.type === 'application/pdf') {
					const database = 'pdf_db',
						store = 'unmodified',
						buffer = await file.arrayBuffer(),
						size = file.size,
						pages = PDFDocument.openDocument(buffer, 'application/pdf').countPages(),
						pagesArray = Array.from(Array(pages).keys()),
						pdfId = `${Date.now() + size}`,
						pdfName = file.name,
						pdfThumbnail = '',
						hasCover = false,
						coverId = `cover-${pdfId}`,
						coverThumbnail = '',
						tag = 'Non edited',
						selected = false;

					const pdf = {
						database,
						store,
						buffer,
						size,
						pages,
						pagesArray,
						pdfId,
						pdfName,
						pdfThumbnail,
						hasCover,
						coverId,
						coverThumbnail,
						tag,
						selected
					};

					await storeFile(pdf);
					const pdfDoc = await getDocument({ data: pdf.buffer }).promise; // arraybuffer detached. data passed to pdfDoc
					pdf.pdfThumbnail = await renderPdf(pdfDoc, 1);
					pdfDoc.destroy();
					pdfObjects.push(pdf);
				}
			}
			addPdfButton.removeAttribute('loading');
		}
	}}
	ondragover={(e) => {
		e.preventDefault();
	}}
	ondragleave={(e) => {
		e.preventDefault();
	}}
	class="flex h-screen flex-col"
>
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
