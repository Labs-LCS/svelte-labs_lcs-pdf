<svg
	width="100%"
	height="80"
	viewBox="0 0 1200 80"
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="none"
>
	<style>
		.wave1 {
			animation: wave1 4s ease-in-out infinite;
			transform-origin: center;
		}
		.wave2 {
			animation: wave2 3.5s ease-in-out infinite;
			transform-origin: center;
		}
		.wave3 {
			animation: wave3 5s ease-in-out infinite;
			transform-origin: center;
		}

		@keyframes wave1 {
			0%,
			100% {
				transform: translateY(0px) scaleY(1);
			}
			25% {
				transform: translateY(-2px) scaleY(1.05);
			}
			50% {
				transform: translateY(1px) scaleY(0.95);
			}
			75% {
				transform: translateY(-1px) scaleY(1.02);
			}
		}

		@keyframes wave2 {
			0%,
			100% {
				transform: translateY(0px) scaleY(1);
			}
			30% {
				transform: translateY(2px) scaleY(0.98);
			}
			60% {
				transform: translateY(-2px) scaleY(1.03);
			}
			85% {
				transform: translateY(1px) scaleY(0.99);
			}
		}

		@keyframes wave3 {
			0%,
			100% {
				transform: translateY(0px) scaleY(1);
			}
			20% {
				transform: translateY(-1px) scaleY(1.01);
			}
			45% {
				transform: translateY(2px) scaleY(0.97);
			}
			70% {
				transform: translateY(-2px) scaleY(1.04);
			}
		}
	</style>
	<defs>
		<linearGradient
			id="blueGradient"
			x1="0"
			y1="0"
			x2="1200"
			y2="80"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#2563EB" />
			<stop offset="1" stop-color="#0F172A" />
		</linearGradient>
		<linearGradient
			id="orangeGradient"
			x1="0"
			y1="0"
			x2="1200"
			y2="80"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#EA580C" />
			<stop offset="1" stop-color="#B91C1C" />
		</linearGradient>
	</defs>

	<!-- Main wavy line with gentle slope from left to right -->
	<path
		class="wave1"
		d="M 0 25 
       Q 150 15, 300 30
       Q 450 45, 600 35
       Q 750 25, 900 40
       Q 1050 55, 1200 50
       L 1200 65
       Q 1050 70, 900 55
       Q 750 40, 600 50
       Q 450 60, 300 45
       Q 150 30, 0 40
       Z"
		fill="url(#blueGradient)"
	/>

	<!-- Second layer for thickness variation -->
	<path
		class="wave2"
		d="M 0 30
       Q 200 18, 400 35
       Q 600 52, 800 40
       Q 1000 28, 1200 45
       L 1200 58
       Q 1000 43, 800 55
       Q 600 67, 400 50
       Q 200 33, 0 43
       Z"
		fill="url(#orangeGradient)"
		opacity="0.6"
	/>

	<!-- Third layer for more organic variation -->
	<path
		class="wave3"
		d="M 0 27
       Q 250 20, 500 32
       Q 750 44, 1000 38
       Q 1100 35, 1200 47
       L 1200 60
       Q 1100 50, 1000 53
       Q 750 59, 500 47
       Q 250 35, 0 42
       Z"
		fill="url(#blueGradient)"
		opacity="0.4"
	/>
</svg>
