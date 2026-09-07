import React, { useState } from 'react';
import { Bidder, Tender, PortalData } from '../../types';

interface ReportsScreenProps {
  selectedBidder: Bidder;
  activeTender: Tender;
  portals: Record<string, PortalData>;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  selectedBidder,
  activeTender,
  portals
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="flex flex-col w-full pb-gutter-xl space-y-gutter-lg">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-gutter-md">
        <div>
          <div className="flex items-center gap-gutter-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">analytics</span>
            <span>Cryptographic Clearance Certificate</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Statutory Audit & Verification Report
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
            Tamper-evident verification summary with SHA-256 digital signature anchor for GeM SPV records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 rounded-lg text-xs font-semibold text-on-surface flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Certificate</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">
              {downloaded ? 'check' : 'download'}
            </span>
            <span>{downloaded ? 'Certificate Downloaded' : 'Export Official PDF'}</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Preview */}
      <div className="bg-surface-container-lowest rounded-xl border-2 border-outline-variant/40 p-8 shadow-md max-w-4xl mx-auto w-full relative overflow-hidden">
        {/* Top Watermark Emblem Banner */}
        <div className="flex items-center justify-between border-b-2 border-on-surface/10 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1Uuuf1bx1P3fo-HQjqRf5touMkFSJyiUxs2gSBpCe3M_S4aoQSrHFi2DTiHQCDaokrji_tlIC2brO55KYP8m_dQcxUO6oH2-FvKuSGx83DsgL5QKSgRe4-lhAK-xXTjNgFWBR_UfzEZJpOx4Y1JEJ_Tdmo6F_wgJk2MpGaAca1v4h9jzNLdUayF94R0MDLAqd27jDRaQYWciiaqxPT5XBj2_3knht-YCdClnjXYahCCbUdS71nt4o5unGE"
              alt="BidSure AI Logo"
              className="h-12 w-auto object-contain"
            />
            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-secondary">
                Government e-Marketplace (GeM SPV)
              </div>
              <h2 className="text-xl font-black text-on-surface tracking-tight">
                Statutory Sovereign Database Verification Clearance
              </h2>
              <div className="text-[11px] text-on-surface-variant font-code-num">
                Certificate Ref: GEM/CERT/2026/SIH26100-881920
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold font-code-num">
              SECURE SHA-256 SIGNED
            </span>
            <div className="text-[10px] text-on-surface-variant mt-1">Date: 07 Sep 2026</div>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="space-y-4 text-xs leading-relaxed text-on-surface">
          <div className="p-3 bg-surface-container-low rounded-lg">
            <h3 className="font-bold text-xs uppercase text-secondary mb-1">Subject Entity Particulars</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-code-num text-[11px]">
              <div>
                <span className="text-on-surface-variant block">Company Name:</span>
                <span className="font-bold text-on-surface">{selectedBidder.name}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Corporate CIN:</span>
                <span className="font-bold text-on-surface">{selectedBidder.cin}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Permanent A/C (PAN):</span>
                <span className="font-bold text-secondary">{selectedBidder.pan}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block">GSTIN:</span>
                <span className="font-bold text-on-surface">{selectedBidder.gstin}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase text-secondary mb-2">
              Sovereign Database Verification Findings (13 Integrations)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {(Object.values(portals) as PortalData[]).map((p) => (
                <div key={p.id} className="p-2 border border-outline-variant/20 rounded flex justify-between items-center">
                  <span>{p.name}</span>
                  <span
                    className={`font-semibold ${
                      p.id === 'dpiit' ? 'text-error' : 'text-secondary'
                    }`}
                  >
                    {p.id === 'dpiit' ? 'Discrepancy (42% vs 50%)' : 'Verified OK'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-error-container/20 rounded-lg border border-error/30 text-xs">
            <strong className="text-error font-bold">Officer Note on Discrepancy: </strong>
            Bidder fails the Class-I 50% Local Content requirement under PPP-MII Order 2017. Bidder may only be evaluated as Class-II Local Supplier without margin of preference.
          </div>

          {/* Signature Block */}
          <div className="pt-6 border-t border-on-surface/10 flex justify-between items-end">
            <div className="text-[10px] text-on-surface-variant font-code-num space-y-0.5">
              <div>Digital Certificate Issuer: cn=GeM SPV NIC Gateway CA Root Anchor</div>
              <div>Algorithm: SHA256withRSA · ISO/IEC 27001 Certified</div>
              <div>Timestamp: 2026-09-07T20:12:05.109Z</div>
            </div>

            <div className="text-right">
              <div className="font-bold text-xs text-on-surface">R. Sharma</div>
              <div className="text-[11px] text-secondary font-medium">Joint Secretary (Procurement) & Clearing Officer</div>
              <div className="text-[10px] text-on-surface-variant">Government e-Marketplace SPV</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
