import { PDFDocument } from 'mupdf';

export async function parsePdfData(file: File) {
	const database = 'pdf_db',
		store = 'unmodified',
		buffer = await file.arrayBuffer(),
		size = file.size,
		pages = PDFDocument.openDocument(buffer, 'application/pdf').countPages(),
		pagesArray = Array.from(Array(pages).keys()),
		pdfId = `${Date.now() + size}`,
		pdfName = file.name,
		pdfThumbnail = '',
		hasCover = false,
		coverId = `cover-${pdfId}`,
		coverThumbnail = '',
		tag = 'Non edited',
		selected = false;

	const pdf = {
		database,
		store,
		buffer,
		size,
		pages,
		pagesArray,
		pdfId,
		pdfName,
		pdfThumbnail,
		hasCover,
		coverId,
		coverThumbnail,
		tag,
		selected
	};
	return pdf;
}

export async function parseCoverData(coverId: string, file: File) {
	const database = 'pdf_db',
		store = 'unmodified',
		buffer = await file.arrayBuffer(),
		id = coverId,
		coverThumbnail = '';
	const cover = {
		database,
		store,
		buffer,
		id,
		coverThumbnail
	};
	return cover;
}
