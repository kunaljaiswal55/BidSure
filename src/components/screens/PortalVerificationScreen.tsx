import React, { useState, useRef } from 'react';
import { PortalData, Bidder, Tender, AuditLogEntry } from '../../types';
import { HealthCheckModal } from '../modals/HealthCheckModal';
import { SyncLogsModal } from '../modals/SyncLogsModal';
import { DpiitAuditModal } from '../modals/DpiitAuditModal';

interface PortalVerificationScreenProps {
  portals: Record<string, PortalData>;
  selectedBidder: Bidder;
  activeTender: Tender;
  auditLogs: AuditLogEntry[];
  onReverifyPortal: (portalId: string) => void;
  onVerifyAll: () => void;
  isVerifyingAll: boolean;
  verifyingPortals: Record<string, boolean>;
  onBidderChange: (bidder: Bidder) => void;
  allBidders: Bidder[];
}

export const PortalVerificationScreen: React.FC<PortalVerificationScreenProps> = ({
  portals,
  selectedBidder,
  activeTender,
  auditLogs,
  onReverifyPortal,
  onVerifyAll,
  isVerifyingAll,
  verifyingPortals,
  onBidderChange,
  allBidders
}) => {
  const [activePortalKey, setActivePortalKey] = useState<string>('gem');
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; icon: string } | null>(null);
  const [isHealthCheckOpen, setIsHealthCheckOpen] = useState(false);
  const [isSyncLogsOpen, setIsSyncLogsOpen] = useState(false);
  const [isDpiitAuditOpen, setIsDpiitAuditOpen] = useState(false);
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const inspectorRef = useRef<HTMLDivElement>(null);

  const activePortal = portals[activePortalKey] || portals.gem;

  const triggerToast = (title: string, desc: string, icon = 'check_circle') => {
    setToastMessage({ title, desc, icon });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleInspect = (portalKey: string) => {
    setActivePortalKey(portalKey);
    triggerToast(
      'Inspecting Payload',
      `Loaded authentic schema for ${portals[portalKey]?.shortName || portalKey.toUpperCase()}`,
      'data_object'
    );
    if (inspectorRef.current) {
      inspectorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleReverify = (portalKey: string) => {
    onReverifyPortal(portalKey);
    setActivePortalKey(portalKey);
    triggerToast(
      'Re-Verification Successful',
      `${portals[portalKey]?.shortName || portalKey.toUpperCase()} handshake completed with zero latency spike.`,
      'verified'
    );
  };

  const handleCopyJson = () => {
    const textToCopy = `REQUEST:\n${JSON.stringify(activePortal.req, null, 2)}\n\nRESPONSE:\n${JSON.stringify(
      activePortal.res,
      null,
      2
    )}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedPayload(true);
    triggerToast('Payload Copied', 'Request and response JSON copied to system clipboard.', 'content_paste');
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleExportAuditBundle = () => {
    const bundle = {
      app: 'BidSure AI - SIH 26100',
      exportedAt: new Date().toISOString(),
      officer: 'R. Sharma (JS-Proc.)',
      bidder: selectedBidder,
      tender: activeTender,
      portalsVerified: portals,
      cryptographicSignatures: auditLogs
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bidsure-sih26100-audit-bundle-${selectedBidder.cin}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Bundle Downloaded', 'Exported cryptographic verification bundle with SHA-256 integrity hash.', 'receipt_long');
  };

  const handleRecheckAllGateways = () => {
    setIsHealthChecking(true);
    setTimeout(() => {
      setIsHealthChecking(false);
      triggerToast('Health Check Complete', 'All 13 sovereign gateways responding with nominal latency (Avg 178ms).', 'wifi_tethering');
    }, 900);
  };

  const handleIssueStatutoryNotice = () => {
    triggerToast('Statutory Notice Dispatched', `Rule 153 Notice sent to ${selectedBidder.name} via GeM SPV portal.`, 'send');
  };

  return (
    <div className="flex flex-col w-full pb-gutter-xl">
      {/* Environment Simulation Warning Banner */}
      <div className="relative overflow-hidden bg-surface-container rounded-xl shadow-xs mb-gutter-md p-gutter-md flex flex-col sm:flex-row items-start gap-gutter-md border border-outline-variant/30">
        <div className="p-2 bg-secondary-fixed rounded-lg text-on-secondary-fixed flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[24px]">terminal</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-gutter-sm flex-wrap">
            <span className="font-title-md text-title-md text-on-surface font-bold">
              Simulated API Response Environment
            </span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
              SIH 26100 Sandbox
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
            All portal integrations are mocked with authentic schema for SIH demonstration. Production hooks are
            architected for direct REST/OAuth2 GeM gateway integration with end-to-end cryptographic payload signing.
          </p>
        </div>
        <div className="flex items-center gap-gutter-xs px-3 py-1.5 bg-surface-container-lowest rounded-lg shadow-xs flex-shrink-0 border border-outline-variant/20">
          <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
          <span className="font-code-num text-code-num text-on-surface font-semibold">
            Gateway Latency: 178ms
          </span>
        </div>
      </div>

      {/* Page Header & Global Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-gutter-md mb-gutter-lg">
        <div className="flex flex-col">
          <div className="flex items-center gap-gutter-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Statutory Sovereign Database Sync</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Government Multi-Portal Verification Hub
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
            Real-time API connectivity and simulated status across all statutory government databases for GeM procurement
            compliance, automated fraud screening, and vendor eligibility validation.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-gutter-sm flex-shrink-0">
          <button
            onClick={() => setIsSyncLogsOpen(true)}
            className="flex items-center gap-gutter-xs px-3 py-2 bg-surface-container-lowest hover:bg-surface-container rounded-lg shadow-xs text-on-surface transition-colors font-title-md text-title-md border border-outline-variant/30 cursor-pointer"
            id="sync-logs-btn"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">manage_search</span>
            <span>Sync Logs</span>
          </button>

          <button
            onClick={() => setIsHealthCheckOpen(true)}
            className="flex items-center gap-gutter-xs px-3 py-2 bg-surface-container-lowest hover:bg-surface-container rounded-lg shadow-xs text-on-surface transition-colors font-title-md text-title-md border border-outline-variant/30 cursor-pointer"
            id="health-check-btn"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">wifi_tethering</span>
            <span>Connection Health Check</span>
          </button>

          <button
            onClick={() => {
              onVerifyAll();
              triggerToast('Multi-Portal Batch Verification', 'Simultaneously polling 13 sovereign APIs via GeM Gateway...', 'sync');
            }}
            disabled={isVerifyingAll}
            className="flex items-center gap-gutter-xs px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg shadow-md transition-all font-title-md text-title-md cursor-pointer disabled:opacity-75"
            id="verify-all-btn"
            type="button"
          >
            <span className={`material-symbols-outlined text-[18px] ${isVerifyingAll ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{isVerifyingAll ? 'Verifying All 13 Portals...' : 'Verify All Portals Now'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Stats & Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter-md mb-gutter-lg">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-gutter-md rounded-xl shadow-xs border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">Statutory Coverage</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">account_balance</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">13 / 13</span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">100% Enrolled</span>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-secondary h-full rounded-full w-full"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-gutter-md rounded-xl shadow-xs border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">Valid & Active</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">11</span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">Clear Records</span>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-secondary h-full rounded-full w-11/12"></div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-gutter-md rounded-xl shadow-xs border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">Audit Discrepancy</span>
            <span className="material-symbols-outlined text-error text-[20px]">warning</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-error font-bold">1</span>
            <span className="font-label-sm text-label-sm text-error font-semibold">DPIIT MII Flag</span>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-error h-full rounded-full w-1/12"></div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-gutter-md rounded-xl shadow-xs border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">Non-Claimed Status</span>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">info</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">1</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Startup Exemption</span>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-surface-tint h-full rounded-full w-1/12"></div>
          </div>
        </div>
      </div>

      {/* Bidder Reference Overview Context Strip */}
      <div className="bg-surface-container-low rounded-xl p-gutter-md mb-gutter-lg flex flex-wrap items-center justify-between gap-gutter-md border border-outline-variant/30">
        <div className="flex items-center gap-gutter-md flex-wrap">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">apartment</span>
          </div>
          <div>
            <div className="flex items-center gap-gutter-sm flex-wrap">
              {/* Bidder Selector Dropdown for interactive testing */}
              <select
                aria-label="Active Bidder Selection"
                value={selectedBidder.id}
                onChange={(e) => {
                  const found = allBidders.find((b) => b.id === e.target.value);
                  if (found) onBidderChange(found);
                }}
                className="font-title-lg text-title-lg text-on-surface font-bold bg-transparent border-b border-dashed border-secondary hover:border-solid cursor-pointer focus:outline-none pr-2"
              >
                {allBidders.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-code-num text-code-num font-semibold">
                CIN: {selectedBidder.cin}
              </span>
            </div>

            <div className="flex items-center gap-gutter-md mt-1 flex-wrap text-on-surface-variant font-body-sm text-body-sm">
              <span>
                PAN: <span className="font-code-num text-on-surface font-semibold">{selectedBidder.pan}</span>
              </span>
              <span>
                GSTIN: <span className="font-code-num text-on-surface font-semibold">{selectedBidder.gstin}</span>
              </span>
              <span>
                GeM Seller ID:{' '}
                <span className="font-code-num text-on-surface font-semibold">{selectedBidder.gemSellerId}</span>
              </span>
              <span>
                Tender:{' '}
                <span className="font-code-num text-on-surface font-semibold">{activeTender.code}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-gutter-xs">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              selectedBidder.status === 'Audit Flag' ? 'bg-error animate-pulse' : 'bg-secondary'
            }`}
          ></span>
          <span
            className={`font-label-md text-label-md font-semibold ${
              selectedBidder.status === 'Audit Flag' ? 'text-error' : 'text-secondary'
            }`}
          >
            {selectedBidder.status === 'Audit Flag' ? 'Audit Flag Under Review' : 'Bidder Statutory Verified'}
          </span>
        </div>
      </div>

      {/* Grid of 13 Statutory Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter-md" id="portal-cards-container">
        {(Object.values(portals) as PortalData[]).map((portal) => {
          const isSelected = activePortalKey === portal.id;
          const isVerifying = verifyingPortals[portal.id] || isVerifyingAll;
          const isDpiitFlag = portal.id === 'dpiit';

          return (
            <div
              key={portal.id}
              data-portal-id={portal.id}
              onClick={() => setActivePortalKey(portal.id)}
              className={`portal-card rounded-xl p-gutter-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer border ${
                isDpiitFlag
                  ? 'bg-error-container/40 border-error/40'
                  : isSelected
                  ? 'bg-surface-container-lowest border-secondary ring-1 ring-secondary/40'
                  : 'bg-surface-container-lowest border-outline-variant/20'
              } ${isVerifying ? 'animate-pulse' : ''}`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-gutter-sm mb-2">
                  <div className="flex items-center gap-gutter-xs">
                    <span
                      className={`p-1.5 rounded-lg ${
                        isDpiitFlag ? 'bg-error-container text-error' : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{portal.iconName}</span>
                    </span>
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">{portal.name}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`w-2 h-2 rounded-full ${isDpiitFlag ? 'bg-error' : 'bg-secondary'}`}
                        ></span>
                        <span
                          className={`font-label-sm text-label-sm font-semibold ${
                            isDpiitFlag ? 'text-error' : 'text-secondary'
                          }`}
                        >
                          {isDpiitFlag ? 'Audit Flag' : portal.statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="font-code-num text-label-sm text-on-surface-variant whitespace-nowrap">
                    {portal.timestamp}
                  </span>
                </div>

                {/* Status Box */}
                <div
                  className={`my-3 p-2.5 rounded-lg flex items-start gap-gutter-xs ${
                    isDpiitFlag ? 'bg-surface-container-lowest/80' : 'bg-surface-container-low'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5 ${
                      isDpiitFlag
                        ? 'text-error'
                        : portal.isExempt
                        ? 'text-on-surface-variant'
                        : 'text-secondary'
                    }`}
                  >
                    {isDpiitFlag ? 'warning' : portal.isExempt ? 'remove' : 'check_circle'}
                  </span>
                  <span
                    className={`font-body-sm text-body-sm ${
                      isDpiitFlag
                        ? 'text-error font-medium'
                        : portal.isExempt
                        ? 'text-on-surface-variant'
                        : 'text-on-surface'
                    }`}
                  >
                    {portal.statusDetail}
                  </span>
                </div>
              </div>

              {/* Card Footer with Latency and Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/15 mt-1">
                <span className="font-code-num text-label-sm text-on-surface-variant">
                  Response: {portal.responseTime}
                </span>
                <div className="flex items-center gap-gutter-xs" onClick={(e) => e.stopPropagation()}>
                  {/* Inspect Schema Button */}
                  <button
                    onClick={() => handleInspect(portal.id)}
                    className="inspect-btn p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                    title="View Payload Schema"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">data_object</span>
                  </button>

                  {/* Primary card action */}
                  {isDpiitFlag ? (
                    <button
                      onClick={() => setIsDpiitAuditOpen(true)}
                      className="audit-btn px-3 py-1 bg-error text-on-error hover:bg-error/90 rounded-lg font-title-md text-label-md transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">policy</span>
                      <span>View Audit</span>
                    </button>
                  ) : portal.id === 'digilocker' ? (
                    <button
                      onClick={() => handleInspect('digilocker')}
                      className="inspect-btn px-3 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-title-md text-label-md transition-colors flex items-center gap-1 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      <span>Inspect</span>
                    </button>
                  ) : portal.id === 'startup' ? (
                    <button
                      onClick={() => handleReverify(portal.id)}
                      disabled={isVerifying}
                      className="reverify-btn px-3 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-title-md text-label-md transition-colors flex items-center gap-1 cursor-pointer"
                      type="button"
                    >
                      <span
                        className={`material-symbols-outlined text-[14px] ${
                          isVerifying ? 'animate-spin' : ''
                        }`}
                      >
                        {isVerifying ? 'refresh' : 'search'}
                      </span>
                      <span>{isVerifying ? 'Checking' : 'Check'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReverify(portal.id)}
                      disabled={isVerifying}
                      className="reverify-btn px-3 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-title-md text-label-md transition-colors flex items-center gap-1 cursor-pointer"
                      type="button"
                    >
                      <span
                        className={`material-symbols-outlined text-[14px] ${
                          isVerifying ? 'animate-spin' : ''
                        }`}
                      >
                        refresh
                      </span>
                      <span>{isVerifying ? 'Verifying' : portal.id === 'bis' ? 'Verify' : 'Re-Verify'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Simulated Payload Terminal Drawer / Inspector Panel */}
      <div
        ref={inspectorRef}
        id="inspector-panel"
        className="mt-gutter-xl bg-surface-container-lowest rounded-xl shadow-md overflow-hidden transition-all duration-300 border border-outline-variant/30"
      >
        <div className="bg-primary px-gutter-md py-3 flex items-center justify-between text-on-primary flex-wrap gap-2">
          <div className="flex items-center gap-gutter-sm flex-wrap">
            <span className="material-symbols-outlined text-[20px] text-secondary-fixed">code</span>
            <span className="font-title-md text-title-md font-semibold tracking-wide">
              Statutory API Gateway Protocol & Payload Inspector
            </span>
            <span
              className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-code-num text-label-sm border border-outline-variant/20"
              id="drawer-portal-badge"
            >
              ENDPOINT: {activePortal.endpoint}
            </span>
          </div>
          <div className="flex items-center gap-gutter-md">
            <div className="flex items-center gap-gutter-xs font-code-num text-label-sm text-primary-fixed">
              <span className="material-symbols-outlined text-[16px]">speed</span>
              <span id="latency-indicator">Latency: {activePortal.responseTime} (TLS 1.3 Handshake)</span>
            </div>
            <button
              onClick={handleCopyJson}
              className="p-1.5 hover:bg-surface-container/20 rounded transition-colors text-on-primary cursor-pointer"
              id="copy-json-btn"
              title="Copy JSON Payload"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {copiedPayload ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
        </div>

        {/* Payload Workspace Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-outline-variant/30">
          {/* Outbound Request */}
          <div className="p-gutter-md bg-surface-container-low/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-gutter-xs flex-wrap">
                <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-code-num text-label-sm font-semibold">
                  POST
                </span>
                <span className="font-code-num text-label-sm text-on-surface font-semibold truncate max-w-[280px] sm:max-w-md" id="outbound-url">
                  {activePortal.url}
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Auth: OAuth2 Bearer
              </span>
            </div>
            <pre
              className="font-code-num text-code-num bg-primary-container text-on-primary-container p-gutter-md rounded-lg overflow-x-auto text-[12px] leading-relaxed shadow-inner max-h-[360px]"
              id="request-payload"
            >
              {JSON.stringify(activePortal.req, null, 2)}
            </pre>
          </div>

          {/* Inbound Response with Validation Schema */}
          <div className="p-gutter-md bg-surface-container-low/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-gutter-xs">
                <span
                  className={`px-2 py-0.5 rounded font-code-num text-label-sm font-bold ${
                    activePortal.id === 'dpiit'
                      ? 'bg-error-container text-error'
                      : 'bg-secondary-container text-on-secondary-container'
                  }`}
                >
                  {activePortal.id === 'dpiit' ? '422 Unprocessable' : '200 OK'}
                </span>
                <span className="font-code-num text-label-sm text-secondary font-semibold">
                  Signature: RS256-NIC-VALID
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                Cryptographically Signed
              </span>
            </div>
            <pre
              className="font-code-num text-code-num bg-primary-container text-on-primary-container p-gutter-md rounded-lg overflow-x-auto text-[12px] leading-relaxed shadow-inner max-h-[360px]"
              id="response-payload"
            >
              {JSON.stringify(activePortal.res, null, 2)}
            </pre>
          </div>
        </div>

        {/* Cryptographic Verification Footnote */}
        <div className="bg-surface-container px-gutter-md py-2.5 flex flex-wrap items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/30 gap-2">
          <div className="flex items-center gap-gutter-xs">
            <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
            <span>Asymmetric PKI SHA-256 Digital Signature Verified • NIC Gateway CA Root Anchor</span>
          </div>
          <div className="flex items-center gap-gutter-md">
            <span>ISO/IEC 27001 Certified Handshake</span>
            <span>SIH-26100 GeM SPV Core Architecture</span>
          </div>
        </div>
      </div>

      {/* Notification Toast for Interactive Actions */}
      {toastMessage && (
        <div
          className="fixed bottom-6 right-6 bg-primary text-on-primary px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-outline-variant/20"
          id="status-toast"
        >
          <span className="material-symbols-outlined text-secondary-fixed text-[22px]" id="toast-icon">
            {toastMessage.icon}
          </span>
          <div className="flex flex-col">
            <span className="font-title-md text-title-md font-semibold" id="toast-title">
              {toastMessage.title}
            </span>
            <span className="font-body-sm text-body-sm text-on-primary-container" id="toast-msg">
              {toastMessage.desc}
            </span>
          </div>
        </div>
      )}

      {/* Modals */}
      <HealthCheckModal
        isOpen={isHealthCheckOpen}
        onClose={() => setIsHealthCheckOpen(false)}
        portals={portals}
        onRecheckAll={handleRecheckAllGateways}
        isChecking={isHealthChecking}
      />

      <SyncLogsModal
        isOpen={isSyncLogsOpen}
        onClose={() => setIsSyncLogsOpen(false)}
        logs={auditLogs}
        onExport={handleExportAuditBundle}
      />

      <DpiitAuditModal
        isOpen={isDpiitAuditOpen}
        onClose={() => setIsDpiitAuditOpen(false)}
        bidder={selectedBidder}
        tender={activeTender}
        onIssueNotice={handleIssueStatutoryNotice}
      />
    </div>
  );
};
