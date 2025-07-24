/* eslint-disable prefer-const */

import type { SlAnimation, SlCheckbox, SlDrawer, SlInput } from '@shoelace-style/shoelace';
import { openDB } from 'idb';
import { PDFDocument } from 'mupdf';
import { getDocument } from 'pdfjs-dist';
import type { CoverItemInterface, ListItemInterface, pdfObj } from './interfaces.svelte';
import { parsePdfData } from './parser.svelte';
import { renderPdf } from './render.svelte';

// State objects

export let pdfObjects: ListItemInterface[] = $state([]);
export let coverObjects: CoverItemInterface[] = $state([]);

function escapeHTML(html: string) {
	const div = document.createElement('div');
	div.textContent = html;
	return div.innerHTML;
}

export function notify(
	message: string,
	variant = 'primary',
	icon = 'info-circle',
	duration = 3000
) {
	const toastNotification = Object.assign(document.createElement('sl-alert'), {
		variant,
		closable: true,
		duration: duration,
		innerHTML: `
      <sl-icon name="${icon}" slot="icon"></sl-icon>
      ${escapeHTML(message)}
    `
	});
	document.body.append(toastNotification);
	return toastNotification.toast();
}

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * This function initializes the pdf_db database, which can be seen in Application folder
 * in the browser (or Storage). If pdf_db already exists, then its content will be cleared.
 */
export async function pdf_db() {
	const db = await openDB('pdf_db', 1, {
		upgrade(db) {
			db.createObjectStore('unmodified', { keyPath: 'id' });
			db.createObjectStore('modified', { keyPath: 'id' });
		}
	});
	const tx = db.transaction(['unmodified', 'modified'], 'readwrite');
	await tx.objectStore('unmodified').clear();
	await tx.objectStore('modified').clear();
	await tx.done;
}

/**
 * Used to store any file provided. Other functions (those who calls storeFile())
 * assert this is always a PDF file.
 */
export async function storeFile(pdf: ListItemInterface) {
	try {
		const data = {
			id: pdf.pdfId,
			buffer: pdf.buffer
		};
		const db = await openDB(pdf.database);
		await db.add(pdf.store, data);
	} catch (error) {
		console.error(error);
		notify(`Something went wrong with file "${pdf.pdfName}"`);
	}
}

/**
 * Used to store any file provided. Other functions assert this is always a PDF file.
 * Ensures that the file (expected: PDF cover) overwrites any existing PDF cover.
 */
export async function storeCover(cover: CoverItemInterface) {
	try {
		const data = {
			id: cover.id,
			buffer: cover.buffer
		};
		const db = await openDB(cover.database);
		await db.delete(cover.store, cover.id);
		await db.add(cover.store, data);
	} catch (error) {
		console.log(error);
		notify(`Something went wrong with file "${cover.id}"`);
	}
}

// e: { currentTarget: EventTarget & HTMLInputElement }
// const files = e.currentTarget.files;

export async function addPdf(files: FileList | undefined | null) {
	if (files) {
		const filesArray = Array.from(files);
		for (const file of filesArray) {
			if (file.type === 'application/pdf') {
				const pdf = await parsePdfData(file);
				await storeFile(pdf);
				const pdfDoc = await getDocument({ data: pdf.buffer }).promise;
				pdf.pdfThumbnail = await renderPdf(pdfDoc, 1);
				pdfDoc.destroy();
				pdfObjects.push(pdf);
			} else {
				notify(`The file ${file.name} is not a PDF.`, 'warning', 'exclamation-triangle', 4000);
			}
		}
	} else {
		notify('No files were uploaded');
	}
}

// Bug Report Button
export function report(message: string) {
	const mailtoLink = `mailto:contact@labs-lcs.com?subject=Bug Report&body=${encodeURIComponent(message)}`;
	window.location.href = mailtoLink;
}

// Select All Checkbox
export function selectAllFn(selectAll: SlCheckbox) {
	if (selectAll.checked) {
		document.querySelectorAll('li').forEach((item) => {
			item.setAttribute('data-selected', 'true');
			const checkbox = item.querySelector('sl-checkbox');
			checkbox!.checked = true;
			const divCover = item.querySelector('.cover-div');
			divCover?.classList.add('shadow-sm', 'shadow-orange-800');
			const divItem = item.querySelector('.item-div');
			divItem?.classList.add('shadow-sm', 'shadow-orange-800');
		});
	} else {
		document.querySelectorAll('li').forEach((item) => {
			item.setAttribute('data-selected', 'false');
			const checkbox = item.querySelector('sl-checkbox');
			checkbox!.checked = false;
			const divCover = item.querySelector('.cover-div');
			divCover?.classList.remove('shadow-sm', 'shadow-orange-800');
			const divItem = item.querySelector('.item-div');
			divItem?.classList.remove('shadow-sm', 'shadow-orange-800');
		});
	}
}

