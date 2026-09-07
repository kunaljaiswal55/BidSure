import React from 'react';
import { Tender, Bidder, NavPath } from '../../types';

interface DashboardScreenProps {
  onNavigate: (path: NavPath) => void;
  activeTender: Tender;
  bidders: Bidder[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  activeTender,
  bidders
}) => {
  return (
    <div className="flex flex-col w-full pb-gutter-xl space-y-gutter-lg">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-gutter-md">
        <div>
          <div className="flex items-center gap-gutter-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">analytics</span>
            <span>GeM SPV Procurement Intelligence Dashboard</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Procurement Integrity & Compliance Center
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
            Real-time telemetry and algorithmic fraud screening across sovereign databases for Tender{' '}
            <span className="font-semibold text-on-surface">{activeTender.code}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('portal-verification')}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-sm font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">lan</span>
            <span>Open Multi-Portal Hub</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter-md">
        <div className="bg-surface-container-lowest p-gutter-md rounded-xl border border-outline-variant/20 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant text-xs font-semibold">
            <span>Enrolled Bidders</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">corporate_fare</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-on-surface">{bidders.length} Entities</div>
          <div className="mt-2 text-[11px] text-secondary font-medium">All authenticated on GeM</div>
        </div>

        <div className="bg-surface-container-lowest p-gutter-md rounded-xl border border-outline-variant/20 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant text-xs font-semibold">
            <span>Statutory Verification</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-on-surface">12 / 13 Portals</div>
          <div className="mt-2 text-[11px] text-secondary font-medium">92.3% sovereign sync complete</div>
        </div>

        <div className="bg-surface-container-lowest p-gutter-md rounded-xl border border-outline-variant/20 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant text-xs font-semibold">
            <span>Active Audit Flags</span>
            <span className="material-symbols-outlined text-error text-[20px]">warning</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-error">1 Discrepancy</div>
          <div className="mt-2 text-[11px] text-error font-medium">DPIIT MII 42% deficit flag</div>
        </div>

        <div className="bg-surface-container-lowest p-gutter-md rounded-xl border border-outline-variant/20 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant text-xs font-semibold">
            <span>Avg API Roundtrip</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">speed</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-on-surface font-code-num">164 ms</div>
          <div className="mt-2 text-[11px] text-secondary font-medium">NIC Gateway TLS 1.3</div>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-md">
        {/* Verification Funnel */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-gutter-md rounded-xl border border-outline-variant/20 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-title-lg text-on-surface font-bold">End-to-End Bid Verification Pipeline</h2>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
                Live Tender Stage
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-semibold text-on-surface">
                    <span>Sovereign Database Cross-Match (13 Portals)</span>
                    <span className="text-secondary font-bold">100% Passed</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-secondary h-full rounded-full w-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-semibold text-on-surface">
                    <span>Make In India Local Content Audit (PPP-MII 2017)</span>
                    <span className="text-error font-bold">1 Flag Detected</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-error h-full rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-semibold text-on-surface">
                    <span>AI Forensic Document Inspection & UDIN Match</span>
                    <span className="text-secondary font-bold">Clean</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-secondary h-full rounded-full w-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-semibold text-on-surface">
                    <span>Commercial Reverse Auction Readiness</span>
                    <span className="text-on-surface-variant font-bold">Pending Clearance</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-surface-tint h-full rounded-full w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              Tender Est. Value: <strong className="text-on-surface">{activeTender.estimatedValue}</strong>
            </span>
            <button
              onClick={() => onNavigate('compliance-checks')}
              className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
            >
              <span>View Statutory Checklist</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* High Priority Alerts */}
        <div className="bg-surface-container-lowest p-gutter-md rounded-xl border border-outline-variant/20 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-title-lg text-on-surface font-bold">Officer Priority Flags</h2>
              <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-error-container/40 border border-error/30">
                <div className="flex items-center justify-between font-bold text-error mb-1">
                  <span>DPIIT MII Discrepancy</span>
                  <span>Rule 153</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  Apex Tech Solutions declared 42% local content vs required 50%. Rule 153 notice required.
                </p>
                <button
                  onClick={() => onNavigate('portal-verification')}
                  className="mt-2 text-[11px] text-error font-bold hover:underline"
                >
                  Review in Portal Hub &rarr;
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30">
                <div className="flex items-center justify-between font-bold text-on-surface mb-1">
                  <span>DigiLocker Cryptographic Match</span>
                  <span className="text-secondary">8/8 Valid</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  All certificates verified against Ministry root certificates with zero alteration.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('audit-trail')}
            className="w-full mt-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold text-on-surface text-center transition-colors"
          >
            Open Cryptographic Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
