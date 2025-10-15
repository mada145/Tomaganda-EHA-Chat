
// This assumes pdf.js is loaded via a script tag in index.html, which provides pdfjsLib on the window object.
// We assert its type to avoid TypeScript errors.
declare const pdfjsLib: any;

interface PdfJsTextItem {
    str: string;
}

interface PdfJsTextContent {
    items: PdfJsTextItem[];
}

interface PdfJsPage {
    getTextContent: () => Promise<PdfJsTextContent>;
}

interface PdfJsDocument {
    numPages: number;
    getPage: (pageNumber: number) => Promise<PdfJsPage>;
}

export const extractTextFromPdf = async (file: File): Promise<string> => {
    if (typeof pdfjsLib === 'undefined') {
        console.error("pdf.js library is not loaded.");
        throw new Error("PDF processing library not available.");
    }
    
    const arrayBuffer = await file.arrayBuffer();
    
    // The getDocument call returns a promise that resolves with a PDF document object.
    const pdf: PdfJsDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const numPages = pdf.numPages;
    let fullText = '';
    
    // Create an array of page numbers [1, 2, ..., numPages]
    const pageNumbers = Array.from({ length: numPages }, (_, i) => i + 1);
    
    // Process pages sequentially to maintain order
    for (const pageNum of pageNumbers) {
        const page: PdfJsPage = await pdf.getPage(pageNum);
        const textContent: PdfJsTextContent = await page.getTextContent();
        
        // Join the 'str' property of each item in the text content
        const pageText = textContent.items.map((item: PdfJsTextItem) => item.str).join(' ');
        
        fullText += pageText + '\n\n'; // Add double newline for separation between pages
    }

    return fullText;
};
