import React from 'react';
import { Bidder, Tender, NavPath } from '../../types';

interface RiskAnalysisScreenProps {
  bidders: Bidder[];
  activeTender: Tender;
  onNavigate: (path: NavPath) => void;
}

export const RiskAnalysisScreen: React.FC<RiskAnalysisScreenProps> = ({
  bidders,
  activeTender,
  onNavigate
}) => {
  return (
    <div className="flex flex-col w-full pb-gutter-xl space-y-gutter-lg">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-gutter-md">
        <div>
          <div className="flex items-center gap-gutter-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">shield</span>
            <span>Automated Procurement Fraud Risk Engine</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Vendor Risk & Shell Entity Scoring
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
            Multi-dimensional fraud index, directorship nexus graph, and tax mismatch telemetry for Tender{' '}
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

      {/* Risk Comparison Bars */}
      <div className="bg-surface-container-lowest p-gutter-md rounded-xl border border-outline-variant/30 shadow-xs">
        <h2 className="font-title-lg text-on-surface font-bold mb-4">
          Composite Fraud Risk Matrix across Enrolled Bidders
        </h2>
        <div className="space-y-4">
          {bidders.map((b) => (
            <div key={b.id} className="p-3 bg-surface-container-low rounded-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5">
                <div className="font-bold text-on-surface flex items-center gap-2">
                  <span>{b.name}</span>
                  <span className="font-code-num text-on-surface-variant text-[11px] font-normal">
                    (CIN: {b.cin})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-on-surface-variant">Risk Score:</span>
                  <span
                    className={`font-code-num font-bold text-sm ${
                      b.riskScore > 40 ? 'text-error' : b.riskScore > 20 ? 'text-secondary' : 'text-secondary'
                    }`}
                  >
                    {b.riskScore} / 100
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.riskScore > 40
                        ? 'bg-error-container text-error'
                        : b.riskScore > 20
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-secondary-fixed text-on-secondary-fixed'
                    }`}
                  >
                    {b.riskScore > 40 ? 'Elevated Risk' : b.riskScore > 20 ? 'Moderate Flag' : 'Low Risk'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    b.riskScore > 40 ? 'bg-error' : 'bg-secondary'
                  }`}
                  style={{ width: `${Math.max(b.riskScore, 6)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-on-surface-variant mt-1.5">
                <span>MII Content: {b.miiPercentage}%</span>
                <span>Annual Turnover: {b.annualTurnover}</span>
                <span>Classification: {b.msmeCategory}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
