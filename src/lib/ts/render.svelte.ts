import { GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc =
	'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

/**
 * 
 * @param pdfDoc É um parâmetro próprio do PDF.js da Mozilla.
 * @param pageIndex O índice começa em 1.
 * @returns Promise\<string>, resolvida com 'canvas.toDataURL()'.
 */
export async function renderPdf(pdfDoc: PDFDocumentProxy, pageIndex: number) {
	try {
		const page = await pdfDoc.getPage(pageIndex);

		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		const scale = 0.5;
		const viewport = page.getViewport({ scale });

		canvas.height = viewport.height;

		await page.render({
			canvasContext: context!,
			viewport: viewport
		}).promise;

		return canvas.toDataURL();
	} catch (error) {
		console.error(error);
		return 'static/assets/pdf-icon-big.png';
	}
}
