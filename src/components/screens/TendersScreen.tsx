import React, { useState } from 'react';
import { Tender, NavPath } from '../../types';

interface TendersScreenProps {
  tenders: Tender[];
  activeTender: Tender;
  onSelectTender: (tender: Tender) => void;
  onNavigate: (path: NavPath) => void;
}

export const TendersScreen: React.FC<TendersScreenProps> = ({
  tenders,
  activeTender,
  onSelectTender,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = tenders.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full pb-gutter-xl space-y-gutter-lg">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-gutter-md">
        <div>
          <div className="flex items-center gap-gutter-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>GeM Tender Management Register</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Public Procurement Tenders
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
            Statutory criteria, Make in India local content thresholds, and MSME exemption parameters for active tenders.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search tender code, ministry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs font-medium text-on-surface focus:outline-none focus:border-secondary w-64"
            />
          </div>
        </div>
      </div>

      {/* Tender Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter-md">
        {filtered.map((tender) => {
          const isCurrent = tender.id === activeTender.id;
          return (
            <div
              key={tender.id}
              className={`p-gutter-md rounded-xl border transition-all flex flex-col justify-between shadow-xs ${
                isCurrent
                  ? 'bg-surface-container-lowest border-secondary ring-1 ring-secondary/40'
                  : 'bg-surface-container-lowest border-outline-variant/20 hover:border-outline-variant/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded font-code-num text-xs font-bold bg-secondary-fixed text-on-secondary-fixed">
                    {tender.code}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tender.status === 'Active'
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {tender.status}
                  </span>
                </div>

                <h3 className="font-title-md text-on-surface font-bold text-sm mb-1 line-clamp-2">
                  {tender.title}
                </h3>
                <p className="text-xs text-on-surface-variant mb-3">{tender.department}</p>

                <div className="p-2.5 bg-surface-container-low rounded-lg space-y-1.5 text-xs mb-3">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Est. Procurement Value:</span>
                    <span className="font-bold text-on-surface font-code-num">{tender.estimatedValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Make In India (MII) Mandate:</span>
                    <span className="font-bold text-secondary">{tender.miiRequiredPercent}% Minimum</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">MSME Exemption:</span>
                    <span className="font-medium text-on-surface">
                      {tender.msmeExemptionAllowed ? 'Permitted' : 'Not Applicable'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Bidders Enrolled:</span>
                    <span className="font-bold text-on-surface">{tender.biddersCount} Vendors</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between gap-2">
                <span className="text-[11px] text-on-surface-variant font-code-num">
                  Closing: {tender.closingDate}
                </span>
                <button
                  onClick={() => {
                    onSelectTender(tender);
                    onNavigate('portal-verification');
                  }}
                  className="px-3 py-1.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Audit Bidders</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
