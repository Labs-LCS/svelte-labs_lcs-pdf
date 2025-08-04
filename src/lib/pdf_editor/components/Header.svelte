<script lang="ts">
	import { onMount } from 'svelte';
	import { handleLogin, logOut, monitorAuthState, notify, userData } from '../ts/main_logic.svelte';
	import type { SlDialog } from '@shoelace-style/shoelace';

	let header: HTMLElement,
		labsName: HTMLParagraphElement,
		animation: HTMLElement,
		duck: HTMLImageElement,
		avatar: HTMLElement,
		logoutDialog: SlDialog;

	onMount(async () => {
		await monitorAuthState();
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
				header.classList.remove('h-100dvh');
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
</script>

<header
	bind:this={header}
	class="h-100dvh w-100dvw absolute z-99 flex items-center justify-between bg-black p-2 text-2xl text-white transition-all duration-700 ease-in-out select-none"
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
	<sl-dialog bind:this={logoutDialog} no-header class="log-out-dialog">
		Do you wish to log out?
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="flex justify-end gap-x-2" slot="footer">
			<sl-button
				variant="primary"
				onclick={() => {
					logoutDialog.hide();
				}}
			>
				Stay logged in
			</sl-button>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<sl-button
				variant="danger"
				onclick={() => {
					logOut();
					logoutDialog.hide();
					notify('Logged out!');
				}}
			>
				Log Out
			</sl-button>
		</div>
	</sl-dialog>

	<sl-tooltip content={userData.username}>
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<sl-button
			class="log-in-button"
			role="button"
			circle
			onclick={async () => {
				if (userData.loggedIn == true) {
					logoutDialog.show();
				} else {
					handleLogin();
				}
			}}
		>
			<sl-avatar
				bind:this={avatar}
				class="opacity-0"
				image={userData.profilePicture}
				loading="lazy"
			>
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
	.log-in-button::part(base) {
		padding: 0px;
		border: none;
		background-color: transparent;
	}
	.log-in-button::part(label) {
		padding: 0px;
		background-color: transparent;
	}
	.log-out-dialog::part(body) {
		background-color: black;
		font-size: 20px;
	}
	.log-out-dialog::part(footer) {
		background-color: black;
	}
</style>
