<script lang="ts">
	import type { ListItemInterface } from '$lib/pdf_editor/ts/interfaces.svelte';
	import { addSingleCover, deleteSinglePdf, savePdf } from '$lib/pdf_editor/ts/ListItem.svelte';
	import { notify } from '$lib/pdf_editor/ts/main_logic.svelte';
	import EditView from './EditView.svelte';
	import { SlButton, SlCheckbox, type SlDrawer, SlInput } from '@shoelace-style/shoelace';
	import { onMount } from 'svelte';

	let { pdf, loggedIn }: { pdf: ListItemInterface; loggedIn: boolean } = $props();

	let liItem: HTMLLIElement,
		divCover: HTMLDivElement,
		divPdf: HTMLDivElement,
		checkbox: SlCheckbox,
		isSelected = $state(false),
		coverInput: HTMLInputElement,
		tag = $derived(pdf.tag),
		drawer: SlDrawer,
		editViewOpen: boolean = $state(false),
		pageOrder: string[] = $state([]),
		saveButton: SlButton,
		progress: number = $state(0);

	function deletePages() {
		const pagesToDelete = drawer.querySelector('.edit-view')!.querySelectorAll('.selected');
		pagesToDelete.forEach((page) => {
			page.remove();
		});
	}

	function closeModal() {
		drawer.hide();
		editViewOpen = false;
		progress = 0;
	}

	onMount(() => {
		setTimeout(() => {
			liItem.classList.remove('scale-0');
		}, 100);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<li
	bind:this={liItem}
	id={pdf.pdfId}
	data-database={pdf.database}
	data-store={pdf.store}
	data-size={pdf.size}
	data-pages={pdf.pages}
	data-selected={isSelected}
	class="relative m-auto flex scale-0 items-center gap-0.5 p-2 transition-[scale] duration-200"
>
	<sl-checkbox
		bind:this={checkbox}
		size="large"
		onsl-change={() => {
			isSelected = checkbox.checked;
		}}
	></sl-checkbox>

	<div
		class={[
			'cover-div flex h-25 flex-col items-center justify-center rounded-l-full bg-gray-50 pr-3 pl-9 text-2xl shadow-sm',
			{ 'shadow-sm shadow-orange-800': isSelected }
		]}
		bind:this={divCover}
	>
		<sl-tooltip content="Select cover">
			<sl-button
				class="select-button cover-thumbnail"
				variant="default"
				size="medium"
				onclick={() => {
					if (loggedIn) {
						coverInput.click();
					} else {
						notify('You need to log in to perform this action.');
					}
				}}
			>
				<img
					src={pdf.coverThumbnail ? pdf.coverThumbnail : '/assets/custom-cover.png'}
					alt="Cover"
					class="cover-img h-[74px] w-15"
				/>
				<input
					bind:this={coverInput}
					id={pdf.coverId}
					type="file"
					accept="application/pdf"
					multiple={false}
					onchange={async (e) =>
						(pdf.coverThumbnail = await addSingleCover(e, pdf.coverId, pdf.coverThumbnail))}
					class="hidden"
				/>
			</sl-button>
		</sl-tooltip>
	</div>

	<div
		class={[
			'item-div flex h-25 flex-row items-center justify-center gap-2.5 rounded-r-full bg-gray-50 pr-6 pl-3 text-2xl shadow-sm',
			{ 'shadow-sm shadow-orange-800': isSelected }
		]}
		bind:this={divPdf}
	>
		<sl-drawer
			bind:this={drawer}
			no-header
			label="Edit View"
			placement="bottom"
			style="--size: calc(100vh - 64px)"
		>
			<sl-button
				variant="danger"
				slot="footer"
				style="padding-right: 15px;"
				disabled={progress !== 100 ? 'true' : false}
				onclick={() => {
					deletePages();
				}}>Delete</sl-button
			>
			<sl-button
				bind:this={saveButton}
				variant="success"
				slot="footer"
				style="padding-right: 15px;"
				disabled={progress !== 100 ? 'true' : false}
				onclick={async () => {
					saveButton.setAttribute('loading', '');
					await savePdf(drawer, pageOrder, pdf);
					saveButton.removeAttribute('loading');
					drawer.hide();
					editViewOpen = false;
					progress = 0;
				}}>Save</sl-button
			>
			<sl-button class="close-modal" slot="footer" onclick={() => closeModal()}>Close</sl-button>
			{#if editViewOpen}
				<EditView
					database={pdf.database}
					store={pdf.store}
					id={pdf.pdfId}
					pages={pdf.pages}
					bind:progress
				/>
			{/if}
		</sl-drawer>

		<sl-tooltip content="Edit PDF">
			<sl-button
				class="select-button"
				onclick={() => {
					drawer.show();
					editViewOpen = true;
				}}
			>
				<img src={pdf.pdfThumbnail} alt="PDF thumbnail" class="h-[74px] w-15" />
			</sl-button>
		</sl-tooltip>

		<sl-input
			id={'input-' + pdf.pdfId}
			size="small"
			clearable
			pill
			placeholder="File name"
			value={pdf.pdfName}
			oninput={(event: InputEvent) => (pdf.pdfName = (event.target as SlInput).value)}
		></sl-input>

		<sl-tooltip>
			<div slot="content">
				<sl-format-bytes value={pdf.size}></sl-format-bytes>
				<div>Pages: {pdf.pages}</div>
			</div>
			<sl-icon-button name="info-circle"> </sl-icon-button>
		</sl-tooltip>
		<!-- <sl-dialog bind:this={fileInfoDialog} label="File info"> -->
		<!-- 	<div class="flex w-full flex-col"> -->
		<!-- 		<div class="w-full flex-row justify-center bg-gray-50"> -->
		<!-- 			<div class="flex flex-row justify-between"> -->
		<!-- 				<div>Format</div> -->
		<!-- 				<div>{pdf.format}</div> -->
		<!-- 			</div> -->
		<!-- 		</div> -->
		<!---->
		<!-- 		<div class="w-full flex-row justify-center"> -->
		<!-- 			<div class="flex flex-row justify-between"> -->
		<!-- 				<div>Encryption</div> -->
		<!-- 				<div>{pdf.encryption}</div> -->
		<!-- 			</div> -->
		<!-- 		</div> -->
		<!---->
		<!-- 		<div class="w-full flex-row justify-center"> -->
		<!-- 			<div class="flex flex-row justify-between"> -->
		<!-- 				<div>Author</div> -->
		<!-- 				<div>{pdf.author}</div> -->
		<!-- 			</div> -->
		<!-- 		</div> -->
		<!---->
		<!-- 		<div class="w-full flex-row justify-center bg-gray-50"> -->
		<!-- 			<div class="flex flex-row justify-between"> -->
		<!-- 				<div>Creation Date</div> -->
		<!-- 				<div>{pdf.creationDate}</div> -->
		<!-- 			</div> -->
		<!-- 		</div> -->
		<!---->
		<!-- 		<div class="w-full flex-row justify-center"> -->
		<!-- 			<div class="flex flex-row justify-between"> -->
		<!-- 				<div>Last Modification</div> -->
		<!-- 				<div>{pdf.modificationDate}</div> -->
		<!-- 			</div> -->
		<!-- 		</div> -->
		<!-- 	</div></sl-dialog -->
		<!-- > -->
		<!-- TODO: Implement getMetaData function (from MuPDF) -->
		<sl-icon class="handle cursor-grab" name="arrows-move"></sl-icon>
		<sl-icon-button
			name="trash"
			onclick={() => deleteSinglePdf(pdf.pdfId, pdf.database, pdf.store)}
		>
		</sl-icon-button>
	</div>

	<div class="absolute bottom-3 left-60">
		<sl-tag variant={tag === 'Non edited' ? 'neutral' : 'primary'} size="small" pill>{tag}</sl-tag>
	</div>
</li>

<style>
	.select-button::part(base) {
		height: 80px;
		width: 60px;
	}
	.select-button::part(label) {
		padding: 2px;
	}
	sl-input::part(base) {
		width: 30vw;
		max-width: 400px;
	}
</style>
