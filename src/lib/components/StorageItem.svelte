
<script lang="ts">
	import type { ListItemInterface } from "$lib/ts/globals.svelte";


    let {pdf} : {pdf:ListItemInterface} = $props()

</script>

<sl-details summary='Item {pdf.pdfId}'>
    <table class="w-full">
        <tbody>
            <tr class="flex flex-row justify-between">
                <th class="text-blue-900 text-justify">Original Name</th>
                <td class="text-end">{pdf.pdfName}</td>
            </tr>
            <tr class="flex flex-row justify-between bg-gray-100">
                <th class="text-blue-900 text-justify">Database</th>
                <td class="text-end">{pdf.database}</td>
            </tr>
            <tr class="flex flex-row justify-between">
                <th class="text-blue-900 text-justify">Store</th>
                <td class="text-end">{pdf.store}</td>
            </tr>
            <tr class="flex flex-row justify-between bg-gray-100">
                <th class="text-blue-900 text-justify">PDF ID</th>
                <td class="text-end">{pdf.pdfId}</td>
            </tr>
            <tr class="flex flex-row justify-between">
                <th class="text-blue-900 text-justify">Size</th>
                <td class="text-end"><sl-format-bytes value={pdf.size}></sl-format-bytes></td>
            </tr>
            <tr class="flex flex-row justify-between bg-gray-100">
                <th class="text-blue-900 text-justify">Pages</th>
                <td class="text-end">{pdf.pages}</td>
            </tr>
            <tr class="flex flex-row justify-between">
                <th class="text-blue-900 text-justify">Cover ID</th>
                <td class="text-end">{pdf.coverId}</td>
            </tr>
            <!-- <tr class="flex flex-row justify-between bg-gray-100">
                <th class="text-blue-900 text-justify">Cover Thumbnail</th>
                <td class="text-end">{pdf.coverThumbnail}</td>
            </tr>
            <tr class="flex flex-row justify-between">
                <th class="text-blue-900 text-justify">PDF Thumbnail</th>
                <td class="text-end">{pdf.pdfThumbnail}</td>
            </tr> -->
        </tbody>
    </table>
</sl-details>

<style>

</style>