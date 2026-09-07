import React from 'react';
import { Bidder, Tender, NavPath } from '../../types';

interface BidComparisonScreenProps {
  bidders: Bidder[];
  activeTender: Tender;
  onNavigate: (path: NavPath) => void;
}

export const BidComparisonScreen: React.FC<BidComparisonScreenProps> = ({
  bidders,
  activeTender,
  onNavigate
}) => {
  return (
    <div className="flex flex-col w-full pb-gutter-xl space-y-gutter-lg">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-gutter-md">
        <div>
          <div className="flex items-center gap-gutter-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
            <span>Comparative Evaluation Matrix</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Bidder Statutory Cross-Comparison
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
            Side-by-side compliance, turnover viability, and local content qualification for Tender{' '}
            <span className="font-semibold text-on-surface">{activeTender.code}</span>.
          </p>
        </div>

        <button
          onClick={() => onNavigate('portal-verification')}
          className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">lan</span>
          <span>Open Multi-Portal Hub</span>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Evaluation Metric</th>
                {bidders.map((b) => (
                  <th key={b.id} className="py-3 px-4 min-w-[200px]">
                    <div className="font-bold text-on-surface text-xs normal-case">{b.name}</div>
                    <div className="font-code-num text-[10px] text-on-surface-variant">{b.cin}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              <tr>
                <td className="py-3 px-4 font-semibold text-on-surface">Make in India Local Content</td>
                {bidders.map((b) => (
                  <td key={b.id} className="py-3 px-4">
                    <span
                      className={`font-bold ${
                        b.miiPercentage < activeTender.miiRequiredPercent ? 'text-error' : 'text-secondary'
                      }`}
                    >
                      {b.miiPercentage}%
                    </span>
                    <span className="text-[10px] text-on-surface-variant block">
                      {b.miiPercentage >= activeTender.miiRequiredPercent
                        ? 'Class-I Qualified'
                        : 'Class-II Disqualified'}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-on-surface">MSME / Udyam Category</td>
                {bidders.map((b) => (
                  <td key={b.id} className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold text-[11px]">
                      {b.msmeCategory}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-on-surface">3-Year Audited Turnover</td>
                {bidders.map((b) => (
                  <td key={b.id} className="py-3 px-4 font-code-num font-bold text-on-surface">
                    {b.annualTurnover}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-on-surface">GSTN 36-Month Filing Status</td>
                {bidders.map((b) => (
                  <td key={b.id} className="py-3 px-4 text-secondary font-semibold">
                    100% Compliant (Zero Default)
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-on-surface">EPFO Active Remittance</td>
                {bidders.map((b) => (
                  <td key={b.id} className="py-3 px-4">
                    Active Electronic Challan
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-on-surface">Overall Statutory Status</td>
                {bidders.map((b) => (
                  <td key={b.id} className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        b.status === 'Verified'
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : 'bg-error-container text-error'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
