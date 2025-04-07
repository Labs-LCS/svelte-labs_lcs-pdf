import { openDB } from 'idb';
import type { CoverItemInterface, ListItemInterface } from './globals.svelte';

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
		console.error(error);
	}
}