// Download Button: Merge
export async function mergeAndDownload() {
	let ids: string[] = [];
	const items = document.querySelectorAll('.list-area li');

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		ids.push(item.id);
	}
	const mergedName = document.getElementById('merged-name')!;

	if ((mergedName as SlInput).value === '') {
		const shakeElement = document.getElementById('shake-merged-name')!;
		(shakeElement as SlAnimation).setAttribute('play', '');
		setTimeout(() => {
			shakeElement.removeAttribute('play');
		}, 1000);
		return;
	}

	const db = await openDB('pdf_db');
	const pdfItem = await db.get('unmodified', ids[0]);
	const buffer = pdfItem.buffer;
	const tmpPdf = PDFDocument.openDocument(buffer, 'application/pdf') as PDFDocument;

	try {
		for (let i = 0; i < ids.length; i++) {
			const cover = await db.get('unmodified', `cover-${ids[i]}`);

			if (cover) {
				const id = ids[i];
				const pdf = await db.get('unmodified', id);
				const pdfBuffer: ArrayBuffer = pdf.buffer;
				const coverBuffer = cover.buffer;
				const loadedPdf = PDFDocument.openDocument(pdfBuffer, 'application/pdf') as PDFDocument;
				const loadedCover = PDFDocument.openDocument(coverBuffer, 'application/pdf') as PDFDocument;
				const pages = loadedPdf.countPages();

				try {
					tmpPdf.graftPage(-1, loadedCover, 0);
				} catch (error) {
					console.error(`Cover image for pdf "${id}" could not be copied:`, error);
					notify(`Cover image for pdf "${id}" could not be copied. Aborting operation.`);
					return;
				}

				for (let j = 0; j < pages; j++) {
					try {
						tmpPdf.graftPage(-1, loadedPdf, j);
					} catch (error) {
						console.error(`Page number ${j + 1} (index ${j}) could not be copied:`, error);
						notify(`Page number ${j + 1} (index ${j}) could not be copied. Aborting operation.`);
						return;
					}
				}
			} else {
				const id = ids[i];
				const pdf = await db.get('unmodified', id);
				const pdfBuffer: ArrayBuffer = pdf.buffer;
				const loadedPdf = PDFDocument.openDocument(pdfBuffer, 'application/pdf') as PDFDocument;
				const pages = loadedPdf.countPages();

				for (let j = 0; j < pages; j++) {
					try {
						tmpPdf.graftPage(-1, loadedPdf, j);
					} catch (error) {
						console.error(`Page number ${j + 1} (index ${j}) could not be copied:`, error);
						notify(`Page number ${j + 1} (index ${j}) could not be copied. Aborting operation.`);
						return;
					}
				}
			}
		}
	} catch (error) {
		console.error('Merge function failed:', error);
		notify('Unknown error. Merge function failed.');
		return;
	}

	const mergedPdfBuffer = tmpPdf.saveToBuffer().asUint8Array();
	const blob = new Blob([mergedPdfBuffer], { type: 'application/pdf' });
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `${(mergedName as SlInput).value}.pdf`;
	link.click();
	window.URL.revokeObjectURL(url);
}

// Download Button: Not merge
export async function downloadNotMerge() {
	let ids: string[] = [];
	const items = document.querySelectorAll('.list-area li');

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		ids.push(item.id);
	}

	const db = await openDB('pdf_db');
	for (let i = 0; i < ids.length; i++) {
		const id = ids[i];
		const pdf = await db.get('unmodified', id);
		const pdfBuffer: ArrayBuffer = pdf.buffer;
		const loadedPdf = PDFDocument.openDocument(pdfBuffer, 'application/pdf') as PDFDocument;
		const cover = await db.get('unmodified', `cover-${ids[i]}`);

		if (cover) {
			const coverBuffer = cover.buffer;
			const loadedCover = PDFDocument.openDocument(coverBuffer, 'application/pdf') as PDFDocument;

			try {
				loadedPdf.graftPage(0, loadedCover, 0);
			} catch (error) {
				console.error(`Cover image for pdf "${id}" could not be copied:`, error);
				notify(`Cover image for pdf "${id}" could not be copied. Aborting operation.`);
				return;
			}

			const mergedPdfBuffer = loadedPdf.saveToBuffer().asUint8Array();
			const blob = new Blob([mergedPdfBuffer], { type: 'application/pdf' });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			const pdfName = document.getElementById(`input-${id}`)!;
			link.download = `${
				(pdfName as SlInput).value.endsWith('.pdf')
					? `${(pdfName as SlInput).value}`
					: `${(pdfName as SlInput).value}` + '.pdf'
			}`;
			link.click();
			window.URL.revokeObjectURL(url);
			await delay(200);
		} else {
			const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			const pdfName = document.getElementById(`input-${id}`)!;
			link.download = `${
				(pdfName as SlInput).value.endsWith('.pdf')
					? `${(pdfName as SlInput).value}`
					: `${(pdfName as SlInput).value}` + '.pdf'
			}`;
			link.click();
			window.URL.revokeObjectURL(url);
			await delay(200);
		}
	}
}

