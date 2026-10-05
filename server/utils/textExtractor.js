import { createRequire } from 'module';
import mammoth from 'mammoth';

const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');

/**
 * Extract raw text from PDF or DOCX file buffers.
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - File MIME type or extension
 * @returns {Promise<string>} Extracted raw text
 */
export const extractResumeText = async (buffer, mimeType = '') => {
  if (!buffer || buffer.length === 0) {
    return '';
  }

  const isPdf =
    mimeType.includes('pdf') || mimeType.endsWith('.pdf');
  const isDocx =
    mimeType.includes('word') ||
    mimeType.includes('officedocument') ||
    mimeType.endsWith('.docx') ||
    mimeType.endsWith('.doc');

  try {
    if (isPdf) {
      return await parsePdf(buffer);
    }

    if (isDocx) {
      return await parseDocx(buffer);
    }

    // Generic fallback: try PDF parsing first, then Mammoth
    try {
      const pdfText = await parsePdf(buffer);
      if (pdfText) return pdfText;
    } catch (_) {
      const docxText = await parseDocx(buffer);
      if (docxText) return docxText;
    }

    return '';
  } catch (err) {
    console.error('Failed to extract text from resume buffer:', err.message);
    return '';
  }
};

const parsePdf = async (buffer) => {
  try {
    if (typeof pdfModule === 'function') {
      const data = await pdfModule(buffer);
      if (data && data.text) return data.text.trim();
    }

    if (pdfModule && pdfModule.PDFParse) {
      const uint8Array = new Uint8Array(buffer);
      const parser = new pdfModule.PDFParse(uint8Array);
      const result = await parser.getText();
      if (typeof result === 'string') return result.trim();
      if (result && typeof result.text === 'string') return result.text.trim();
    }
  } catch (err) {
    console.warn('PDF parsing error:', err.message);
  }
  return '';
};

const parseDocx = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result && result.value ? result.value.trim() : '';
  } catch (err) {
    console.warn('DOCX parsing error:', err.message);
  }
  return '';
};
