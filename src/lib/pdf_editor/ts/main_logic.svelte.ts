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

/**
 * @function escapeHTML
 * @description Escapes HTML content by converting it to safe text
 * @param {string} html - HTML string to escape
 * @returns {string} Escaped HTML string
 */
function escapeHTML(html: string) {
	const div = document.createElement('div');
	div.textContent = html;
	return div.innerHTML;
}

/**
 * @function notify
 * @description Creates and displays a toast notification
 * @param {string} message - Message to display in the notification
 * @param {string} [variant='primary'] - Notification variant/style
 * @param {string} [icon='info-circle'] - Icon name to display
 * @param {number} [duration=3000] - Duration in milliseconds before auto-close
 * @returns {Promise} Toast notification promise
 */
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

/**
 * @function delay
 * @description Creates a Promise that resolves after specified milliseconds
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>} Promise that resolves after delay
 */
function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Scope: database
 * @function pdf_db
 * @description This function initializes the pdf_db database, which can be seen in Application folder in the browser (or Storage). If pdf_db already exists, then its content will be cleared.
 * @returns {Promise<void>} Promise that resolves when database is initialized
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
 * @function storeFile
 * @description Used to store any file provided. Other functions (those who calls storeFile()) assert this is always a PDF file.
 * @param {ListItemInterface} pdf - PDF file object to store
 * @returns {Promise<void>} Promise that resolves when file is stored
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
 * @function storeCover
 * @description Used to store any file provided. Other functions assert this is always a PDF file. Ensures that the file (expected: PDF cover) overwrites any existing PDF cover.
 * @param {CoverItemInterface} cover - Cover file object to store
 * @returns {Promise<void>} Promise that resolves when cover is stored
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

/**
 * @function addPdf
 * @description Uses parsePdfData() to parse each file in files (FileList, e.currentTarget.files); storeFile() to store the PDF; renderPdf() to render the thumbnail; updates the pdfObjects Array.
 * @param {FileList | undefined | null} files - List of files to process
 * @returns {Promise<void>} Promise that resolves when all PDFs are processed
 */
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

/**
 * @function report
 * @description Provides functionality to the Bug Report Button.
 * @param {string} message - Bug report message to send
 * @returns {void}
 */
export function report(message: string) {
	const mailtoLink = `mailto:contact@labs-lcs.com?subject=Bug Report&body=${encodeURIComponent(message)}`;
	window.location.href = mailtoLink;
}

/**
 * @function selectAllFn
 * @description Provides functionality to Select All Checkbox. Inserts or removes the 'data-selected' attribute of each HTMLLIElement (list item). Changes the classList of each element for user visualization, relying on Tailwind classes.
 * @param {SlCheckbox} selectAll - Select all checkbox element
 * @returns {void}
 */
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

/**
 * @function mergeAndDownload
 * @description Provides functionality to the Merge Download Button.
 * Workflow:
 * -- Checks if user provided a name for the merged document.
 * -- Stores each PDF ID in a string[];
 * -- Creates an empty PDFDocument (tmpPdf);
 * -- Opens the database;
 * -- For each PDF ID:
 * -- -- Checks if it has a cover stored, inserting it in the tmpPdf;
 * -- -- Loads the corresponding PDF from ID and insert it in the tmpPdf, page by page;
 * -- Saves the tmpPdf as mergedPdfBuffer and download it.
 * @returns {Promise<void>} Promise that resolves when merge and download is complete
 */
