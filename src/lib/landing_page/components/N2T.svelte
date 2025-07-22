<script>
	import {
		not,
		and,
		or,
		xor,
		mux,
		dmux,
		not16,
		and16,
		or16,
		mux16,
		or8way,
		mux4way16,
		mux8way16,
		dmux4way,
		dmux8way
	} from '../ts/nand2tetris.svelte';
</script>

<div class="flex min-h-[400px] flex-col items-center lg:flex-row">
	<div class="flex flex-col content-center items-center p-2 sm:max-w-160 md:max-w-120 lg:max-w-90">
		<a href="https://www.nand2tetris.org/course" target="_blank">
			<sl-carousel
				class=""
				style="--aspect-ratio: 5/4;"
				loop
				mouse-dragging
				navigation
				autoplay
				autoplay-interval="5000"
			>
				<sl-carousel-item>
					<img
						src="/assets/screenshots/nand2tetris.webp"
						alt="N2T's Freeform annotations"
						class="rounded-md inset-shadow-sm/100"
					/>
				</sl-carousel-item>
				<sl-carousel-item>
					<img
						src="/assets/screenshots/nand2tetris_2.webp"
						alt="N2T's Freeform annotations"
						class="rounded-md inset-shadow-sm/100"
					/>
				</sl-carousel-item>
				<sl-carousel-item>
					<img
						src="/assets/screenshots/nand2tetris_3.webp"
						alt="N2T's Freeform annotations"
						class="rounded-md inset-shadow-sm/100"
					/>
				</sl-carousel-item>
			</sl-carousel></a
		>
		<a href="https://nand2tetris.github.io/web-ide/chip/" target="_blank">
			<div class="flex items-center gap-x-2 p-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					width="32"
					height="32"
					class="nand2tetris-svg"
				>
					<rect class="tetris" style="--x: 0; --y: 2" />
					<rect class="tetris" style="--x: 1; --y: 2" />
					<rect class="tetris" style="--x: 1; --y: 1" />
					<rect class="tetris" style="--x: 2; --y: 1" />
					<path class="gate" d="M2.5,1.5 h5 a 5 5 0 0 1 0,10 h-5 v-10" />
					<circle class="gate" cx="14.5" cy="6.5" r="2" />
					<path
						class="letter"
						d="M26,10 h-6 v-1 l5,-4 v-1 l-1,-1 h-2.5 l-.5,1 h-1 v-1 l1,-1 h4 l1,1 v2 l-5,4 h5 v1"
					/>
					<title>Nand2Tetris</title>
				</svg>
				<p>Hardware Simulator</p>
			</div>
		</a>
	</div>
	<div class="flex flex-col items-center lg:flex-row">
		<p
			class="font-montserrat flex flex-2 flex-col p-4 leading-relaxed font-thin sm:max-w-prose md:max-w-prose"
		>
			<span class="italic"><b>&star; Ongoing: Nand2Tetris</b></span>This project is part of my
			ongoing participation in the Nand2Tetris course, which explores the entire hierarchy of
			computer systems — from basic logic gates to a functioning operating system and compiler. I'm
			taking this course to gain a deeper and more practical understanding of how computers work at
			every level. By building these foundations from first principles, I aim to move beyond
			dependency on high-level abstractions and frameworks. This approach supports more informed
			decision-making when designing complex systems, and fosters a stronger, more independent
			problem-solving mindset. As per the author's request, my solution for each project will be
			provided only upon request.
			<a href="https://www.nand2tetris.org/license" target="_blank">License</a>
		</p>
		<sl-carousel class="flex-1" style="--aspect-ratio: 3/4;" loop autoplay orientation="vertical">
			<sl-carousel-item>
				<sl-textarea label="NOT gate" rows="10" resize="none" readonly value={not}></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea label="AND gate" rows="10" resize="none" readonly value={and}></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea label="OR gate" rows="10" resize="none" readonly value={or}></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea label="XOR gate" rows="10" resize="none" readonly value={xor}></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea label="MULTIPLEXOR" rows="10" resize="none" readonly value={mux}></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea label="DEMULTIPLEXOR" rows="10" resize="none" readonly value={dmux}
				></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea label="NOT 16bit" rows="10" resize="none" readonly value={not16}></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea label="AND 16bit" rows="10" resize="none" readonly value={and16}></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea label="OR 16bit" rows="10" resize="none" readonly value={or16}></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea label="MULTIPLEXOR 16bit" rows="10" resize="none" readonly value={mux16}
				></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea label="OR 8-way" rows="10" resize="none" readonly value={or8way}></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea
					label="MULTIPLEXOR 4-way 16bit"
					rows="10"
					resize="none"
					readonly
					value={mux4way16}
				></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea
					label="MULTIPLEXOR 8-way 16bit"
					rows="10"
					resize="none"
					readonly
					value={mux8way16}
				></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea
					label="MULTIPLEXOR 4-way 16bit"
					rows="10"
					resize="none"
					readonly
					value={dmux4way}
				></sl-textarea>
			</sl-carousel-item>
			<sl-carousel-item>
				<sl-textarea
					label="MULTIPLEXOR 8-way 16bit"
					rows="10"
					resize="none"
					readonly
					value={dmux8way}
				></sl-textarea>
			</sl-carousel-item>
		</sl-carousel>
	</div>
</div>

<style>
	.font-montserrat {
		font-family: 'Montserrat', system-ui;
	}
	sl-textarea {
		font-style: italic;
		width: 230px;
	}
	sl-textarea::part(form-control) {
		/* border: 1px solid white; */
		padding: 2px;
	}
	sl-textarea::part(base) {
		font-family: 'Montserrat', system-ui;
		font-size: 1cap;
	}
	sl-textarea::part(textarea) {
		white-space: nowrap;
		overflow-x: auto;
		word-wrap: normal;
	}
	.nand2tetris-svg {
		--outline: black;
		--block: red;
		--gate: cyan;
	}
	@media (prefers-color-scheme: dark) {
		.nand2tetris-svg {
			--outline: white;
			--block: orange;
			--gate: green;
		}
	}
	.nand2tetris-svg rect,
	.nand2tetris-svg path,
	.nand2tetris-svg circle {
		stroke: var(--outline);
		stroke-width: 1px;
		stroke-linecap: square;
	}
	.nand2tetris-svg rect.tetris {
		--size: 8px;
		--offset: 1.5px + calc(10px - var(--size));
		fill: var(--block);
		width: var(--size);
		height: var(--size);
		x: calc(var(--x) * var(--size) + var(--offset) - 1px);
		y: calc(var(--y) * var(--size) + var(--offset) + 1px);
	}
	.nand2tetris-svg .gate {
		fill: var(--gate);
	}
	.nand2tetris-svg .letter {
		fill: var(--outline);
	}
</style>
