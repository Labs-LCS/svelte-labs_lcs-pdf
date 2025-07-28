<script lang="ts">
	import {
		addMultipleCovers,
		deleteAll,
		deleteSelected,
		downloadNotMerge,
		mergeAndDownload,
		removeCover,
		report,
		selectAllFn,
		pdfObjects,
		addPdf,
		notify
	} from '$lib/pdf_editor/ts/main_logic.svelte';

	import type {
		SlAnimation,
		SlButton,
		SlCheckbox,
		SlDialog,
		SlInput,
		SlTextarea
	} from '@shoelace-style/shoelace';

	let addPdfInput: HTMLInputElement,
		bugReport: SlDialog,
		downloadButton: SlButton,
		mergeButton: SlButton,
		reportMessage: SlTextarea,
		selectAll: SlCheckbox,
		addPdfButton: SlButton,
		addCoversButton: HTMLInputElement,
		shakeAnimation: SlAnimation,
		inputMergedPdfName: SlInput,
		mergedPdfName: string = $state(''),
		{ loggedIn } = $props();
</script>

<div class="add-pdf-button flex flex-col items-center justify-center gap-3">
	<div class="flex flex-row gap-2">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<sl-button
			role="button"
			bind:this={addPdfButton}
			size="small"
			variant="primary"
			pill
			onclick={() => addPdfInput.click()}
			>add PDF
			<sl-icon name="file-arrow-up"></sl-icon>
			<input
				bind:this={addPdfInput}
				type="file"
				accept="application/pdf"
				multiple
				style="display: none;"
				onchange={async (e) => {
					addPdfButton.setAttribute('loading', '');
					const files = e.currentTarget.files;
					await addPdf(files);
					addPdfButton.removeAttribute('loading');
				}}
			/>
		</sl-button>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<sl-button role="button" size="small" pill variant="danger" onclick={() => bugReport.show()}
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
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_interactive_supports_focus -->
			<sl-button
				role="button"
				slot="footer"
				variant="primary"
				onclick={() => report(reportMessage.value)}
			>
				Send via e-mail
				<sl-icon slot="prefix" name="bug"></sl-icon>
			</sl-button>
		</sl-dialog>
	</div>

	<div class="flex flex-row items-center gap-2">
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<sl-checkbox
			role="checkbox"
			aria-checked="false"
			bind:this={selectAll}
			class="select-all-checkbox"
			onclick={() => selectAllFn(selectAll)}
			>select all
		</sl-checkbox>

		<sl-animation
			bind:this={shakeAnimation}
			name="shake"
			easing="ease-in-out"
			id="shake-merged-name"
		>
			<sl-input
				bind:this={inputMergedPdfName}
				id="merged-name"
				placeholder="merged file name"
				size="small"
				clearable
				pill
				value=""
				oninput={(event: InputEvent) => (mergedPdfName = (event.target as SlInput).value)}
			></sl-input>
		</sl-animation>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<sl-button
			role="button"
			bind:this={mergeButton}
			size="small"
			pill
			variant="primary"
			disabled={pdfObjects.length < 2}
			onclick={async () => {
				if (mergedPdfName === '') {
					shakeAnimation.setAttribute('play', '');
					setTimeout(() => {
						shakeAnimation.removeAttribute('play');
						inputMergedPdfName.focus();
					}, 1000);
					return;
				}
				mergeButton.setAttribute('loading', '');
				await mergeAndDownload();
				mergeButton.removeAttribute('loading');
			}}
			>merge all
			<sl-icon name="files"></sl-icon>
			<sl-icon name="arrow-right-short"></sl-icon>
			<sl-icon name="filetype-pdf"></sl-icon>
		</sl-button>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<sl-button
			role="button"
			bind:this={downloadButton}
			size="small"
			pill
			variant="primary"
			onclick={async () => {
				downloadButton.setAttribute('loading', '');
				await downloadNotMerge();
				downloadButton.removeAttribute('loading');
			}}
			>download
			<sl-icon name="file-earmark-arrow-down"></sl-icon>
			{#if pdfObjects.length > 0}
				<sl-badge pill pulse>{pdfObjects.length}</sl-badge>
			{/if}
		</sl-button>
	</div>

	<div class="flex flex-wrap items-center justify-center gap-2">
		<sl-button-group label="cover">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_interactive_supports_focus -->
			<sl-button
				role="button"
				size="small"
				pill
				onclick={() => {
					if (loggedIn) {
						addCoversButton.click();
					} else {
						notify('You need to log in to perform this action.');
					}
				}}
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

			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_interactive_supports_focus -->
			<sl-button
				role="button"
				size="small"
				pill
				onclick={() => {
					if (loggedIn) {
						removeCover();
					} else {
						notify('You need to log in to perform this action.');
					}
				}}
				>remove covers
				<sl-icon name="file-earmark-minus"></sl-icon>
			</sl-button>
		</sl-button-group>

		<sl-button-group label="delete">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_interactive_supports_focus -->
			<sl-button
				role="button"
				size="small"
				pill
				onclick={() => {
					deleteSelected();
				}}
				>delete selected
				<sl-icon name="file-earmark-x"></sl-icon>
			</sl-button>

			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_interactive_supports_focus -->
			<sl-button
				role="button"
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
