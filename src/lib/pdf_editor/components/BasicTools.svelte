<script lang="ts">
	import {
		addMultipleCovers,
		deleteAll,
		deleteSelected,
		downloadNotMerge,
		mergeAndDownload,
		removeCover,
		selectAllFn,
		pdfObjects,
		addPdf,
		notify,
		userData
	} from '$lib/pdf_editor/ts/main_logic.svelte';

	import type { SlAnimation, SlButton, SlCheckbox, SlInput } from '@shoelace-style/shoelace';

	let addPdfInput: HTMLInputElement,
		downloadButton: SlButton,
		mergeButton: SlButton,
		selectAll: SlCheckbox,
		addPdfButton: SlButton,
		addCoversButton: HTMLInputElement,
		shakeAnimation: SlAnimation,
		inputMergedPdfName: SlInput,
		mergedPdfName: string = $state('');
</script>

<div
	class="absolute bottom-16 z-99 flex w-full flex-row justify-center gap-x-10 sm:right-4 sm:bottom-12 sm:w-fit sm:flex-col sm:gap-y-4"
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<sl-button
		bind:this={mergeButton}
		class="side-buttons relative"
		size="large"
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
	>
		<span class="absolute bottom-0 left-2 text-xs">Merge</span>
		<sl-icon-button name="files" class="side-icon-buttons"></sl-icon-button>
	</sl-button>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<sl-button
		bind:this={downloadButton}
		class="side-buttons relative"
		size="large"
		disabled={pdfObjects.length < 1}
		onclick={async () => {
			downloadButton.setAttribute('loading', '');
			await downloadNotMerge();
			downloadButton.removeAttribute('loading');
		}}
	>
		<span class="absolute bottom-0 -left-0.5 text-xs">Download</span>
		{#if pdfObjects.length > 0}
			<sl-badge pill pulse variant="neutral">{pdfObjects.length}</sl-badge>
		{/if}
		<sl-icon-button name="file-earmark-arrow-down" class="side-icon-buttons"></sl-icon-button>
	</sl-button>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<sl-button
		bind:this={addPdfButton}
		class="side-buttons relative"
		size="large"
		onclick={() => addPdfInput.click()}
	>
		<span class="absolute bottom-0 -left-0.5 text-xs">Add files</span>
		<sl-icon-button name="file-earmark-plus" class="side-icon-buttons"></sl-icon-button>
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
</div>

<div class="flex w-screen flex-col items-center justify-center gap-3">
	<sl-details summary="&#9881; Tools" style="color: white;">
		<div class="flex flex-wrap items-center justify-center gap-2">
			<sl-button-group label="cover">
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_interactive_supports_focus -->
				<sl-button
					role="button"
					size="small"
					pill
					onclick={() => {
						if (userData.loggedIn) {
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
						if (userData.loggedIn) {
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
		</div></sl-details
	>
	<div class="">
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="flex gap-2">
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
		</div>
	</div>
</div>

<style>
	sl-checkbox::part(base) {
		font-size: small;
	}
	sl-input::part(base) {
		font-size: small;
		width: 65vw;
		max-width: 500px;
	}
	sl-details::part(base) {
		background-color: black;
		width: 100dvw;
	}
	.side-buttons::part(base) {
		background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent background */
		backdrop-filter: blur(4px); /* Blurs elements behind this one */
		-webkit-backdrop-filter: blur(4px); /* Safari support */
		border: none;
		padding: 0;
	}
	.side-buttons::part(label) {
		padding: 0;
	}
	.side-icon-buttons::part(base) {
		font-size: 3.5rem;
		padding: 0;
	}
</style>
