export interface dbPdfObject {
	id: string;
	buffer: ArrayBuffer;
}

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

export interface CoverItemInterface {
	database: string;
	store: string;
	buffer: ArrayBuffer;
	id: string;
	coverThumbnail: string;
}

export interface pdfObj {
	buffer: ArrayBuffer;
	id: string;
}
export interface pageImgObj {
	src: string;
	pageId: string;
}
