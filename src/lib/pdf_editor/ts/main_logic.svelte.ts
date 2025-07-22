/* eslint-disable prefer-const */

// Libraries imports

import { openDB } from 'idb';
import { getDocument } from 'pdfjs-dist';

// Svelte.ts imports

import { renderPdf } from './render.svelte';
import { parsePdfData, parseCoverData } from './parser.svelte';
import type { ListItemInterface, CoverItemInterface } from './interfaces.svelte';

// State variables

// State objects

export let pdfObjects: ListItemInterface[] = $state([]);
export let coverObjects: CoverItemInterface[] = $state([]);

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
		console.log('No files were uploaded');
	}
}

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

export async function addCover(coverId: string, file: File | undefined) {
	if (file) {
		const cover = await parseCoverData(coverId, file);
		await storeCover(cover);
		const coverDoc = await getDocument({ data: cover.buffer }).promise;
		const thumbnail = await renderPdf(coverDoc, 1);
		coverDoc.destroy();
		coverObjects.push(cover);
		return thumbnail;
	} else {
		return '';
	}
}

// Bug Report Button
export function report(message: string) {
	const mailtoLink = `mailto:contact@labs-lcs.com?subject=Bug Report&body=${encodeURIComponent(message)}`;
	window.location.href = mailtoLink;
}