// Cover Buttons
export async function addMultipleCovers(e: { currentTarget: EventTarget & HTMLInputElement }) {
	const files = e.currentTarget.files;
	const selectedItems = getSelected();
	const iterations = Math.min(files?.length || 0, selectedItems?.length || 0);
	if (files && selectedItems) {
		for (let i = 0; i < iterations; i++) {
			try {
				const file = files[i];
				const database = 'pdf_db',
					store = 'unmodified',
					buffer = await file.arrayBuffer(),
					id = `cover-${selectedItems[i].id}`,
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
				const thumbnail = selectedItems[i].querySelector('.cover-thumbnail')!.querySelector('img')!;
				thumbnail.src = await renderPdf(coverDoc, 1);
				coverDoc.destroy();
			} catch (error) {
				console.error(`Couldn't insert cover in item ${selectedItems[i]}:`, error);
				notify('Something went wrong. Aborting operation.');
				return;
			}
		}
	}
}

export async function removeCover() {
	const selectedItems = getSelected();
	if (selectedItems) {
		const db = await openDB('pdf_db');
		for (let i = 0; i < selectedItems.length; i++) {
			const index = pdfObjects.findIndex(
				(pdf: { pdfId: string }) => pdf.pdfId === selectedItems[i].id
			);
			pdfObjects[index].coverThumbnail = '';
			const thumbnail = selectedItems[i].querySelector('.cover-thumbnail')!.querySelector('img')!;
			thumbnail.src = '/assets/custom-cover.png';
			await db.delete(selectedItems[i].getAttribute('data-store')!, `cover-${selectedItems[i].id}`);
		}
	}
}

// Delete Buttons
export async function deleteSelected() {
	await removeCover();
	const selectedItems = getSelected();
	if (selectedItems) {
		const db = await openDB('pdf_db');
		for (let i = 0; i < selectedItems.length; i++) {
			const index = pdfObjects.findIndex(
				(pdf: { pdfId: string }) => pdf.pdfId === selectedItems[i].id
			);
			pdfObjects.splice(index, 1);
			db.delete(selectedItems[i].getAttribute('data-store')!, selectedItems[i].id);
		}
		db.close();
	}
	const selectAllCheckbox: SlCheckbox = document.querySelector('.select-all-checkbox')!;
	selectAllCheckbox.click();
	selectAllCheckbox.click();
}

export async function deleteAll() {
	const db = await openDB('pdf_db');
	await db.clear('unmodified');
	pdfObjects.splice(0, pdfObjects.length);
	db.close();
}

// Get Selected
export function getSelected() {
	const selectedItems = document
		.querySelector('.list-area')
		?.querySelectorAll('li[data-selected="true"]');
	return selectedItems;
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

async function saveNewPdfOrder(pdf: ListItemInterface, pageOrder: string[]) {
	const db = await openDB(pdf.database);
	const pdfObj: pdfObj = await db.get(pdf.store, pdf.pdfId);
	const buffer = pdfObj.buffer;
	let currentPdf = PDFDocument.openDocument(buffer, 'application/pdf') as PDFDocument;

	for (let i = 0; i < pageOrder.length; i++) {
		try {
			currentPdf.graftPage(-1, currentPdf, i);
		} catch (error) {
			console.error(`Couldn't copy page ${i + 1} (index ${i}):`, error);
			return 'Something went wrong.';
		}
	}
	for (let i = 0; i < pdf.pages; i++) {
		currentPdf.deletePage(i);
	}
	// @ts-expect-error Buffer can be either UInt8Array or ArrayBuffer.
	pdfObj.buffer = currentPdf.saveToBuffer().asUint8Array();
	await db.put(pdf.store, pdfObj);
	pdf.pages = currentPdf.countPages();
	pdf.size = pdfObj.buffer.byteLength;
	pdf.tag = 'Edited';
	db.close();
}

export async function deleteSinglePdf(pdfId: string, database: string, store: string) {
	const index = pdfObjects.findIndex((pdf) => pdf.pdfId === pdfId);
	pdfObjects.splice(index, 1);
	const db = await openDB(database);
	await db.delete(store, pdfId);
	await db.delete(store, `cover-${pdfId}`).then(() => db.close());
}

export async function savePdf(drawer: SlDrawer, pageOrder: string[], pdf: ListItemInterface) {
	const editView = drawer.querySelector('.edit-view');
	const pdfPages = editView?.querySelectorAll('.page');
	pageOrder = [];
	pdfPages?.forEach((page) => {
		pageOrder.push(page.id);
	});
	await saveNewPdfOrder(pdf, pageOrder);
}

// TODO: This two functions (savePdf and saveNewPdfOrder) works, but are mixed...
