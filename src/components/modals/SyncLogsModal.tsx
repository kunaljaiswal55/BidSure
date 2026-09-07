import React, { useState } from 'react';
import { AuditLogEntry } from '../../types';
import { AuditLogCard } from '../shared/AuditLogCard';
import { useEscape, useLockBodyScroll } from '../../hooks/useEscape';

interface SyncLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
  onExport: () => void;
}

export const SyncLogsModal: React.FC<SyncLogsModalProps> = ({
  isOpen,
  onClose,
  logs,
  onExport
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  useEscape(isOpen, onClose);
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const handleCopyDigest = (digest: string, id: string) => {
    navigator.clipboard.writeText(digest);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Gateway audit & sync logs"
    >
      <div
        className="bg-surface-container-lowest rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-gutter-md border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-secondary-fixed text-on-secondary-fixed rounded-lg">
              <span className="material-symbols-outlined text-[20px]">manage_search</span>
            </span>
            <div>
              <h2 className="font-title-lg text-on-surface font-bold">Statutory Gateway Audit & Sync Logs</h2>
              <p className="font-body-sm text-on-surface-variant">
                Cryptographic transaction trail with SHA-256 digital signature hashes for CVC compliance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Logs table */}
        <div className="p-gutter-md overflow-y-auto flex-1">
          <div className="space-y-3">
            {logs.map((log) => (
              <AuditLogCard key={log.id} log={log} copiedId={copiedId} onCopy={handleCopyDigest} compact />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-gutter-md border-t border-outline-variant/20 bg-surface-container-low/30 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">
            Officer Clearance: <span className="font-semibold text-on-surface">R. Sharma (JS-Proc.)</span> · GeM SPV Trust Domain
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container text-xs font-semibold text-on-surface"
            >
              Close
            </button>
            <button
              onClick={onExport}
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export Signed Audit Bundle (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
