/**
 * Document OCR & Classification Service
 *
 * Uses Tesseract.js for image OCR and pdfjs-dist for PDF text extraction.
 * Classifies documents into categories based on keyword analysis of extracted text.
 * Also extracts structured data like PAN, GSTIN, CIN, MII %, and turnover values.
 */

import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdf.js worker — use the bundled worker via CDN for Vite compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// ─── Helpers ────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Compute a hex-encoded SHA-256 digest of an ArrayBuffer using the Web Crypto API.
 */
async function computeSha256(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── PDF text extraction ────────────────────────────────────────

async function extractTextFromPdf(dataUrl: string): Promise<string> {
  // Convert data URL to Uint8Array
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const textParts: string[] = [];

  const maxPages = Math.min(pdf.numPages, 5); // limit to first 5 pages for performance
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
    textParts.push(pageText);
  }

  return textParts.join('\n');
}

// ─── Image OCR via Tesseract.js ─────────────────────────────────

async function extractTextFromImage(dataUrl: string): Promise<string> {
  const { data } = await Tesseract.recognize(dataUrl, 'eng', {
    logger: () => {},
  });
  return data.text;
}

// ─── Keyword-based document classification ──────────────────────

type DocCategory = 'financial' | 'tax' | 'corporate' | 'technical' | 'emd';

interface ClassificationResult {
  category: DocCategory;
  categoryLabel: string;
  confidence: number;
}

const CATEGORY_KEYWORDS: Record<DocCategory, { label: string; keywords: string[] }> = {
  financial: {
    label: 'Financial Certificate',
    keywords: [
      'turnover', 'balance sheet', 'profit and loss', 'audited', 'chartered accountant',
      'net worth', 'financial statement', 'revenue', 'ca certificate', 'annual accounts',
      'audit report', 'income statement', 'assets', 'liabilities', 'capital',
      'gross receipt', 'total income', 'financial year', 'fy 20', 'fy 19',
    ],
  },
  tax: {
    label: 'Tax & Statutory',
    keywords: [
      'gst', 'gstin', 'gstr', 'gstr-3b', 'gstr-1', 'goods and services tax',
      'pan card', 'permanent account number', 'income tax', 'itr', 'itr-v',
      'tax return', 'tds', 'tax deducted', 'challan', 'form 26as', 'assessment year',
      'tax identification', 'tin', 'tax compliance', 'epfo', 'provident fund',
    ],
  },
  corporate: {
    label: 'DPIIT MII / Corporate',
    keywords: [
      'cin', 'company identification', 'incorporation', 'certificate of incorporation',
      'mca', 'ministry of corporate', 'roc', 'registrar of companies',
      'msme', 'udyam', 'udyog aadhaar', 'micro small medium',
      'dpiit', 'make in india', 'mii', 'local content', 'domestic value addition',
      'self-declaration', 'self declaration', 'class-i', 'class-ii',
      'memorandum of association', 'articles of association', 'board resolution',
    ],
  },
  technical: {
    label: 'Technical Matrix',
    keywords: [
      'technical specification', 'compliance matrix', 'technical bid',
      'iso', 'iso 9001', 'iso 27001', 'iso 14001', 'bis', 'bureau of indian standards',
      'quality management', 'technical evaluation', 'scope of work', 'rfp',
      'project experience', 'work order', 'completion certificate',
      'specification', 'annexure', 'schedule of requirement',
    ],
  },
  emd: {
    label: 'EMD / Deposit Proof',
    keywords: [
      'emd', 'earnest money', 'bank guarantee', 'bg', 'bid security',
      'demand draft', 'dd', 'bank deposit', 'fixed deposit', 'fdr',
      'security deposit', 'performance guarantee', 'irrevocable',
      'beneficiary', 'bank of india', 'state bank', 'sbi', 'national bank',
      'guarantee amount', 'bid bond',
    ],
  },
};

export function classifyDocumentText(text: string): ClassificationResult {
  const lowerText = text.toLowerCase();

  let bestCategory: DocCategory = 'technical'; // default fallback
  let bestScore = 0;

  for (const [category, { label, keywords }] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      // Count occurrences, give extra weight to first match
      const idx = lowerText.indexOf(kw);
      if (idx !== -1) {
        score += 3; // base points for a keyword match
        // bonus for early appearance (more relevant if near the top)
        if (idx < 500) score += 2;
        // bonus for second occurrence
        if (lowerText.indexOf(kw, idx + kw.length) !== -1) score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as DocCategory;
      // label is captured in the outer loop but we need it after
    }
  }

  const { label } = CATEGORY_KEYWORDS[bestCategory];
  const confidence = Math.min(100, Math.round((bestScore / 25) * 100));

  return { category: bestCategory, categoryLabel: label, confidence };
}

