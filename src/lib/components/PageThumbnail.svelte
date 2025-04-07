<script lang="ts">
	import type { SlCheckbox } from '@shoelace-style/shoelace';

	let { pageId, src }: { pageId: string; src: string } = $props();

	let selected: boolean = $state(false),
		checkbox: SlCheckbox;
</script>

<div id={pageId} class={['page relative', { selected: selected }]}>
	<sl-checkbox bind:this={checkbox} onsl-change={() => (selected = !selected)}></sl-checkbox>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<img
		class={[
			'aspect-auto h-55 border',
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
</div>

<style>
	sl-checkbox::part(base) {
		position: absolute;
		left: 5px;
		top: 40px;
	}
</style>
