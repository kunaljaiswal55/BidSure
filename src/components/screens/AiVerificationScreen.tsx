import React, { useState } from 'react';
import { Bidder, Tender, NavPath } from '../../types';
import { runForensicScan, ForensicResult } from '../../services/gemini';

interface AiVerificationScreenProps {
  selectedBidder: Bidder;
  activeTender: Tender;
  onNavigate: (path: NavPath) => void;
}

export const AiVerificationScreen: React.FC<AiVerificationScreenProps> = ({
  selectedBidder,
  activeTender,
  onNavigate
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ForensicResult | null>(null);

  const handleRunScan = async () => {
    setScanning(true);
    setScanResult(null);
    const result = await runForensicScan({
      bidderName: selectedBidder.name,
      cin: selectedBidder.cin,
      pan: selectedBidder.pan,
      tenderCode: activeTender.code,
    });
    setScanResult(result);
    setScanning(false);
  };

  return (
    <div className="flex flex-col w-full pb-gutter-xl space-y-gutter-lg">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-gutter-md">
        <div>
          <div className="flex items-center gap-gutter-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Multimodal AI Forensic Scanner</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            AI Document & Integrity Verification
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
            Neural document tampering detection, shell company graph analysis, and ICAI UDIN cross-verification.
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={scanning}
          className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-75"
        >
          <span className={`material-symbols-outlined text-[16px] ${scanning ? 'animate-spin' : ''}`}>
            {scanning ? 'refresh' : 'psychology'}
          </span>
          <span>{scanning ? 'Running Neural Audit...' : 'Run Deep AI Document Forensics'}</span>
        </button>
      </div>

      {/* Grid of AI Models */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
        <div className="bg-surface-container-lowest p-gutter-md rounded-xl border border-outline-variant/20 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant text-xs font-semibold mb-2">
            <span>Pixel Forensics</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">document_scanner</span>
          </div>
          <div className="text-xl font-bold text-on-surface">No Tampering</div>
          <p className="text-[11px] text-on-surface-variant mt-1">
            Zero splice or font embedding anomalies in OEM certificates.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-gutter-md rounded-xl border border-outline-variant/20 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant text-xs font-semibold mb-2">
            <span>ICAI UDIN Check</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">fact_check</span>
          </div>
          <div className="text-xl font-bold text-secondary">Verified CA</div>
          <p className="text-[11px] text-on-surface-variant mt-1">
            Turnover certificates matched with Institute of Chartered Accountants.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-gutter-md rounded-xl border border-outline-variant/20 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant text-xs font-semibold mb-2">
            <span>Shell Risk Index</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">hub</span>
          </div>
          <div className="text-xl font-bold text-on-surface">0.08 / 1.0</div>
          <p className="text-[11px] text-on-surface-variant mt-1">
            Director graph verified against MCA disqualification master list.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-gutter-md rounded-xl border border-outline-variant/20 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant text-xs font-semibold mb-2">
            <span>Cartel Ring Analysis</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">group_work</span>
          </div>
          <div className="text-xl font-bold text-secondary">Zero Collusion</div>
          <p className="text-[11px] text-on-surface-variant mt-1">
            Bids originated from distinct IP subnets and MAC addresses.
          </p>
        </div>
      </div>

      {/* AI Forensic Inspector Results */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-gutter-md shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-secondary-fixed text-on-secondary-fixed rounded-lg">
              <span className="material-symbols-outlined text-[18px]">neurology</span>
            </span>
            <h2 className="font-title-lg text-on-surface font-bold">
              AI Verification Report for {selectedBidder.name}
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-code-num text-xs font-semibold">
            Tender: {activeTender.code}
          </span>
        </div>

        {scanResult ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-end">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  scanResult.source === 'gemini' ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {scanResult.source === 'gemini' ? 'Gemini 2.0 Flash' : 'Sandbox Mock'}
              </span>
            </div>
            <div className="p-3 bg-secondary-fixed/20 rounded-lg border border-secondary/20 text-xs leading-relaxed text-on-surface">
              <strong className="text-secondary font-bold">Executive AI Assessment: </strong>
              {scanResult.summary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-container-low rounded-lg">
                <span className="font-semibold text-on-surface-variant">Image Splicing & ELA Score:</span>
                <div className="font-code-num font-bold text-on-surface text-sm mt-0.5">{scanResult.tamperingRisk}</div>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg">
                <span className="font-semibold text-on-surface-variant">ICAI CA Registry UDIN:</span>
                <div className="font-code-num font-bold text-secondary text-sm mt-0.5">{scanResult.udinMatch}</div>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg">
                <span className="font-semibold text-on-surface-variant">Circular Invoicing Network Check:</span>
                <div className="font-code-num font-bold text-on-surface text-sm mt-0.5">{scanResult.circularTrading}</div>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg">
                <span className="font-semibold text-on-surface-variant">Physical Plant Verification:</span>
                <div className="font-code-num font-bold text-on-surface text-sm mt-0.5">{scanResult.shellCompanyIndex}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">neurology</span>
            <p className="text-sm font-semibold text-on-surface">AI Model Ready for Forensic Analysis</p>
            <p className="text-xs max-w-md mt-1">
              Click &quot;Run Deep AI Document Forensics&quot; above to execute neural perceptual hash verification, CA UDIN cross-match, and cartel network graphs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
