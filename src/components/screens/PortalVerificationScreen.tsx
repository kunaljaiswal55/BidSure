import React, { useState, useCallback } from 'react';
import { PortalData, Bidder, Tender, AuditLogEntry } from '../../types';
import { SyncLogsModal } from '../modals/SyncLogsModal';
import { DpiitAuditModal } from '../modals/DpiitAuditModal';
import { Toast, ToastData } from '../shared/Toast';

// Priority order for the 6 primary portals
const PRIMARY_ORDER = ['gem', 'gstn', 'udyam', 'incometax', 'pan', 'mca'];

interface PortalVerificationScreenProps {
  portals: Record<string, PortalData>;
  selectedBidder: Bidder;
  activeTender: Tender;
  auditLogs: AuditLogEntry[];
  onReverifyPortal: (portalId: string) => void;
  onVerifyAll: () => void;
  isVerifyingAll: boolean;
  verifyingPortals: Record<string, boolean>;
  onBidderChange: (bidder: Bidder) => void;
  allBidders: Bidder[];
}

type PortalStatus = 'verified' | 'attention' | 'pending';

function getPortalStatus(p: PortalData): PortalStatus {
  if (p.status === 'audit_flag') return 'attention';
  if (p.status === 'exempted' || p.status === 'disconnected') return 'pending';
  return 'verified';
}

function StatusBadge({ status }: { status: PortalStatus }) {
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 text-secondary font-semibold text-[13px]">
        <span className="material-symbols-outlined text-[16px]">check_circle</span>
        Verified
      </span>
    );
  }
  if (status === 'attention') {
    return (
      <span className="inline-flex items-center gap-1 text-error font-semibold text-[13px]">
        <span className="material-symbols-outlined text-[16px]">warning</span>
        Attention
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-on-surface-variant font-semibold text-[13px]">
      <span className="material-symbols-outlined text-[16px]">remove</span>
      Not Verified
    </span>
  );
}

