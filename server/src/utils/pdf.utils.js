import { PDFParse } from "pdf-parse";

function cleanPdfText(text = "") {
  return text
    .replace(/\u0000/g, " ")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}

/**
 * Extracts and cleans text from a PDF buffer.
 * @param {Buffer} pdfBuffer - The buffer containing PDF data.
 * @returns {Promise<string>} The extracted and cleaned plain text.
 */
export const extractTextFromPdf = async (pdfBuffer) => {
  const parser = new PDFParse({ data: pdfBuffer });
  const pdfData = await parser.getText();
  await parser.destroy();
  return cleanPdfText(pdfData.text);
};
