import type { SlAnimation, SlButton, SlCheckbox, SlInput } from '@shoelace-style/shoelace';
import { storeCover, storeFile } from './db.svelte';
import { renderPdf } from './render.svelte';
import { getDocument } from 'pdfjs-dist';
import { pdfObjects, type CoverItemInterface } from './globals.svelte';
import { PDFDocument } from 'mupdf/mupdfjs';
import { openDB } from 'idb';

// Add PDF Button
export async function addPdfFn(
	e: { currentTarget: EventTarget & HTMLInputElement },
	addPdfButton: SlButton
) {
	addPdfButton.setAttribute('loading', '');
	const files = e.currentTarget.files;
	if (files) {
		const filesArray = Array.from(files);
		for (const file of filesArray) {
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

			await storeFile(pdf);
			const pdfDoc = await getDocument({ data: pdf.buffer }).promise; // arraybuffer detached. data passed to pdfDoc
			pdf.pdfThumbnail = await renderPdf(pdfDoc, 1);
			pdfDoc.destroy();
			pdfObjects.push(pdf);
		}
	}
	addPdfButton.removeAttribute('loading');
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

// Download Button
export async function merge() {
	// eslint-disable-next-line prefer-const
	let ids: string[] = [];
	const items = document.querySelectorAll('.list-area li');
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		ids.push(item.id);
	}
	if (ids.length > 1) {
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
		const tmpPdf = PDFDocument.openDocument(buffer, 'application/pdf');
		const coverItem = await db.get('unmodified', `cover-${ids[0]}`);
		if (coverItem) {
			const coverBuffer = coverItem.buffer;
			const loadedCover = PDFDocument.openDocument(coverBuffer, 'application/pdf');
			tmpPdf.merge(loadedCover, 0, 0, 0);
		}
		for (let i = 1; i < ids.length; i++) {
			const cover = await db.get('unmodified', `cover-${ids[i]}`);
			if (cover) {
				const id = ids[i];
				const pdf = await db.get('unmodified', id);
				const pdfBuffer: ArrayBuffer = pdf.buffer;
				const coverBuffer = cover.buffer;
				const loadedPdf = PDFDocument.openDocument(pdfBuffer, 'application/pdf');
				const loadedCover = PDFDocument.openDocument(coverBuffer, 'application/pdf');
				tmpPdf.merge(loadedCover);
				tmpPdf.merge(loadedPdf);
			} else {
				const id = ids[i];
				const pdf = await db.get('unmodified', id);
				const pdfBuffer: ArrayBuffer = pdf.buffer;
				const loadedPdf = PDFDocument.openDocument(pdfBuffer, 'application/pdf');
				tmpPdf.merge(loadedPdf);
			}
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
}

export async function downloadNotMerge() {
	// eslint-disable-next-line prefer-const
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
		const loadedPdf = PDFDocument.openDocument(pdfBuffer, 'application/pdf');
		const cover = await db.get('unmodified', `cover-${ids[i]}`);
		if (cover) {
			const coverBuffer = cover.buffer;
			const loadedCover = PDFDocument.openDocument(coverBuffer, 'application/pdf');
			loadedCover.merge(loadedPdf);

			const mergedPdfBuffer = loadedCover.saveToBuffer().asUint8Array();
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

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Cover Buttons
export async function addMultipleCovers(e: { currentTarget: EventTarget & HTMLInputElement }) {
	const files = e.currentTarget.files;
	const selectedItems = getSelected();
	const iterations = Math.min(files?.length || 0, selectedItems?.length || 0);
	// console.log(selectedItems)
	// console.log(e.currentTarget.files[1])
	if (files && selectedItems) {
		for (let i = 0; i < iterations; i++) {
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
		}
	}
}

export async function removeCover() {
	const selectedItems = getSelected();
	if (selectedItems) {
		const db = await openDB('pdf_db');
		for (let i = 0; i < selectedItems.length; i++) {
			const index = pdfObjects.findIndex((pdf) => pdf.pdfId === selectedItems[i].id);
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
			const index = pdfObjects.findIndex((pdf) => pdf.pdfId === selectedItems[i].id);
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
function getSelected() {
	const selectedItems = document
		.querySelector('.list-area')
		?.querySelectorAll('li[data-selected="true"]');
	return selectedItems;
}