export const PortalVerificationScreen: React.FC<PortalVerificationScreenProps> = ({
  portals,
  selectedBidder,
  activeTender,
  auditLogs,
  onReverifyPortal,
  onVerifyAll,
  isVerifyingAll,
  verifyingPortals,
  onBidderChange,
  allBidders,
}) => {
  const [toastMessage, setToastMessage] = useState<ToastData | null>(null);
  const [isSyncLogsOpen, setIsSyncLogsOpen] = useState(false);
  const [isDpiitAuditOpen, setIsDpiitAuditOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [vendorDetailsOpen, setVendorDetailsOpen] = useState(false);
  const [detailsPortalId, setDetailsPortalId] = useState<string | null>(null);

  const triggerToast = useCallback((title: string, desc: string, icon = 'check_circle') => {
    setToastMessage({ title, desc, icon });
  }, []);

  const handleExportAuditBundle = () => {
    const bundle = {
      app: 'BidSure AI - SIH 26100',
      exportedAt: new Date().toISOString(),
      officer: 'R. Sharma (JS-Proc.)',
      bidder: selectedBidder,
      tender: activeTender,
      portalsVerified: portals,
      cryptographicSignatures: auditLogs,
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bidsure-sih26100-audit-bundle-${selectedBidder.cin}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Bundle Downloaded', 'Exported verification bundle.', 'receipt_long');
  };

  const handleReverify = (portalId: string) => {
    onReverifyPortal(portalId);
    triggerToast('Verification queued', `${portals[portalId]?.shortName || portalId} re-check started.`, 'sync');
  };

  // Derived portal lists
  const allPortals = Object.values(portals) as PortalData[];
  const sortedPortals = [...allPortals].sort((a, b) => {
    const ai = PRIMARY_ORDER.indexOf(a.id);
    const bi = PRIMARY_ORDER.indexOf(b.id);
    const av = ai === -1 ? 999 : ai;
    const bv = bi === -1 ? 999 : bi;
    return av - bv;
  });
  const visiblePortals = showAll ? sortedPortals : sortedPortals.slice(0, 6);
  const hiddenCount = sortedPortals.length - 6;

  const verifiedCount = allPortals.filter((p) => getPortalStatus(p) === 'verified').length;
  const issuesCount = allPortals.filter((p) => getPortalStatus(p) === 'attention').length;
  const pendingCount = allPortals.filter((p) => getPortalStatus(p) === 'pending').length;

  const detailsPortal = detailsPortalId ? portals[detailsPortalId] : null;
  const detailsStatus = detailsPortal ? getPortalStatus(detailsPortal) : null;

  return (
    <div className="flex flex-col w-full pb-10 max-w-full">
      {/* 1. Subtle environment indicator */}
      <div className="flex justify-end mb-3">
        <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px] tracking-wide border border-outline-variant/20">
          SIH Demo Environment
        </span>
      </div>

      {/* 2. Simplified page header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Government Multi-Portal Verification Hub
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 max-w-2xl">
            Verify vendor eligibility across government portals.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSyncLogsOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-lowest hover:bg-surface-container rounded-full text-on-surface font-medium text-sm border border-outline-variant/30 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">sync</span>
            Sync
          </button>
          <button
            onClick={() => {
              onVerifyAll();
              triggerToast('Verifying', 'Checking all portals…', 'sync');
            }}
            disabled={isVerifyingAll}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary/90 text-on-primary rounded-full font-semibold text-sm shadow-sm disabled:opacity-60 transition-colors"
            type="button"
          >
            <span className={`material-symbols-outlined text-[16px] ${isVerifyingAll ? 'animate-spin' : ''}`}>verified</span>
            {isVerifyingAll ? 'Verifying…' : 'Verify All'}
          </button>
        </div>
      </div>

      {/* 3. Reduced summary cards – 3 quiet compact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 px-5 py-4 flex flex-col">
          <span className="font-label-sm text-[11px] tracking-widest uppercase text-on-surface-variant font-semibold">Verified</span>
          <span className="font-headline-lg text-on-surface font-bold mt-1">
            {verifiedCount} <span className="text-on-surface-variant font-normal text-[15px]">/ {allPortals.length}</span>
          </span>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 px-5 py-4 flex flex-col">
          <span className="font-label-sm text-[11px] tracking-widest uppercase text-on-surface-variant font-semibold">Issues</span>
          <span className={`font-headline-lg font-bold mt-1 ${issuesCount > 0 ? 'text-error' : 'text-on-surface'}`}>{issuesCount}</span>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 px-5 py-4 flex flex-col">
          <span className="font-label-sm text-[11px] tracking-widest uppercase text-on-surface-variant font-semibold">Pending</span>
          <span className="font-headline-lg text-on-surface font-bold mt-1">{pendingCount}</span>
        </div>
      </div>

      {/* 4. Simplified vendor section */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 px-5 py-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[22px]">apartment</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  aria-label="Active Bidder Selection"
                  value={selectedBidder.id}
                  onChange={(e) => {
                    const found = allBidders.find((b) => b.id === e.target.value);
                    if (found) onBidderChange(found);
                  }}
                  className="font-title-lg text-on-surface font-bold bg-transparent border-none focus:ring-0 cursor-pointer p-0 pr-6 truncate max-w-[260px] sm:max-w-[360px]"
                >
                  {allBidders.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                {selectedBidder.status === 'Audit Flag' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-error text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                    Needs attention
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                <span className="text-on-surface-variant">
                  PAN <span className="font-code-num text-on-surface font-medium">{selectedBidder.pan}</span>
                </span>
                <span className="text-on-surface-variant">
                  GSTIN <span className="font-code-num text-on-surface font-medium">{selectedBidder.gstin}</span>
                </span>
                <span className="text-on-surface-variant">
                  GeM <span className="font-code-num text-on-surface font-medium">{selectedBidder.gemSellerId}</span>
                </span>
              </div>
              {vendorDetailsOpen && (
                <div className="mt-3 pt-3 border-t border-outline-variant/15 flex flex-wrap gap-x-4 gap-y-1 text-sm text-on-surface-variant animate-in fade-in">
                  <span>
                    CIN <span className="font-code-num text-on-surface font-medium">{selectedBidder.cin}</span>
                  </span>
                  <span>
                    Tender <span className="font-code-num text-on-surface font-medium">{activeTender.code}</span>
                  </span>
                  <span>
                    MII <span className="font-code-num text-on-surface font-medium">{selectedBidder.miiPercentage}%</span>
                  </span>
                  <span>
                    MSME <span className="text-on-surface font-medium">{selectedBidder.msmeCategory}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setVendorDetailsOpen((v) => !v)}
            className="text-secondary text-sm font-medium hover:underline shrink-0 self-start sm:self-center"
            type="button"
          >
            {vendorDetailsOpen ? 'Hide details' : 'View details'}
          </button>
        </div>
      </div>

      {/* 5. Portal cards – calm, spacious, status as primary */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="portal-cards-container">
        {visiblePortals.map((portal) => {
          const status = getPortalStatus(portal);
          const isVerifying = verifyingPortals[portal.id] || isVerifyingAll;
          return (
            <div
              key={portal.id}
              data-portal-id={portal.id}
              className={`portal-card bg-surface-container-lowest rounded-xl border p-5 flex flex-col gap-3 transition-shadow hover:shadow-sm ${
                status === 'attention' ? 'border-error/25' : 'border-outline-variant/20'
              } ${isVerifying ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start justify-between">
                <span className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">{portal.iconName}</span>
                </span>
                {isVerifying && <span className="material-symbols-outlined text-[16px] animate-spin text-on-surface-variant">progress_activity</span>}
              </div>
              <div>
                <h3 className="font-title-md text-on-surface font-semibold leading-tight">{portal.shortName}</h3>
                <div className="mt-1">
                  <StatusBadge status={status} />
                </div>
                <p className="text-sm text-on-surface-variant mt-2 leading-snug line-clamp-2">{portal.statusDetail}</p>
              </div>
              <button
                onClick={() => setDetailsPortalId(portal.id)}
                className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-secondary hover:text-secondary/80 self-start"
                type="button"
              >
                View details <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* 7. Expand remaining portals */}
      {!showAll && hiddenCount > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="px-4 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            + {hiddenCount} more portals
          </button>
        </div>
      )}
      {showAll && hiddenCount > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(false)}
            className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-low text-sm font-medium text-on-surface-variant transition-colors"
            type="button"
          >
            Show less
          </button>
        </div>
      )}

      <Toast toast={toastMessage} onDismiss={() => setToastMessage(null)} />

      {/* Details drawer */}
      {detailsPortal && detailsStatus && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <div className="flex-1 bg-black/40" onClick={() => setDetailsPortalId(null)} />
          <div className="w-full max-w-[560px] bg-surface-container-lowest h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="px-5 py-4 border-b border-outline-variant/20 flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                  <span className="material-symbols-outlined text-[22px]">{detailsPortal.iconName}</span>
                </span>
                <div>
                  <h2 className="font-title-lg text-on-surface font-bold leading-tight">{detailsPortal.name}</h2>
                  <p className="text-xs text-on-surface-variant">{detailsPortal.agency}</p>
                  <div className="mt-2">
                    <StatusBadge status={detailsStatus} />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDetailsPortalId(null)}
                className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant"
                aria-label="Close"
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              <div className="rounded-lg bg-surface-container-low p-3.5">
                <p className="text-sm text-on-surface leading-relaxed">{detailsPortal.statusDetail}</p>
                {detailsStatus === 'attention' && (
                  <button
                    onClick={() => {
                      setDetailsPortalId(null);
                      setIsDpiitAuditOpen(true);
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-error text-on-error rounded-full text-xs font-semibold hover:bg-error/90"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[14px]">policy</span> View audit
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleReverify(detailsPortal.id)}
                  disabled={verifyingPortals[detailsPortal.id] || isVerifyingAll}
                  className="flex-1 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-medium border border-outline-variant/30 disabled:opacity-60"
                  type="button"
                >
                  {verifyingPortals[detailsPortal.id] ? 'Verifying…' : 'Verify again'}
                </button>
                <button
                  onClick={() => setDetailsPortalId(null)}
                  className="px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90"
                  type="button"
                >
                  Done
                </button>
              </div>

              <details className="rounded-xl border border-outline-variant/20 overflow-hidden group">
                <summary className="list-none px-4 py-3 flex items-center justify-between cursor-pointer bg-surface-container-low/50 hover:bg-surface-container-low">
                  <span className="text-sm font-semibold text-on-surface">Technical details</span>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-4 py-3 space-y-3 bg-surface-container-lowest text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-on-surface-variant block">Endpoint</span>
                      <span className="font-code-num text-on-surface break-all">{detailsPortal.endpoint}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Response time</span>
                      <span className="font-code-num text-on-surface">{detailsPortal.responseTime}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Last checked</span>
                      <span className="font-code-num text-on-surface">{detailsPortal.timestamp}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Category</span>
                      <span className="text-on-surface capitalize">{detailsPortal.category}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-outline-variant/15">
                    <div className="text-on-surface-variant mb-1">Payload (truncated)</div>
                    <pre className="font-code-num text-[11px] bg-surface-container p-3 rounded-lg overflow-x-auto max-h-[220px]">
                      {JSON.stringify({ req: detailsPortal.req, res: detailsPortal.res }, null, 2).slice(0, 4000)}
                    </pre>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* Modals – health check no longer in primary header */}
      <SyncLogsModal
        isOpen={isSyncLogsOpen}
        onClose={() => setIsSyncLogsOpen(false)}
        logs={auditLogs}
        onExport={handleExportAuditBundle}
      />

      <DpiitAuditModal
        isOpen={isDpiitAuditOpen}
        onClose={() => setIsDpiitAuditOpen(false)}
        bidder={selectedBidder}
        tender={activeTender}
        onIssueNotice={() => triggerToast('Statutory Notice Dispatched', `Rule 153 Notice sent to ${selectedBidder.name}.`, 'send')}
      />
    </div>
  );
};
