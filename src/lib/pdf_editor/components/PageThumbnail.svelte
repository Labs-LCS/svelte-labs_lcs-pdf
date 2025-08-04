<script lang="ts">
	import type { SlCheckbox } from '@shoelace-style/shoelace';
	// import { onMount } from 'svelte';

	let selected: boolean = $state(false),
		checkbox: SlCheckbox,
		// pageContainer: HTMLDivElement,
		// splitDiv: HTMLDivElement,
		// splitText: HTMLDivElement,
		{ pageId, src, thumbnailSize }: { pageId: string; src: string; thumbnailSize: string } =
			$props();

	// onMount(() => {
	// 	pageContainer.addEventListener('mouseover', () => {
	// 		splitDiv.classList.remove('opacity-0');
	// 	});
	// 	pageContainer.addEventListener('mouseleave', () => {
	// 		splitDiv.classList.add('opacity-0');
	// 	});
	// 	splitDiv.addEventListener('mouseover', () => {
	// 		splitDiv.classList.add('h-36');
	// 	});
	// 	splitDiv.addEventListener('mouseleave', () => {
	// 		splitDiv.classList.remove('h-36');
	// 	});
	// 	splitDiv.addEventListener('click', () => {
	// 		splitText.innerText = 'SPLIT !';
	// 	});
	// });
</script>

<div id={pageId} class={['page relative', { selected: selected }, 'p-2']}>
	<sl-checkbox bind:this={checkbox} onsl-change={() => (selected = !selected)}></sl-checkbox>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<img
		class={[
			'aspect-auto border',
			{ 'h-30': thumbnailSize == 'small' },
			{ 'h-80': thumbnailSize == 'medium' },
			{ 'h-150': thumbnailSize == 'big' },
			{ 'border-orange-600': selected },
			{ 'border-transparent': !selected }
		]}
		{src}
		alt="PDF Page."
		onclick={() => {
			if (selected) {
				checkbox.removeAttribute('checked');
			} else {
				checkbox.setAttribute('checked', '');
			}
			selected = !selected;
		}}
	/>
	<!-- <div -->
	<!-- 	bind:this={splitDiv} -->
	<!-- 	class="absolute top-8 right-0 z-999 h-24 w-6 cursor-pointer bg-orange-600 opacity-0 transition-all duration-300" -->
	<!-- > -->
	<!-- 	<div bind:this={splitText} class="rotate-90">SPLIT</div> -->
	<!-- </div> -->
</div>

<style>
	sl-checkbox::part(base) {
		position: absolute;
		left: 5px;
		top: 40px;
	}
</style>
