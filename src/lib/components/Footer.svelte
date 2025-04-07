
<script lang="ts">
	import { onMount } from 'svelte';
    
    let carousel:HTMLElement
    onMount(() => {
        carousel.setAttribute('autoplay', '');
        carousel.setAttribute('loop', '');
    });

</script>

<footer class="flex absolute bottom-0 w-[100vw] bg-black text-white text-xs text-center content-center">
    <sl-carousel bind:this={carousel}>
        <sl-carousel-item>
            <p>For bug reports, suggestions, or commercial inquiries, please e-mail <a href="mailto:contact@labs-lcs.com" class="no-underline text-orange-500">contact@labs-lcs.com</a> | Lucas Campanhã dos Santos</p>
        </sl-carousel-item>
        <sl-carousel-item>
            <p>Currently under development. The official launch is anticipated in June 2025.</p>
        </sl-carousel-item>
    </sl-carousel>
</footer>

<style>
    footer {
        font-family: 'Righteous', system-ui;
		letter-spacing: 1px;
    }
    p {
        padding: 2px;
    }
    sl-carousel::part(base) {
        --aspect-ratio: calc(100vw/100vh);
        row-gap: 0px;
        column-gap: 0px;
        max-height: 40px;
        min-width: 100vw;
    }    
</style>