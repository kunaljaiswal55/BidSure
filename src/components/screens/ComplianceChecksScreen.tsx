import React from 'react';
import { Bidder, Tender, NavPath } from '../../types';

interface ComplianceChecksScreenProps {
  selectedBidder: Bidder;
  activeTender: Tender;
  onNavigate: (path: NavPath) => void;
}

export const ComplianceChecksScreen: React.FC<ComplianceChecksScreenProps> = ({
  selectedBidder,
  activeTender,
  onNavigate
}) => {
  const checks = [
    {
      id: 'MII-2017',
      rule: 'Public Procurement (Preference to Make in India) Order 2017',
      status: selectedBidder.miiPercentage >= activeTender.miiRequiredPercent ? 'PASSED' : 'DISCREPANCY',
      detail: `Bidder declared ${selectedBidder.miiPercentage}% domestic content vs tender minimum ${activeTender.miiRequiredPercent}%.`,
      flag: selectedBidder.miiPercentage < activeTender.miiRequiredPercent
    },
    {
      id: 'RULE-144',
      rule: 'GFR Rule 144(xi) - Land Border Sharing Clearance',
      status: 'PASSED',
      detail: 'Zero beneficial ownership from countries sharing land borders with India. Ministry of Home Affairs clearance active.',
      flag: false
    },
    {
      id: 'CVC-DEBAR',
      rule: 'Central Vigilance Commission (CVC) & GeM Debarment Watchlist',
      status: 'PASSED',
      detail: 'No debarment orders registered across Central Ministries, State Govts, or Public Sector Undertakings.',
      flag: false
    },
    {
      id: 'MSME-ACT',
      rule: 'Micro, Small and Medium Enterprises Development (MSMED) Act 2006',
      status: 'VERIFIED',
      detail: `Verified valid Udyam Registration with Medium enterprise threshold. Turnover Rs. 42.8 Cr conforms to MSME criteria.`,
      flag: false
    },
    {
      id: 'IT-206AB',
      rule: 'Section 206AB / 206CCA Income Tax Compliance (Higher TDS Exemption)',
      status: 'PASSED',
      detail: 'ITR-6 filed for Assessment Years 2024-25 and 2025-26. Not a specified non-filer.',
      flag: false
    },
    {
      id: 'LABOR-CODE',
      rule: 'Social Security Remittances (EPFO / ESIC Regularity)',
      status: 'PASSED',
      detail: 'Zero default notices. Active monthly ECR remittances verified for 142 enrolled employees.',
      flag: false
    }
  ];

  return (
    <div className="flex flex-col w-full pb-gutter-xl space-y-gutter-lg">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-gutter-md">
        <div>
          <div className="flex items-center gap-gutter-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">fact_check</span>
            <span>Statutory Rules Compliance Matrix</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Mandate & Regulatory Checks
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
            Statutory rule-by-rule evaluation for bidder <span className="font-semibold text-on-surface">{selectedBidder.name}</span> under Tender <span className="font-semibold text-on-surface">{activeTender.code}</span>.
          </p>
        </div>

        <button
          onClick={() => onNavigate('portal-verification')}
          className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">lan</span>
          <span>View Sovereign API Response Schemas</span>
        </button>
      </div>

      {/* Compliance Checklist Cards */}
      <div className="space-y-3">
        {checks.map((chk) => (
          <div
            key={chk.id}
            className={`p-gutter-md rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${
              chk.flag
                ? 'bg-error-container/30 border-error/40'
                : 'bg-surface-container-lowest border-outline-variant/25'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`p-2 rounded-lg flex-shrink-0 ${
                  chk.flag ? 'bg-error text-on-error' : 'bg-secondary-fixed text-on-secondary-fixed'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {chk.flag ? 'warning' : 'check'}
                </span>
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-code-num text-xs font-bold text-on-surface">{chk.id}</span>
                  <h3 className="font-title-md text-on-surface font-bold text-sm">{chk.rule}</h3>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{chk.detail}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  chk.flag ? 'bg-error text-on-error' : 'bg-secondary-fixed text-on-secondary-fixed'
                }`}
              >
                {chk.status}
              </span>
              {chk.flag && (
                <button
                  onClick={() => onNavigate('portal-verification')}
                  className="px-3 py-1 bg-error text-on-error rounded text-xs font-semibold hover:bg-error/90"
                >
                  View Audit & Notice
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
