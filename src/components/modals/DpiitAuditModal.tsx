import React from 'react';
import { Bidder, Tender } from '../../types';

interface DpiitAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  bidder: Bidder;
  tender: Tender;
  onIssueNotice: () => void;
}

export const DpiitAuditModal: React.FC<DpiitAuditModalProps> = ({
  isOpen,
  onClose,
  bidder,
  tender,
  onIssueNotice
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-error/30 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-gutter-md border-b border-outline-variant/20 flex items-center justify-between bg-error-container/30">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-error-container text-error rounded-lg">
              <span className="material-symbols-outlined text-[22px]">policy</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-title-lg text-on-surface font-bold">DPIIT Make In India (MII) Audit Flag</h2>
                <span className="px-2 py-0.5 rounded-full bg-error text-on-error text-[10px] font-bold">
                  Rule 153(iii) Discrepancy
                </span>
              </div>
              <p className="font-body-sm text-on-surface-variant">
                Public Procurement (Preference to Make in India) Order, 2017 Non-conformance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-gutter-md overflow-y-auto space-y-4 text-xs">
          {/* Summary Box */}
          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-error text-[24px] flex-shrink-0">warning</span>
            <div>
              <div className="font-bold text-on-surface text-sm">
                Self-Declaration Deficit: 42% Local Content vs {tender.miiRequiredPercent}% Mandated
              </div>
              <p className="text-on-surface-variant mt-1 leading-relaxed">
                The bidder <span className="font-semibold text-on-surface">{bidder.name}</span> declared only{' '}
                <strong className="text-error">{bidder.miiPercentage}%</strong> local domestic value addition in their
                statutory annexure. This tender ({tender.code}) specifies a minimum threshold of{' '}
                <strong>{tender.miiRequiredPercent}%</strong> for Class-I Local Supplier purchase preference.
              </p>
            </div>
          </div>

          {/* Value Addition Breakdown Matrix */}
          <div className="border border-outline-variant/30 rounded-lg p-3 bg-surface-container-lowest">
            <h3 className="font-bold text-on-surface text-xs uppercase tracking-wider mb-2">
              Audited Cost Component Breakdown
            </h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface-variant">Domestic Value Addition (Local Component)</span>
                  <span className="font-bold text-error">42.00% (Eligible for Class-II only)</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full w-[42%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface-variant">Mandatory Tender Minimum (Class-I Supplier)</span>
                  <span className="font-bold text-secondary">{tender.miiRequiredPercent}.00%</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full w-[50%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface-variant">Imported Bill of Materials / Assemblies</span>
                  <span className="font-code-num text-on-surface">58.00% (Shenzhen & Taiwan sourcing)</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-surface-tint h-full rounded-full w-[58%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Consequence */}
          <div className="p-3 bg-surface-container-low rounded-lg space-y-2">
            <div className="font-semibold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">gavel</span>
              <span>Regulatory Implication under GeM GTC Clause 4(m)</span>
            </div>
            <ul className="list-disc pl-5 text-on-surface-variant space-y-1">
              <li>Bidder is disqualified from claiming 20% Class-I purchase preference margin.</li>
              <li>Tender evaluation committee must treat bidder as Class-II Local Supplier.</li>
              <li>A statutory clarification notice must be dispatched within 48 hours.</li>
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-gutter-md border-t border-outline-variant/20 bg-surface-container-low/30 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container text-xs font-semibold text-on-surface"
          >
            Dismiss
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onIssueNotice();
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-error hover:bg-error/90 text-on-error text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Issue Statutory Notice (Rule 153)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
