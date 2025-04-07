
<script>
    import '@shoelace-style/shoelace/dist/components/animation/animation.js'
    import '@shoelace-style/shoelace/dist/components/avatar/avatar.js'
    import '@shoelace-style/shoelace/dist/components/icon/icon.js'
    import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
    import '@shoelace-style/shoelace/dist/components/badge/badge.js'
    import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js'
    import '@shoelace-style/shoelace/dist/components/input/input.js'
    import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
    import '@shoelace-style/shoelace/dist/components/button/button.js'
    import '@shoelace-style/shoelace/dist/components/button-group/button-group.js'
    import '@shoelace-style/shoelace/dist/components/menu/menu.js'
    import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
    import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
    import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
    import '@shoelace-style/shoelace/dist/components/details/details.js'
    import '@shoelace-style/shoelace/dist/components/divider/divider.js'
    import '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
    import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
    import '@shoelace-style/shoelace/dist/components/tag/tag.js'
    import '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
    import '@shoelace-style/shoelace/dist/components/animation/animation.js'
    import '@shoelace-style/shoelace/dist/components/avatar/avatar.js'
    import '@shoelace-style/shoelace/dist/components/icon/icon.js'
    import '@shoelace-style/shoelace/dist/components/carousel/carousel.js'
    import '@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js'
    import '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js'

    import MainArea from "$lib/components/MainArea.svelte";
	import { onMount } from 'svelte';
	import { pdf_db } from '$lib/ts/db.svelte';

    onMount(async () => {
        await pdf_db()
    })
</script>

<MainArea />
