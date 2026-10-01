import React, { useState } from 'react';
import { Bidder, Tender, PortalData, ClientDocument, NavPath } from '../../types';

interface ClientReportScreenProps {
  clientBidder: Bidder;
  activeTender: Tender;
  portals: Record<string, PortalData>;
  documents: ClientDocument[];
  onNavigate: (path: NavPath) => void;
}

export const ClientReportScreen: React.FC<ClientReportScreenProps> = ({
  clientBidder,
  activeTender,
  portals,
  documents,
  onNavigate,
}) => {
  const [downloadingCert, setDownloadingCert] = useState(false);
  const [certDownloaded, setCertDownloaded] = useState(false);

  const portalList = Object.values(portals) as PortalData[];
  const miiCompliant = clientBidder.miiPercentage >= activeTender.miiRequiredPercent;
  const verifiedPortalsCount = portalList.filter((p) => p.status === 'connected').length;

  const handleDownloadCertificate = () => {
    setDownloadingCert(true);
    setTimeout(() => {
      setDownloadingCert(false);
      setCertDownloaded(true);
      setTimeout(() => setCertDownloaded(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-8 py-4 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Processed Verification Report
            </span>
            <span className="text-xs text-on-surface-variant font-mono">Tender: {activeTender.code}</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface mt-1">Client Pre-Qualification & Verification Report</h1>
          <p className="text-sm text-on-surface-variant">
            Official BidSure AI evaluation breakdown, statutory portal cross-verifications, and compliance scorecard.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadCertificate}
            disabled={downloadingCert}
            className="bg-primary hover:bg-primary/90 text-on-primary font-medium text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-primary/10 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {downloadingCert ? 'sync' : certDownloaded ? 'task_alt' : 'workspace_premium'}
            </span>
            {downloadingCert ? 'Generating Certificate...' : certDownloaded ? 'Certificate Downloaded!' : 'Download Audit Certificate'}
          </button>
        </div>
      </div>

      {/* Main Scorecard Overview */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Score Badge */}
          <div className="lg:col-span-4 bg-gradient-to-br from-surface-container to-surface-container-high p-6 rounded-2xl border border-outline-variant/20 text-center flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-4 border-emerald-500/30 flex flex-col items-center justify-center text-emerald-400 mb-3 shadow-inner">
              <span className="text-3xl font-black font-mono">94</span>
              <span className="text-[10px] font-semibold uppercase text-emerald-400/80 -mt-1">/ 100</span>
            </div>
            <div className="text-lg font-bold text-on-surface">PRE-QUALIFIED</div>
            <div className="text-xs text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Automated Verification Status: PASSED
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-outline-variant/15">
              <div>
                <span className="text-xs text-on-surface-variant font-medium">Bidding Entity</span>
                <div className="text-base font-bold text-on-surface">{clientBidder.name}</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-on-surface-variant font-medium">Evaluation Timestamp</span>
                <div className="text-xs font-mono text-on-surface">2026-09-24 13:20 IST</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-on-surface-variant">GeM Seller Status</span>
                <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  Active Tier-1
                </div>
              </div>

              <div>
                <span className="text-xs text-on-surface-variant">Statutory Portals Verified</span>
                <div className="text-sm font-semibold text-on-surface mt-0.5 font-mono">
                  {verifiedPortalsCount} / {portalList.length} Connected
                </div>
              </div>

              <div>
                <span className="text-xs text-on-surface-variant">MII Local Content</span>
                <div className={`text-sm font-semibold flex items-center gap-1 mt-0.5 ${miiCompliant ? 'text-emerald-400' : 'text-amber-400'}`}>
                  <span className="material-symbols-outlined text-base">{miiCompliant ? 'flag' : 'warning'}</span>
                  {clientBidder.miiPercentage}% (Min {activeTender.miiRequiredPercent}%)
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/15 text-xs text-on-surface-variant flex items-center justify-between">
              <span>All 5 uploaded compliance documents match cryptographic SHA-256 hashes against Government API registries.</span>
              <button
                onClick={() => onNavigate('client-upload')}
                className="text-primary font-medium hover:underline shrink-0 ml-2"
              >
                Manage Files
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Portal Verification Grid */}
      <div>
        <h2 className="text-lg font-semibold text-on-surface mb-3">Statutory Portal Verification Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portalList.map((portal) => (
            <div
              key={portal.id}
              className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 hover:border-outline-variant/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      <span className="material-symbols-outlined text-lg">{portal.iconName || 'public'}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-on-surface">{portal.shortName}</div>
                      <div className="text-[10px] text-on-surface-variant truncate max-w-[150px]">{portal.agency}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border ${
                      portal.status === 'connected'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {portal.statusLabel}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant line-clamp-2">{portal.statusDetail}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
                <span>Latency: {portal.responseTime}</span>
                <span>Verified: {portal.timestamp.slice(0, 11)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discrepancy & Appeal Callout */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-2xl">gavel</span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-on-surface">Have a query or notice a verification mismatch?</h3>
            <p className="text-xs text-on-surface-variant max-w-2xl mt-0.5">
              If any of your portal checks show a temporary audit flag or you need to appeal a document verification result, you can file a formal complaint or query with the procurement evaluation committee.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('client-queries')}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/10 shrink-0 self-start md:self-auto"
        >
          Submit Query / Appeal
        </button>
      </div>
    </div>
  );
};
