<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->

<script lang="ts">
	import {
		addMultipleCovers,
		addPdfFn,
		deleteAll,
		deleteSelected,
		downloadNotMerge,
		merge,
		removeCover,
		report,
		selectAllFn
	} from '$lib/ts/Buttons.svelte';
	import type {
		SlButton,
		SlCheckbox,
		SlDialog,
		SlInput,
		SlTextarea
	} from '@shoelace-style/shoelace';
	import { pdfObjects } from '$lib/ts/globals.svelte';

	let addPdf: HTMLInputElement,
		bugReport: SlDialog,
		downloadDialog: SlDialog,
		downloadMerge: SlButton,
		downloadButton: SlButton,
		reportMessage: SlTextarea,
		selectAll: SlCheckbox,
		addPdfButton: SlButton,
		addCoversButton: HTMLInputElement;

	let { mergedPdfName = $bindable() }: { mergedPdfName: string } = $props();
</script>

<div class="flex flex-col items-center justify-center gap-3">
	<div class="flex flex-row gap-2">
		<sl-button
			bind:this={addPdfButton}
			size="small"
			variant="primary"
			pill
			onclick={() => addPdf.click()}
			>add PDF
			<sl-icon name="file-arrow-up"></sl-icon>
			<input
				bind:this={addPdf}
				type="file"
				accept="application/pdf"
				multiple
				style="display: none;"
				onchange={async (e) => await addPdfFn(e, addPdfButton)}
			/>
		</sl-button>

		<sl-button size="small" pill variant="danger" onclick={() => bugReport.show()}
			>report bugs
			<sl-icon name="bug"></sl-icon>
		</sl-button>

		<sl-dialog bind:this={bugReport} label="Bug report">
			<sl-textarea
				bind:this={reportMessage}
				size="medium"
				resize="none"
				placeholder="Please provide a detailed description of the issue encountered."
			>
			</sl-textarea>
			<sl-button slot="footer" variant="primary" onclick={() => report(reportMessage.value)}>
				Send via e-mail
				<sl-icon slot="prefix" name="bug"></sl-icon>
			</sl-button>
		</sl-dialog>
	</div>

	<div class="flex flex-row items-center gap-2">
		<sl-checkbox
			bind:this={selectAll}
			class="select-all-checkbox"
			onclick={() => selectAllFn(selectAll)}
			>select all
		</sl-checkbox>

		<sl-animation name="shake" easing="ease-in-out" id="shake-merged-name">
			<sl-input
				id="merged-name"
				placeholder="merged file name"
				size="small"
				clearable
				pill
				value=""
				oninput={(event: InputEvent) => (mergedPdfName = (event.target as SlInput).value)}
			></sl-input>
		</sl-animation>

		<sl-button
			bind:this={downloadButton}
			size="small"
			pill
			variant="primary"
			onclick={async () => {
				if (pdfObjects.length < 2) {
					downloadButton.setAttribute('loading', '');
					await downloadNotMerge();
					downloadButton.removeAttribute('loading');
				} else {
					downloadDialog.show();
				}
			}}
			>download
			<sl-icon name="file-earmark-arrow-down"></sl-icon>
			{#if pdfObjects.length > 0}
				<sl-badge pill pulse>{pdfObjects.length}</sl-badge>
			{/if}
		</sl-button>

		<sl-dialog bind:this={downloadDialog} label="Download">
			<div class="flex justify-center gap-10">
				<sl-button
					bind:this={downloadMerge}
					size="large"
					onclick={async () => {
						downloadMerge.setAttribute('loading', '');
						await merge();
						downloadMerge.removeAttribute('loading');
					}}
				>
					Merge
					<br />
					<div style="font-size: 32px;">
						<sl-icon name="files"></sl-icon>
						<sl-icon name="arrow-right-short"></sl-icon>
						<sl-icon name="filetype-pdf"></sl-icon>
					</div>
				</sl-button>
				<sl-button size="large" onclick={() => downloadNotMerge()}>
					Not merge
					<br />
					<div style="font-size: 32px;">
						<sl-icon name="filetype-pdf"></sl-icon>
						...
						<sl-icon name="filetype-pdf"></sl-icon>
					</div>
				</sl-button>
			</div>
		</sl-dialog>
	</div>

	<div class="flex flex-wrap items-center justify-center gap-2">
		<sl-button-group label="cover">
			<sl-button size="small" pill onclick={() => addCoversButton.click()}
				>add covers
				<sl-icon name="file-earmark-plus"></sl-icon>
			</sl-button>
			<input
				bind:this={addCoversButton}
				type="file"
				accept="application/pdf"
				multiple
				style="display: none;"
				onchange={async (e) => {
					await addMultipleCovers(e);
				}}
			/>

			<sl-button size="small" pill onclick={() => removeCover()}
				>remove covers
				<sl-icon name="file-earmark-minus"></sl-icon>
			</sl-button>
		</sl-button-group>

		<sl-button-group label="delete">
			<sl-button
				size="small"
				pill
				onclick={() => {
					deleteSelected();
				}}
				>delete selected
				<sl-icon name="file-earmark-x"></sl-icon>
			</sl-button>

			<sl-button
				size="small"
				pill
				onclick={() => {
					deleteAll();
				}}
				>delete all
				<sl-icon name="trash"></sl-icon>
			</sl-button>
		</sl-button-group>
	</div>
</div>

<style>
	sl-checkbox::part(base) {
		font-size: small;
	}
	sl-input::part(base) {
		font-size: small;
		width: 30vw;
	}
</style>
