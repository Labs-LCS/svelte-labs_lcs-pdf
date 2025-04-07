/* eslint-disable prefer-const */
import {
	coverObjects,
	pdfObjects,
	type CoverItemInterface,
	type ListItemInterface
} from './globals.svelte';
import type { SlDrawer } from '@shoelace-style/shoelace';
import { openDB } from 'idb';
import { PDFDocument } from 'mupdf/mupdfjs';
import { storeCover } from './db.svelte';
import { getDocument } from 'pdfjs-dist';
import { renderPdf } from './render.svelte';

interface pdfObj {
	buffer: ArrayBuffer;
	id: string;
}

export interface pageImgObj {
	pageId: string;
	src: string;
}

export async function addSingleCover(
	e: { currentTarget: EventTarget & HTMLInputElement },
	coverId: string,
	thumbnail: string
) {
	if (e.currentTarget.files) {
		const file = e.currentTarget.files[0];
		const database = 'pdf_db',
			store = 'unmodified',
			buffer = await file.arrayBuffer(),
			id = coverId,
			coverThumbnail = '';
		const cover: CoverItemInterface = {
			database,
			store,
			buffer,
			id,
			coverThumbnail
		};
		await storeCover(cover);
		const coverDoc = await getDocument({ data: cover.buffer }).promise;
		thumbnail = await renderPdf(coverDoc, 1);
		coverDoc.destroy();
		coverObjects.push(cover);
		return thumbnail;
	} else {
		return '';
	}
}

export async function deleteSinglePdf(pdfId: string, database: string, store: string) {
	const index = pdfObjects.findIndex((pdf) => pdf.pdfId === pdfId);
	pdfObjects.splice(index, 1);
	const db = await openDB(database);
	await db.delete(store, pdfId);
	await db.delete(store, `cover-${pdfId}`).then(() => db.close());
}

export function moveUp(liItem: HTMLLIElement) {
	console.log(liItem);
}

export function moveDown(liItem: HTMLLIElement) {
	console.log(liItem);
}

export async function savePdf(drawer: SlDrawer, pageOrder: string[], pdf: ListItemInterface) {
	const editView = drawer.querySelector('.edit-view');
	const pdfPages = editView?.querySelectorAll('.page');
	pageOrder = [];
	pdfPages?.forEach((page) => {
		pageOrder.push(page.id);
	});
	console.log($state.snapshot(pageOrder), 'savePdf');
	await saveNewPdfOrder(pdf, pageOrder);
}

async function saveNewPdfOrder(pdf: ListItemInterface, pageOrder: string[]) {
	console.log($state.snapshot(pageOrder), 'saveNewPdfOrder');
	const db = await openDB(pdf.database);
	const pdfObj: pdfObj = await db.get(pdf.store, pdf.pdfId);
	const buffer = pdfObj.buffer;
	let currentPdf = PDFDocument.openDocument(buffer, 'application/pdf');

	for (let i = 0; i < pageOrder.length; i++) {
		currentPdf.copyPage(Number(pageOrder[i]), -1);
	}
	currentPdf.deletePages({ fromPage: 0, toPage: pdf.pages - 1 });
	// @ts-expect-error Buffer can be either UInt8Array or ArrayBuffer.
	pdfObj.buffer = currentPdf.saveToBuffer().asUint8Array();
	await db.put(pdf.store, pdfObj);
	pdf.pages = currentPdf.countPages();
	pdf.size = pdfObj.buffer.byteLength;
	pdf.tag = 'Edited';
	db.close();

	// const blob = new Blob([pdfObj.buffer], { type: 'application/pdf' });
	// const url = window.URL.createObjectURL(blob);
	// const a = document.createElement('a');
	// a.href = url;
	// a.download = 'test.pdf';
	// a.click();
}
