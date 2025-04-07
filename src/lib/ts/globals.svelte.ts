/* eslint-disable prefer-const */

export interface ListItemInterface {
	database: string;
	store: string;
	buffer: ArrayBuffer;
	size: number;
	pages: number;
	pagesArray: number[];
	pdfId: string;
	pdfName: string;
	pdfThumbnail: string;
	hasCover: boolean;
	coverId: string;
	coverThumbnail: string;
	tag: string;
	selected: boolean;
}

export let pdfObjects: ListItemInterface[] = $state([]);

export interface CoverItemInterface {
	database: string;
	store: string;
	buffer: ArrayBuffer;
	id: string;
	coverThumbnail: string;
}

export let coverObjects: CoverItemInterface[] = $state([]);

export let mergedPdfName: string = $state(''),
	mergedPdfPages: number = $state(0),
	mergedPdfSize: number = $state(0);
