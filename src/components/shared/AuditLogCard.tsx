import React from 'react';
import { AuditLogEntry } from '../../types';

interface Props {
  log: AuditLogEntry;
  copiedId: string | null;
  onCopy: (digest: string, id: string) => void;
  compact?: boolean;
}

export const AuditLogCard: React.FC<Props> = ({ log, copiedId, onCopy, compact }) => {
  const isSuccess = log.status === 'SUCCESS';
  const isFlag = log.status === 'FLAG';
  return (
    <div className="p-3 rounded-lg border border-outline-variant/30 hover:border-secondary transition-all bg-surface-container-lowest">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <span className="font-code-num text-xs font-bold text-on-surface">{log.id}</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-on-surface">
            {log.portal}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isSuccess
                ? 'bg-secondary-fixed text-on-secondary-fixed'
                : isFlag
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
        <span className={`text-on-surface-variant truncate ${compact ? 'max-w-[420px]' : 'max-w-[560px]'}`}>
          SHA-256: <span className="text-on-surface font-mono break-all">{log.sha256Digest}</span>
        </span>
        <button
          onClick={() => onCopy(log.sha256Digest, log.id)}
          className="ml-2 text-secondary hover:underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
          type="button"
          aria-label={`Copy hash ${log.id}`}
        >
          <span className="material-symbols-outlined text-[14px]">{copiedId === log.id ? 'check' : 'content_copy'}</span>
          <span>{copiedId === log.id ? 'Copied' : compact ? 'Copy Hash' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
