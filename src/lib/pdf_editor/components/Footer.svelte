<footer
	class="absolute bottom-0 flex w-[100vw] content-center bg-black text-center text-xs text-white"
>
	<sl-carousel autoplay loop>
		<sl-carousel-item>
			<p>
				For bug reports, suggestions, or commercial inquiries, please e-mail <a
					href="mailto:contact@labs-lcs.com"
					class="text-orange-500 no-underline">contact@labs-lcs.com</a
				> | Lucas Campanhã dos Santos
			</p>
		</sl-carousel-item>
		<sl-carousel-item>
			<p>No data is stored outside your browser.</p>
		</sl-carousel-item>
		<sl-carousel-item>
			<p>Backend features under development.</p>
		</sl-carousel-item>
	</sl-carousel>
</footer>

<style>
	p {
		padding: 2px;
	}
	sl-carousel::part(base) {
		--aspect-ratio: calc(100vw / 100vh);
		row-gap: 0px;
		column-gap: 0px;
		max-height: 65px;
		min-width: 100vw;
	}
</style>
