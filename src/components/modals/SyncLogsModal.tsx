import React, { useState } from 'react';
import { AuditLogEntry } from '../../types';

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

  if (!isOpen) return null;

  const handleCopyDigest = (digest: string, id: string) => {
    navigator.clipboard.writeText(digest);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-150">
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
              <div
                key={log.id}
                className="p-3 rounded-lg border border-outline-variant/30 hover:border-secondary transition-all bg-surface-container-lowest"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-code-num text-xs font-bold text-on-surface">{log.id}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-on-surface">
                      {log.portal}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'SUCCESS'
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : log.status === 'FLAG'
                          ? 'bg-error-container text-error'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                    <span>Latency: {log.latency}</span>
                    <span>•</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-on-surface font-medium mb-2">{log.action}</p>

                <div className="flex items-center justify-between bg-surface-container-low px-2.5 py-1.5 rounded text-[11px] font-code-num">
                  <span className="text-on-surface-variant truncate max-w-[500px]">
                    SHA-256: <span className="text-on-surface font-mono">{log.sha256Digest}</span>
                  </span>
                  <button
                    onClick={() => handleCopyDigest(log.sha256Digest, log.id)}
                    className="ml-2 text-secondary hover:underline flex items-center gap-1 flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedId === log.id ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedId === log.id ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
              </div>
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
