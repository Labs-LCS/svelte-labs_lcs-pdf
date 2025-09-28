> **PROJECT UNDER MIGRATION: Client-Side Version --> Client-Side & Server Side Version**
>
> This repository contains the original, fully client-side version of the Privacy-Focused PDF Editor. All PDF processing (merging, reordering, etc.) is performed directly in your browser using WebAssembly, ensuring no files ever leave your machine.
>
> This project is no longer under active development. Development has transitioned to a new version that includes a self-hosted backend for more intensive processing.
>
> **For the latest version, please visit the new repository: [Portfolio Site](https://github.com/Labs-LCS/Portfolio-Site)**

---

# Privacy-Focused PDF Editor for Legal Professionals

This is a browser-based PDF editor designed with the privacy needs of Brazilian lawyers in mind. The project delivers a simple yet comprehensive interface tailored for common legal document operations such as merging, reordering, deleting, and annotating PDFs.

The initial architecture was designed for a truly serverless environment, utilizing a simple Single-Page Application (SPA) schema within SvelteKit. The core principle was to offer a clear and secure method for handling documents and user data without storing them, preserving full user privacy.

## Technical Aspects

Aside from authentication (handled via **Firebase**), the entire application runs client-side, with routing being handled via **SvelteKit**. It uses the browser's **IndexedDB** for local file storage, ensuring that no documents are uploaded or stored on external servers — preserving full user privacy.

Initially deployed on **Cloudflare**, the project was later migrated to **Vercel** to support potential Node.js enhancements. PDF rendering is powered by Mozilla's **PDF.js**, while core document operations (merge, delete, reorder) are handled by **MuPDF** compiled to **WebAssembly** — a deliberate choice for performance and device compatibility. Using a C-based engine via WASM ensures fast processing even on lower-end machines, unlike JavaScript-only libraries.

To maximize performance and maintain minimal overhead, the frontend was built with **Svelte** — a compiler rather than a runtime framework. This allowed for efficient state management and fast load times. The first version of this project was developed with vanilla JavaScript and PDF-Lib.js as a learning experience, before evolving into a more robust solution.
