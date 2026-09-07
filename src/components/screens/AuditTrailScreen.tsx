import React, { useState } from 'react';
import { AuditLogEntry, NavPath } from '../../types';

interface AuditTrailScreenProps {
  logs: AuditLogEntry[];
  onNavigate: (path: NavPath) => void;
}

export const AuditTrailScreen: React.FC<AuditTrailScreenProps> = ({ logs, onNavigate }) => {
  const [filter, setFilter] = useState<'ALL' | 'SUCCESS' | 'FLAG'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = logs.filter((l) => (filter === 'ALL' ? true : l.status === filter));

  const handleCopy = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-gutter-xl space-y-gutter-lg">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-gutter-md">
        <div>
          <div className="flex items-center gap-gutter-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">history_edu</span>
            <span>Immutable CVC & CAG Audit Trail</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Cryptographic Transaction Log
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
            Append-only sovereign database API queries, digital signatures, and clearance decisions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(['ALL', 'SUCCESS', 'FLAG'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === t
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/30'
              }`}
            >
              {t === 'ALL' ? 'All Transactions' : t === 'SUCCESS' ? 'Verified (200 OK)' : 'Audit Flags'}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Entries */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-gutter-md shadow-xs space-y-3">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="p-3 rounded-lg border border-outline-variant/20 hover:border-secondary transition-all bg-surface-container-lowest"
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
                      : 'bg-error-container text-error'
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
              <span className="text-on-surface-variant truncate max-w-[560px]">
                SHA-256: <span className="text-on-surface font-mono">{log.sha256Digest}</span>
              </span>
              <button
                onClick={() => handleCopy(log.sha256Digest, log.id)}
                className="ml-2 text-secondary hover:underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedId === log.id ? 'check' : 'content_copy'}
                </span>
                <span>{copiedId === log.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
