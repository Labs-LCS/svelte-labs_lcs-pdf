// import type { ListItemInterface } from './interfaces.svelte';
// import { notify } from './main_logic.svelte';
//
// export async function extractText(pdf: ListItemInterface) {
// 	const file = new Blob([pdf.buffer], { type: 'application/pdf' });
// 	const form = new FormData();
//
// 	form.append('pdf', file, `${pdf.pdfName}`);
//
// 	await fetch('http://localhost:1998/', {
// 		method: 'POST',
// 		body: form
// 	})
// 		.then((response) => response.json())
// 		.then((data) => notify(data));
// }
