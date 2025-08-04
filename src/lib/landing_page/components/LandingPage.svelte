<script lang="ts">
	import Separator from './separator.svelte';
	import Pdf from './Pdf.svelte';
	import N2T from './N2T.svelte';
	import DsAinC from './DSAinC.svelte';
	import SplitFoca from './SplitFoca.svelte';
	import { onMount } from 'svelte';

	let footer: HTMLDivElement, header: HTMLDivElement;

	onMount(() => {
		setTimeout(() => {
			header.classList.add('h-[72px]');
			header.classList.remove('h-dvh');
		}, 1000);

		setTimeout(() => {
			footer.classList.add('h-[48px]');
			footer.classList.remove('h-0');
		}, 1500);
	});
</script>

<div class="relative flex flex-col">
	<div class="flex h-[72px] w-full"></div>
	<div
		bind:this={header}
		class="fixed z-999 flex h-dvh w-full flex-row items-center justify-center gap-x-2.5 border-b border-white bg-black pt-4 pb-4 transition-all duration-300 ease-in-out lg:justify-start"
	>
		<img src="/labs-lcs.png" alt="Labs.LCS logo" class="h-10 lg:pl-4" />
		<span class="font-righteous letter text-xl">Labs.LCS - Study projects</span>
	</div>
	<Pdf />
	<Separator />
	<N2T />
	<Separator />
	<DsAinC />
	<Separator />
	<SplitFoca />
	<div class="h-[48px] w-full bg-black"></div>
	<div
		bind:this={footer}
		class="fixed bottom-0 flex h-0 w-[100vw] items-center justify-center bg-black text-center text-xs text-white transition-all"
	>
		<p>
			Lucas Campanhã dos Santos | <a
				href="mailto:contact@labs-lcs.com"
				class="text-orange-500 no-underline"
			>
				contact@labs-lcs.com
			</a>
		</p>
	</div>
</div>
