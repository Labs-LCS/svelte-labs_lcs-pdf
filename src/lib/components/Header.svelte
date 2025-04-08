
<script lang="ts">
    import { onMount } from 'svelte';

    let header:HTMLElement,
    labsName:HTMLParagraphElement,
    animation:HTMLElement,
    duck:HTMLImageElement,
    avatar:HTMLElement

    onMount(() => {
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
        }, 500);
    });

</script>

<header bind:this={header} class="z-5 absolute h-[100vh] w-[100vw] flex bg-black text-white justify-between items-center p-2 select-none text-2xl transition-all duration-700 ease-in-out">

    <p bind:this={labsName} class="opacity-0 transition-all">:Labs.LCS:</p>

    <sl-animation bind:this={animation} name="tada" easing="easeIn">
        <img bind:this={duck} src="/labs-lcs.png" alt="Site's Logo" class="absolute h-60 inset-0 m-auto transition-all duration-400">
    </sl-animation>
    <sl-tooltip content="Test user">
        <sl-avatar bind:this={avatar} class="opacity-0">
            <sl-icon slot="icon" name="robot"></sl-icon>
        </sl-avatar>
    </sl-tooltip>

</header>

<style lang="postcss">
    @reference "tailwindcss/theme";
    header {
        font-family: 'Righteous', system-ui;
        letter-spacing: 1px;
    }
</style>