export async function mergeAndDownload() {
	const mergedName = document.getElementById('merged-name')!;
	if ((mergedName as SlInput).value === '') {
		const shakeElement = document.getElementById('shake-merged-name')!;
		(shakeElement as SlAnimation).setAttribute('play', '');
		setTimeout(() => {
			shakeElement.removeAttribute('play');
		}, 1000);
		return;
	}

	let ids: string[] = [];
	const items = document.querySelectorAll('.list-area li');
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		ids.push(item.id);
	}

	const tmpPdf = new PDFDocument();
	const db = await openDB('pdf_db');

	try {
		for (let i = 0; i < ids.length; i++) {
			const cover = await db.get('unmodified', `cover-${ids[i]}`);

			if (cover) {
				const id = ids[i];
				const pdf = await db.get('unmodified', id);
				const loadedPdf = PDFDocument.openDocument(pdf.buffer) as PDFDocument;
				const loadedCover = PDFDocument.openDocument(cover.buffer) as PDFDocument;
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
				const loadedPdf = PDFDocument.openDocument(pdf.buffer) as PDFDocument;
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
		db.close();
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

/**
 * @function downloadNotMerge
 * @description Provides functionality to the Not merge Download Button.
 * Workflow:
 * -- Stores each PDF ID in a string[];
 * -- Opens the database;
 * -- For each PDF ID:
 * -- -- Checks if it has a cover stored, inserting it in the PDF and downloading it;
 * -- -- Else: just downloads the corresponding PDF.
 * @returns {Promise<void>} Promise that resolves when all downloads are complete
 */
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
		const loadedPdf = PDFDocument.openDocument(pdfBuffer) as PDFDocument;
		const cover = await db.get('unmodified', `cover-${ids[i]}`);

		if (cover) {
			const loadedCover = PDFDocument.openDocument(cover.buffer) as PDFDocument;

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
	db.close();
}

/**
 * @function addSingleCover
 * @description Provides functionality to the Custom Cover Button.
 * Workflow:
 * -- Stores the uploaded cover;
 * -- Renders the cover page and returns it.
 * @param {Object} e - Event object with currentTarget containing HTMLInputElement
 * @param {string} coverId - Unique identifier for the cover
 * @param {string} thumbnail - Initial thumbnail value
 * @returns {Promise<string>} thumbnail - The rendered PDF thumbnail or empty string
 */
export async function addSingleCover(
	e: { currentTarget: EventTarget & HTMLInputElement },
	coverId: string,
	thumbnail: string
) {
	if (e.currentTarget.files) {
		const file = e.currentTarget.files[0];
		const cover: CoverItemInterface = {
			database: 'pdf_db',
			store: 'unmodified',
			buffer: await file.arrayBuffer(),
			id: coverId,
			coverThumbnail: ''
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

/**
 * @function addMultipleCovers
 * @description Adds multiple covers to selected PDF items, matching covers to items by order
 * Workflow:
 * -- Gets uploaded files and selected items;
 * -- Calculates minimum iterations between files and selected items;
 * -- Shows warnings if there's a mismatch between files and selected items;
 * -- For each iteration:
 * -- -- Creates a cover object with the file buffer;
 * -- -- Stores the cover in the database;
 * -- -- Renders the cover thumbnail and updates the UI.
 * @param {Object} e - Event object with currentTarget containing HTMLInputElement with files
 * @returns {Promise<void>} Promise that resolves when all covers are processed
 */
export async function addMultipleCovers(e: { currentTarget: EventTarget & HTMLInputElement }) {
	const files = e.currentTarget.files;
	const selectedItems = getSelected();
	const iterations = Math.min(files?.length || 0, selectedItems?.length || 0);
	if (files && selectedItems) {
		if (files.length < selectedItems.length) {
			notify(
				`You selected ${selectedItems.length} files, but only ${
					files.length == 1
						? `${files.length} cover was uploaded`
						: `${files.length} covers were uploaded`
				}. The last ${
					selectedItems.length - files.length == 1
						? 'file'
						: `${selectedItems.length - files.length} files`
				} will remain without a cover.`,
				'warning',
				'info-circle',
				5000
			);
		} else {
			notify(
				`You uploaded more covers than necessary. Discarded covers: ${files.length - selectedItems.length}`,
				'warning',
				'info-circle',
				5000
			);
		}
		for (let i = 0; i < iterations; i++) {
			try {
				const cover: CoverItemInterface = {
					database: 'pdf_db',
					store: 'unmodified',
					buffer: await files[i].arrayBuffer(),
					id: `cover-${selectedItems[i].id}`,
					coverThumbnail: ''
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

/**
 * @function removeCover
 * @description Removes covers from selected PDF items and resets thumbnails to default
 * @returns {Promise<void>} Promise that resolves when all covers are removed
 */
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
		db.close();
	}
}

/**
 * @function deleteSinglePdf
 * @description Deletes a single PDF and its associated cover from database and state
 * @param {string} pdfId - Unique identifier of the PDF to delete
 * @param {string} database - Database name
 * @param {string} store - Object store name
 * @returns {Promise<void>} Promise that resolves when PDF is deleted
 */
export async function deleteSinglePdf(pdfId: string, database: string, store: string) {
	const index = pdfObjects.findIndex((pdf) => pdf.pdfId === pdfId);
	pdfObjects.splice(index, 1);
	const db = await openDB(database);
	await db.delete(store, pdfId);
	await db.delete(store, `cover-${pdfId}`).then(() => db.close());
}

/**
 * @function deleteSelected
 * @description Deletes all selected PDF items and their covers from database and state
 * @returns {Promise<void>} Promise that resolves when all selected items are deleted
 */
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
}

/**
 * @function deleteAll
 * @description Deletes all PDF items from database and clears the state array
 * @returns {Promise<void>} Promise that resolves when all items are deleted
 */
export async function deleteAll() {
	const db = await openDB('pdf_db');
	await db.clear('unmodified');
	pdfObjects.splice(0, pdfObjects.length);
	db.close();
}

/**
 * @function deletePages
 * @description Provides functionality to delete selected pages from the drawer's edit view;
 * @param {SLDrawer} drawer - Drawer element containing the edit view with pages
 * @returns {void}
 */
export function deletePages(drawer: SlDrawer) {
	const pagesToDelete = drawer.querySelector('.edit-view')!.querySelectorAll('.selected');
	pagesToDelete.forEach((page) => {
		page.remove();
	});
}

/**
 * @function getSelected
 * @description Gets all currently selected list items from the UI
 * @returns {NodeListOf<Element> | undefined} Collection of selected list elements
 */
export function getSelected() {
	const selectedItems = document
		.querySelector('.list-area')
		?.querySelectorAll('li[data-selected="true"]');
	return selectedItems;
}

/**
 * @function saveNewPdfOrder
 * @description Reorders PDF pages according to the specified page order and saves to database
 * @param {ListItemInterface} pdf - PDF object to reorder
 * @param {string[]} pageOrder - Array of page IDs in new order
 * @returns {Promise<string | void>} Error message if operation fails, void if successful
 */
async function saveNewPdfOrder(pdf: ListItemInterface, pageOrder: string[]) {
	const db = await openDB(pdf.database);
	const pdfObj: pdfObj = await db.get(pdf.store, pdf.pdfId);
	const buffer = pdfObj.buffer;
	let currentPdf = PDFDocument.openDocument(buffer) as PDFDocument;

	for (let i = 0; i < pageOrder.length; i++) {
		try {
			currentPdf.graftPage(-1, currentPdf, Number(pageOrder[i]));
		} catch (error) {
			console.error(`Couldn't copy page ${i + 1} (index ${i}):`, error);
			return 'Something went wrong.';
		}
	}
	for (let i = 0; i < pdf.pages; i++) {
		currentPdf.deletePage(0);
	}
	// @ts-expect-error Buffer can be either UInt8Array or ArrayBuffer.
	pdfObj.buffer = currentPdf.saveToBuffer().asUint8Array();
	await db.put(pdf.store, pdfObj);
	pdf.pages = currentPdf.countPages();
	pdf.size = pdfObj.buffer.byteLength;
	pdf.tag = 'Edited';
	db.close();
}

/**
 * @function savePdf
 * @description Saves PDF with new page order based on the current order in the drawer UI
 * @param {SlDrawer} drawer - Drawer element containing the edit view
 * @param {string[]} pageOrder - Array to store the new page order (gets modified)
 * @param {ListItemInterface} pdf - PDF object to save
 * @returns {Promise<void>} Promise that resolves when PDF is saved
 */
export async function savePdf(drawer: SlDrawer, pageOrder: string[], pdf: ListItemInterface) {
	const editView = drawer.querySelector('.edit-view');
	const pdfPages = editView?.querySelectorAll('.page');
	pageOrder = [];
	pdfPages?.forEach((page) => {
		pageOrder.push(page.id);
	});
	console.log(pageOrder, pageOrder.length, pdf.pages);
	await saveNewPdfOrder(pdf, pageOrder);
}

// TODO: This two functions (savePdf and saveNewPdfOrder) works, but are mixed...
