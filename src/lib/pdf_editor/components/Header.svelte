<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeApp } from 'firebase/app';
	import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

	let header: HTMLElement,
		labsName: HTMLParagraphElement,
		animation: HTMLElement,
		duck: HTMLImageElement,
		avatar: HTMLElement,
		{ loggedIn = $bindable() } = $props();

	onMount(() => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then((reg) => console.log('Service Worker registered:', reg.scope))
			.catch((err) => console.error('Service Worker registration failed:', err));
		setTimeout(() => {
			animation.setAttribute('play', '');

			setTimeout(() => {
				animation.removeAttribute('play');
			}, 1000);

			setTimeout(() => {
				duck.classList.add('h-10');
				duck.classList.remove('h-60');
			}, 1200);

			setTimeout(() => {
				header.classList.add('h-16');
				header.classList.remove('h-[100vh]');
				avatar.classList.remove('opacity-0');
				labsName.classList.remove('opacity-0');
			}, 1500);

			setTimeout(() => {
				header.classList.remove('transition-all');
				header.classList.remove('duration-700');
				header.classList.remove('ease-in-out');
			}, 2200);
		}, 0);
	});

	const firebaseConfig = {
		apiKey: 'AIzaSyDRfmejb8WTxf2HS7tPZkQr-MFL4imMh3M',
		authDomain: 'svelte-labs-pdf.firebaseapp.com',
		projectId: 'svelte-labs-pdf',
		storageBucket: 'svelte-labs-pdf.firebasestorage.app',
		messagingSenderId: '386938727173',
		appId: '1:386938727173:web:98980048eec80e4392e56c',
		measurementId: 'G-YFBKMQ11W0'
	};
	let profilePicture = $state(''),
		username = $state('Log in');

	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);
	const provider = new GoogleAuthProvider();
</script>

<header
	bind:this={header}
	class="absolute z-5 flex h-[100vh] w-[100vw] items-center justify-between bg-black p-2 text-2xl text-white transition-all duration-700 ease-in-out select-none"
>
	<a href="./">
		<p bind:this={labsName} class="opacity-0 transition-all">:Labs.LCS:</p>
	</a>
	<sl-animation bind:this={animation} name="tada" easing="easeIn">
		<img
			bind:this={duck}
			src="/labs-lcs.png"
			alt="Site's Logo"
			class="pointer-events-none absolute inset-0 m-auto h-60 transition-all duration-400 select-none"
		/></sl-animation
	>
	<sl-tooltip content={username}>
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<sl-button
			role="button"
			circle
			onclick={() =>
				signInWithPopup(auth, provider)
					.then((result) => {
						loggedIn = true;
						const user = result.user;
						profilePicture = user.photoURL || '';
						username = user.displayName || 'Quack!';
					})
					.catch((error) => {
						const errorCode = error.code;
						const errorMessage = error.message;
						const email = error.customData.email;
						const credential = GoogleAuthProvider.credentialFromError(error);
						console.error(errorCode, errorMessage, email, credential);
					})}
		>
			<sl-avatar bind:this={avatar} class="opacity-0" image={profilePicture} loading="lazy">
			</sl-avatar>
		</sl-button>
	</sl-tooltip>
</header>

<style lang="postcss">
	@reference "tailwindcss/theme";
	header {
		font-family: 'Righteous', system-ui;
		letter-spacing: 1px;
	}
	sl-button::part(base) {
		padding: 0px;
		border: none;
		background-color: transparent;
	}
	sl-button::part(label) {
		padding: 0px;
		background-color: transparent;
	}
</style>
