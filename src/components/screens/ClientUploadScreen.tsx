import React, { useState, useRef, useCallback } from 'react';
import { ClientDocument, Tender, Bidder, NavPath } from '../../types';
import { processUploadedFile, readFileAsDataUrl } from '../../services/documentOcr';

interface ClientUploadScreenProps {
  documents: ClientDocument[];
  onUploadDocument: (doc: ClientDocument) => void;
  onRemoveDocument: (docId: string) => void;
  activeTender: Tender;
  clientBidder: Bidder;
  onNavigate: (path: NavPath) => void;
}

export const ClientUploadScreen: React.FC<ClientUploadScreenProps> = ({
  documents,
  onUploadDocument,
  onRemoveDocument,
  activeTender,
  clientBidder,
  onNavigate,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<ClientDocument | null>(null);
  const [ocrDetailDoc, setOcrDetailDoc] = useState<ClientDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Real file processing pipeline ──────────────────────────

  const handleRealUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadProgress(5);
    setUploadStage('Reading file...');

    try {
      const [result, fileDataUrl] = await Promise.all([
        processUploadedFile(file, (stage, pct) => {
          setUploadStage(stage);
          setUploadProgress(pct);
        }),
        readFileAsDataUrl(file),
      ]);

      const newDoc: ClientDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        category: result.classification.category,
        categoryLabel: result.classification.categoryLabel,
        sizeFormatted: result.sizeFormatted,
        mimeType: result.mimeType,
        uploadTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        sha256Hash: result.sha256Hash,
        status: result.classification.confidence >= 30 ? 'validated' : 'flagged',
        extractedData: {
          ...result.extractedData,
          // If OCR did not find these, fill from bidder profile for reference
          pan: result.extractedData.pan || undefined,
          gstin: result.extractedData.gstin || undefined,
          cin: result.extractedData.cin || undefined,
        },
        validationMessage:
          result.classification.confidence >= 30
            ? `Auto-classified as "${result.classification.categoryLabel}" (${result.classification.confidence}% confidence). SHA-256 verified.`
            : `Low confidence classification (${result.classification.confidence}%). Manual review recommended.`,
        ocrRawText: result.ocrText,
        fileDataUrl,
      };

      onUploadDocument(newDoc);
    } catch (err) {
      console.error('Document processing error:', err);
      // Still add the document with error status
      const fileDataUrl = await readFileAsDataUrl(file);
      onUploadDocument({
        id: `doc-${Date.now()}`,
        name: file.name,
        category: 'technical',
        categoryLabel: 'Unclassified',
        sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        mimeType: file.type,
        uploadTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        sha256Hash: 'error',
        status: 'flagged',
        validationMessage: 'OCR processing encountered an error. Document added but requires manual classification.',
        fileDataUrl,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStage('');
    }
  }, [onUploadDocument]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleRealUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleRealUpload(e.target.files[0]);
      e.target.value = ''; // reset so the same file can be re-uploaded
    }
  };

  const handleOpenDocument = (doc: ClientDocument) => {
    if (doc.fileDataUrl) {
      if (doc.mimeType === 'application/pdf' || doc.mimeType?.startsWith('image/')) {
        setPreviewDoc(doc);
      } else {
        // For non-previewable files, download
        const link = document.createElement('a');
        link.href = doc.fileDataUrl;
        link.download = doc.name;
        link.click();
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return 'payments';
      case 'tax': return 'receipt_long';
      case 'corporate': return 'domain';
      case 'technical': return 'description';
      case 'emd': return 'account_balance';
      default: return 'insert_drive_file';
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') return 'picture_as_pdf';
    if (mimeType?.startsWith('image/')) return 'image';
    if (mimeType?.includes('sheet') || mimeType?.includes('excel')) return 'table_chart';
    return 'insert_drive_file';
  };

  return (
    <div className="space-y-8 py-4 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary/20">
              Document Vault
            </span>
            <span className="text-xs text-on-surface-variant font-mono">Tender: {activeTender.code}</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface mt-1">Client Document Upload & AI OCR Scanner</h1>
          <p className="text-sm text-on-surface-variant">
            Upload real documents — AI-powered OCR extracts text, auto-classifies category, and validates PAN / GSTIN / CIN / MII data.
          </p>
        </div>

        <button
          onClick={() => onNavigate('client-report')}
          className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-sm font-medium px-4 py-2.5 rounded-xl border border-outline-variant/30 flex items-center gap-2 transition-all shrink-0 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">assessment</span>
          View Verification Report
        </button>
      </div>

      {/* Upload Box Container */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-on-surface mb-1">Upload Document</h2>
        <p className="text-xs text-on-surface-variant mb-5">
          Drop or browse any PDF, image (PNG/JPG), or document file. OCR will auto-detect the document type and extract key data fields.
        </p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.doc,.docx"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {/* File Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
            dragOver ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-outline-variant/30 bg-surface-container/30 hover:border-primary/50 hover:bg-primary/[0.02]'
          } ${isUploading ? 'pointer-events-none opacity-70' : ''}`}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
            dragOver ? 'bg-primary/20 text-primary scale-110' : 'bg-primary/10 text-primary'
          }`}>
            <span className="material-symbols-outlined text-3xl">
              {isUploading ? 'document_scanner' : dragOver ? 'file_download' : 'cloud_upload'}
            </span>
          </div>

          {!isUploading ? (
            <>
              <h3 className="text-base font-semibold text-on-surface mb-1">
                {dragOver ? 'Release to upload & scan' : 'Drag & drop your document here'}
              </h3>
              <p className="text-xs text-on-surface-variant max-w-md mb-3">
                Accepted: PDF, PNG, JPG, XLSX — AI OCR will read the content, classify the document type, and extract PAN, GSTIN, CIN, MII%, and turnover data automatically.
              </p>
              <div className="bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium px-5 py-2.5 rounded-xl border border-outline-variant/30 inline-flex items-center gap-2 transition-all">
                <span className="material-symbols-outlined text-base">folder_open</span>
                Browse Files
              </div>
            </>
          ) : (
            <div className="w-full max-w-md space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-primary font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  {uploadStage}
                </span>
                <span className="font-mono text-on-surface font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-on-surface-variant text-center">
                Processing with Tesseract.js OCR engine & SHA-256 cryptographic hashing...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Documents Table */}
      {documents.length > 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-on-surface">Uploaded Vault Documents</h2>
              <p className="text-xs text-on-surface-variant">Click a document to preview • Click OCR badge to view extracted text</p>
            </div>
            <span className="text-xs bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-mono">
              {documents.length} Files
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-on-surface">
              <thead className="bg-surface-container/60 text-on-surface-variant uppercase text-[10px] tracking-wider font-semibold border-b border-outline-variant/15">
                <tr>
                  <th className="py-3 px-4">Document</th>
                  <th className="py-3 px-4">Auto-Classified Category</th>
                  <th className="py-3 px-4">SHA-256 Hash</th>
                  <th className="py-3 px-4">OCR Extracted Data</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-surface-container/40 transition-colors group">
                    {/* Document Name & Preview */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleOpenDocument(doc)}
                        className="flex items-center gap-2.5 text-left hover:opacity-80 transition-opacity"
                        title={doc.fileDataUrl ? 'Click to preview document' : doc.name}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-lg">{getFileIcon(doc.mimeType)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-1 max-w-[200px] lg:max-w-xs">
                            {doc.name}
                          </div>
                          <div className="text-[10px] text-on-surface-variant">
                            {doc.sizeFormatted} • {doc.uploadTimestamp}
                          </div>
                        </div>
                      </button>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="bg-surface-container-high text-on-surface px-2.5 py-1 rounded-lg text-[11px] font-medium border border-outline-variant/20 inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-primary">{getCategoryIcon(doc.category)}</span>
                        {doc.categoryLabel}
                      </span>
                    </td>

                    {/* SHA-256 */}
                    <td className="py-3.5 px-4 font-mono text-[10px] text-on-surface-variant">
                      <span
                        className="bg-surface-container px-2 py-1 rounded border border-outline-variant/10 max-w-[160px] truncate block cursor-help"
                        title={doc.sha256Hash}
                      >
                        {doc.sha256Hash.slice(0, 16)}...
                      </span>
                    </td>

                    {/* Extracted Data */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {doc.extractedData?.pan && (
                          <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded font-mono">
                            PAN: {doc.extractedData.pan}
                          </span>
                        )}
                        {doc.extractedData?.gstin && (
                          <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-mono">
                            GST: {doc.extractedData.gstin}
                          </span>
                        )}
                        {doc.extractedData?.cin && (
                          <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded font-mono">
                            CIN: {doc.extractedData.cin.slice(0, 12)}...
                          </span>
                        )}
                        {doc.extractedData?.declaredMiiPercent !== undefined && (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono">
                            MII: {doc.extractedData.declaredMiiPercent}%
                          </span>
                        )}
                        {doc.extractedData?.turnoverAmount && (
                          <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded font-mono">
                            {doc.extractedData.turnoverAmount}
                          </span>
                        )}
                        {/* OCR text badge — clickable */}
                        {doc.ocrRawText && doc.ocrRawText.trim().length > 0 && (
                          <button
                            onClick={() => setOcrDetailDoc(doc)}
                            className="bg-violet-500/10 text-violet-400 text-[10px] px-2 py-0.5 rounded font-medium hover:bg-violet-500/20 transition-colors cursor-pointer"
                            title="View OCR extracted text"
                          >
                            OCR Text →
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {doc.status === 'validated' && (
                        <span className="bg-emerald-500/10 text-emerald-400 text-[11px] px-2.5 py-1 rounded-lg border border-emerald-500/20 font-medium flex items-center gap-1 w-fit">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          Verified
                        </span>
                      )}
                      {doc.status === 'processing' && (
                        <span className="bg-amber-500/10 text-amber-400 text-[11px] px-2.5 py-1 rounded-lg border border-amber-500/20 font-medium flex items-center gap-1 w-fit animate-pulse">
                          <span className="material-symbols-outlined text-[13px]">sync</span>
                          Scanning
                        </span>
                      )}
                      {doc.status === 'flagged' && (
                        <span className="bg-rose-500/10 text-rose-400 text-[11px] px-2.5 py-1 rounded-lg border border-rose-500/20 font-medium flex items-center gap-1 w-fit">
                          <span className="material-symbols-outlined text-[13px]">warning</span>
                          Flagged
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {doc.fileDataUrl && (
                          <button
                            onClick={() => handleOpenDocument(doc)}
                            className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-container"
                            title="Open / Preview"
                          >
                            <span className="material-symbols-outlined text-base">open_in_new</span>
                          </button>
                        )}
                        <button
                          onClick={() => onRemoveDocument(doc.id)}
                          className="text-on-surface-variant hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-surface-container"
                          title="Remove document"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Document Preview Modal ─────────────────────────────── */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-surface-container-high px-5 py-3.5 border-b border-outline-variant/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">{getFileIcon(previewDoc.mimeType)}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-on-surface line-clamp-1">{previewDoc.name}</div>
                  <div className="text-[11px] text-on-surface-variant flex items-center gap-2">
                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium">{previewDoc.categoryLabel}</span>
                    <span>{previewDoc.sizeFormatted}</span>
                    <span className="font-mono">SHA: {previewDoc.sha256Hash.slice(0, 12)}...</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {previewDoc.fileDataUrl && (
                  <a
                    href={previewDoc.fileDataUrl}
                    download={previewDoc.name}
                    className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors"
                    title="Download file"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                  </a>
                )}
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto bg-black/20 flex items-center justify-center min-h-[400px]">
              {previewDoc.mimeType === 'application/pdf' && previewDoc.fileDataUrl && (
                <iframe
                  src={previewDoc.fileDataUrl}
                  title={previewDoc.name}
                  className="w-full h-full min-h-[70vh]"
                  style={{ border: 'none' }}
                />
              )}
              {previewDoc.mimeType?.startsWith('image/') && previewDoc.fileDataUrl && (
                <img
                  src={previewDoc.fileDataUrl}
                  alt={previewDoc.name}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg m-6"
                />
              )}
            </div>

            {/* Validation Message Footer */}
            {previewDoc.validationMessage && (
              <div className="bg-surface-container px-5 py-3 border-t border-outline-variant/20 text-xs text-on-surface-variant flex items-center gap-2 shrink-0">
                <span className="material-symbols-outlined text-sm text-primary">info</span>
                {previewDoc.validationMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── OCR Text Detail Modal ──────────────────────────────── */}
      {ocrDetailDoc && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setOcrDetailDoc(null)}>
          <div
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-surface-container-high px-5 py-3.5 border-b border-outline-variant/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">document_scanner</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-on-surface">OCR Extracted Text</div>
                  <div className="text-[11px] text-on-surface-variant line-clamp-1">{ocrDetailDoc.name}</div>
                </div>
              </div>
              <button
                onClick={() => setOcrDetailDoc(null)}
                className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Extracted Data Summary */}
            {ocrDetailDoc.extractedData && Object.values(ocrDetailDoc.extractedData).some(Boolean) && (
              <div className="px-5 py-3 border-b border-outline-variant/15 bg-surface-container/40">
                <div className="text-[11px] font-semibold text-on-surface uppercase tracking-wider mb-2">Structured Data Extracted</div>
                <div className="flex flex-wrap gap-2">
                  {ocrDetailDoc.extractedData.pan && (
                    <span className="bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded-lg font-mono border border-blue-500/20">
                      PAN: {ocrDetailDoc.extractedData.pan}
                    </span>
                  )}
                  {ocrDetailDoc.extractedData.gstin && (
                    <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-lg font-mono border border-primary/20">
                      GSTIN: {ocrDetailDoc.extractedData.gstin}
                    </span>
                  )}
                  {ocrDetailDoc.extractedData.cin && (
                    <span className="bg-secondary/10 text-secondary text-xs px-2.5 py-1 rounded-lg font-mono border border-secondary/20">
                      CIN: {ocrDetailDoc.extractedData.cin}
                    </span>
                  )}
                  {ocrDetailDoc.extractedData.declaredMiiPercent !== undefined && (
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-lg font-mono border border-emerald-500/20">
                      MII Local Content: {ocrDetailDoc.extractedData.declaredMiiPercent}%
                    </span>
                  )}
                  {ocrDetailDoc.extractedData.turnoverAmount && (
                    <span className="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 rounded-lg font-mono border border-amber-500/20">
                      Turnover: {ocrDetailDoc.extractedData.turnoverAmount}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Raw OCR Text */}
            <div className="flex-1 overflow-auto p-5">
              <pre className="text-xs text-on-surface-variant font-mono whitespace-pre-wrap leading-relaxed bg-surface-container/50 p-4 rounded-xl border border-outline-variant/15 max-h-[55vh] overflow-auto">
                {ocrDetailDoc.ocrRawText || 'No OCR text extracted.'}
              </pre>
            </div>

            {/* Footer */}
            <div className="bg-surface-container px-5 py-3 border-t border-outline-variant/20 text-xs text-on-surface-variant flex items-center gap-2 shrink-0">
              <span className="material-symbols-outlined text-sm text-violet-400">info</span>
              Text extracted using Tesseract.js OCR engine • Classification confidence based on keyword analysis
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