// ─── Structured data extraction via regex ───────────────────────

export interface ExtractedFields {
  pan?: string;
  gstin?: string;
  cin?: string;
  declaredMiiPercent?: number;
  turnoverAmount?: string;
}

export function extractStructuredData(text: string): ExtractedFields {
  const fields: ExtractedFields = {};

  // PAN: 5 uppercase letters, 4 digits, 1 uppercase letter  (e.g. AAECT1234F)
  const panMatch = text.match(/\b([A-Z]{5}[0-9]{4}[A-Z])\b/);
  if (panMatch) fields.pan = panMatch[1];

  // GSTIN: 2 digits, PAN, 1 alphanumeric, Z, 1 alphanumeric (e.g. 23AAECT1234F1Z8)
  const gstinMatch = text.match(/\b(\d{2}[A-Z]{5}\d{4}[A-Z]\d[A-Z\d][Z][A-Z\d])\b/);
  if (gstinMatch) fields.gstin = gstinMatch[1];

  // CIN: 1 letter, 5 digits, 2 letters, 4 digits, 3 letters, 6 digits (e.g. U72200MP2015PTC034112)
  const cinMatch = text.match(/\b([UL]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6})\b/);
  if (cinMatch) fields.cin = cinMatch[1];

  // MII / Local Content percentage
  const miiMatch = text.match(/(?:local\s*content|mii|domestic\s*value\s*addition)[^0-9]*(\d{1,3})\s*%/i);
  if (miiMatch) {
    const pct = parseInt(miiMatch[1], 10);
    if (pct >= 0 && pct <= 100) fields.declaredMiiPercent = pct;
  }

  // Turnover amount (₹ or Rs or INR followed by numbers with optional commas and Cr/Lakh/Crore)
  const turnoverMatch = text.match(
    /(?:turnover|total\s*income|gross\s*receipt|revenue)[^₹\d]*[₹Rs.INR\s]*([\d,]+(?:\.\d+)?)\s*(?:crore|cr|lakh|lac|million)?/i
  );
  if (turnoverMatch) {
    fields.turnoverAmount = `₹ ${turnoverMatch[1]} ${(text.match(/crore|cr/i) ? 'Crore' : text.match(/lakh|lac/i) ? 'Lakh' : '')}`.trim();
  }

  return fields;
}

// ─── Main processing pipeline ───────────────────────────────────

export interface DocumentProcessingResult {
  ocrText: string;
  classification: ClassificationResult;
  extractedData: ExtractedFields;
  sha256Hash: string;
  sizeFormatted: string;
  mimeType: string;
}

export async function processUploadedFile(
  file: File,
  onProgress?: (stage: string, pct: number) => void,
): Promise<DocumentProcessingResult> {
  onProgress?.('Reading file...', 10);

  // Read file as ArrayBuffer for hashing and as DataURL for OCR/display
  const arrayBuffer = await file.arrayBuffer();
  const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  onProgress?.('Computing SHA-256 hash...', 25);
  const sha256Hash = await computeSha256(arrayBuffer);

  onProgress?.('Extracting text via OCR...', 40);

  let ocrText = '';
  const mime = file.type.toLowerCase();

  if (mime === 'application/pdf') {
    try {
      ocrText = await extractTextFromPdf(dataUrl);
      // If very little text was extracted (scanned PDF), try OCR on rendered page
      if (ocrText.trim().length < 30) {
        onProgress?.('Scanned PDF detected — running image OCR...', 55);
        // Render first page to canvas and OCR it
        const base64 = dataUrl.split(',')[1];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport } as any).promise;
        const pageImageUrl = canvas.toDataURL('image/png');
        ocrText = await extractTextFromImage(pageImageUrl);
      }
    } catch (err) {
      console.warn('PDF text extraction failed, trying image OCR fallback:', err);
      ocrText = '[PDF text extraction unavailable]';
    }
  } else if (mime.startsWith('image/')) {
    ocrText = await extractTextFromImage(dataUrl);
  } else {
    // For xlsx and other non-image/non-pdf types, use filename heuristics only
    ocrText = file.name;
  }

  onProgress?.('Classifying document...', 75);

  // Combine filename and OCR text for classification
  const classificationInput = `${file.name}\n${ocrText}`;
  const classification = classifyDocumentText(classificationInput);

  onProgress?.('Extracting structured data (PAN, GSTIN, CIN)...', 90);
  const extractedData = extractStructuredData(ocrText);

  onProgress?.('Complete', 100);

  return {
    ocrText,
    classification,
    extractedData,
    sha256Hash,
    sizeFormatted: formatFileSize(file.size),
    mimeType: file.type,
  };
}

/**
 * Build the fileDataUrl from a File for preview / opening.
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
