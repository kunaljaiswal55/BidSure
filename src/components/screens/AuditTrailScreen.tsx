import React, { useState } from 'react';
import { AuditLogEntry, NavPath } from '../../types';
import { AuditLogCard } from '../shared/AuditLogCard';

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
        {filteredLogs.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-8">No entries for this filter.</p>
        ) : (
          filteredLogs.map((log) => (
            <AuditLogCard key={log.id} log={log} copiedId={copiedId} onCopy={handleCopy} />
          ))
        )}
      </div>
    </div>
  );
};
