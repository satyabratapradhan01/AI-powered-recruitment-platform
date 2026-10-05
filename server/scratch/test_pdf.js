import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');

const dummyPdfBuffer = Buffer.from(
  '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 55 >>\nstream\nBT /F1 12 Tf 72 712 Td (Satya Pradhan Resume - Software Engineer) Tj ET\nendstream\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF'
);

async function test() {
  try {
    const uint8Array = new Uint8Array(dummyPdfBuffer);
    const parser = new pdfModule.PDFParse(uint8Array);
    const textResult = await parser.getText();
    console.log('Extracted Text Result:', textResult);
  } catch (err) {
    console.log('Error:', err.message);
  }
}
test();
