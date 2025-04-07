<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->

<script lang="ts">
	import LocalStorage from './LocalStorage.svelte';
	import type { SlDrawer } from '@shoelace-style/shoelace';

	let localStorageDrawer: SlDrawer = $state()!;
</script>

<sl-details summary="Premium tools">
	<div class="flex flex-col items-center gap-y-2 overflow-auto">
		<div class="flex flex-wrap justify-center gap-2">
			<sl-tooltip content="Premium feature">
				<sl-button size="small" pill disabled
					>OCR
					<sl-icon name="image"></sl-icon>
					<sl-icon name="arrow-right-short"></sl-icon>
					<sl-icon name="textarea-t"></sl-icon>
				</sl-button>
			</sl-tooltip>
			<sl-tooltip content="Premium feature">
				<sl-button size="small" pill disabled
					>compress
					<sl-icon name="file-earmark-zip"></sl-icon>
				</sl-button>
			</sl-tooltip>
			<sl-tooltip content="Premium feature">
				<sl-button-group label="storage">
					<sl-button size="small" pill disabled
						>store selected
						<sl-icon name="database-add"></sl-icon>
					</sl-button>
					<LocalStorage bind:localStorageDrawer />
					<sl-button size="small" disabled pill onclick={() => localStorageDrawer.show()}
						>local storage
						<sl-icon name="database-fill-gear"></sl-icon>
					</sl-button>
				</sl-button-group>
			</sl-tooltip>
		</div>
	</div>
</sl-details>

<style>
	sl-details {
		width: 100%;
	}
	sl-details::part(base) {
		background-color: black;
	}
	sl-details::part(header) {
		font-size: small;
		color: white;
		padding: 8px;
	}
	sl-details::part(summary) {
		height: min-content;
	}
</style>
