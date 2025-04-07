<script lang="ts">
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import PageThumbnail from './PageThumbnail.svelte';
	import { type pageImgObj } from '$lib/ts/ListItem.svelte';
	import { openDB } from 'idb';
	import { getDocument } from 'pdfjs-dist';
	import { renderPdf } from '$lib/ts/render.svelte';

	interface dbPdfObject {
		id: string;
		buffer: ArrayBuffer;
	}

	let editView: HTMLDivElement,
		srcs: pageImgObj[] = $state([]);

	let {
		database,
		store,
		id,
		pages,
		progress = $bindable()
	}: { database: string; store: string; id: string; pages: number; progress: number } = $props();

	onMount(async () => {
		Sortable.create(editView, {
			group: 'pages-list',
			animation: 200,
			swapThreshold: 0.55,
			ghostClass: 'hidden-item'
		});
		const db = openDB(database);
		const pdfObject: dbPdfObject = await (await db).get(store, id);
		const buffer = pdfObject.buffer;
		const pdfDoc = await getDocument({ data: buffer }).promise;
		for (let page = 1; page <= pages; page++) {
			const pageId = `${page - 1}`;
			const src = await renderPdf(pdfDoc, page);
			const pageImgObj = { pageId, src };
			srcs.push(pageImgObj);
			progress = (page / pages) * 100;
		}
		pdfDoc.destroy();
	});
</script>

<div
	bind:this={editView}
	class="edit-view flex h-full w-full flex-wrap items-center justify-center gap-2 overflow-auto rounded-xl bg-gray-100 p-4 inset-shadow-2xs"
>
	{#each srcs as pageImgObj}
		<PageThumbnail pageId={pageImgObj.pageId} src={pageImgObj.src} />
	{/each}
</div>

<sl-progress-bar value={progress} style="--height: 6px"></sl-progress-bar>
