import React from 'react';
import { Bidder, NavPath } from '../../types';

interface BiddersScreenProps {
  bidders: Bidder[];
  selectedBidder: Bidder;
  onSelectBidder: (bidder: Bidder) => void;
  onNavigate: (path: NavPath) => void;
}

export const BiddersScreen: React.FC<BiddersScreenProps> = ({
  bidders,
  selectedBidder,
  onSelectBidder,
  onNavigate
}) => {
  return (
    <div className="flex flex-col w-full pb-gutter-xl space-y-gutter-lg">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-gutter-md">
        <div>
          <div className="flex items-center gap-gutter-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
            <span>Vendor Directory & Master Registry</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Participating GeM Bidders
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
            Statutory profile, MCA corporate data, tax standing, and Make In India declarations for registered suppliers.
          </p>
        </div>

        <button
          onClick={() => onNavigate('portal-verification')}
          className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">lan</span>
          <span>Open Multi-Portal Hub for Selected Bidder</span>
        </button>
      </div>

      {/* Bidders Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Organization & Entity Details</th>
                <th className="py-3 px-3">Statutory Identifiers</th>
                <th className="py-3 px-3">MII Local Content</th>
                <th className="py-3 px-3">MSME Tier</th>
                <th className="py-3 px-3">Turnover</th>
                <th className="py-3 px-3">Audit Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {bidders.map((b) => {
                const isSelected = b.id === selectedBidder.id;
                return (
                  <tr
                    key={b.id}
                    onClick={() => onSelectBidder(b)}
                    className={`hover:bg-surface-container-low/50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-secondary-fixed/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-on-surface text-[13px]">{b.name}</div>
                      <div className="text-[11px] text-on-surface-variant flex items-center gap-2 mt-0.5">
                        <span>Inc. {b.incorporationYear}</span>
                        <span>•</span>
                        <span>{b.registeredState}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-code-num text-[11px]">
                      <div>CIN: <span className="font-semibold text-on-surface">{b.cin}</span></div>
                      <div>PAN: <span className="text-secondary font-semibold">{b.pan}</span></div>
                      <div>GST: <span className="text-on-surface-variant">{b.gstin}</span></div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className={b.miiPercentage < 50 ? 'text-error' : 'text-secondary'}>
                          {b.miiPercentage}%
                        </span>
                        {b.miiPercentage < 50 && (
                          <span className="material-symbols-outlined text-error text-[16px]">warning</span>
                        )}
                      </div>
                      <div className="text-[10px] text-on-surface-variant">
                        {b.miiPercentage >= 50 ? 'Class-I Local' : 'Class-II Local (Flag)'}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold text-[11px]">
                        {b.msmeCategory}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-code-num font-bold text-on-surface">
                      {b.annualTurnover}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          b.status === 'Verified'
                            ? 'bg-secondary-fixed text-on-secondary-fixed'
                            : b.status === 'Audit Flag'
                            ? 'bg-error-container text-error'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            b.status === 'Verified' ? 'bg-secondary' : 'bg-error'
                          }`}
                        ></span>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBidder(b);
                          onNavigate('portal-verification');
                        }}
                        className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-semibold text-on-surface"
                      >
                        Verify 13 Portals
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
