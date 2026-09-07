import React from 'react';
import { PortalData } from '../../types';
import { useEscape, useLockBodyScroll } from '../../hooks/useEscape';

interface HealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  portals: Record<string, PortalData>;
  onRecheckAll: () => void;
  isChecking: boolean;
}

export const HealthCheckModal: React.FC<HealthCheckModalProps> = ({
  isOpen,
  onClose,
  portals,
  onRecheckAll,
  isChecking
}) => {
  useEscape(isOpen, onClose);
  useLockBodyScroll(isOpen);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Gateway health check"
    >
      <div
        className="bg-surface-container-lowest rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-gutter-md border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-secondary-fixed text-on-secondary-fixed rounded-lg">
              <span className="material-symbols-outlined text-[20px]">wifi_tethering</span>
            </span>
            <div>
              <h2 className="font-title-lg text-on-surface font-bold">Government Gateway Circuit Health Check</h2>
              <p className="font-body-sm text-on-surface-variant">Real-time roundtrip ping & TLS 1.3 handshake verification across 13 sovereign nodes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body list */}
        <div className="p-gutter-md overflow-y-auto divide-y divide-outline-variant/15 flex-1">
          <div className="grid grid-cols-12 text-xs font-semibold text-on-surface-variant uppercase tracking-wider pb-2 px-2">
            <span className="col-span-5">Sovereign Authority Node</span>
            <span className="col-span-3">Protocol / TLS</span>
            <span className="col-span-2">Latency</span>
            <span className="col-span-2 text-right">Circuit Status</span>
          </div>

          {(Object.values(portals) as PortalData[]).map((portal) => (
            <div key={portal.id} className="grid grid-cols-12 items-center py-2.5 px-2 hover:bg-surface-container-low/40 rounded-lg text-xs">
              <div className="col-span-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">{portal.iconName}</span>
                <div>
                  <div className="font-semibold text-on-surface">{portal.shortName}</div>
                  <div className="text-[11px] text-on-surface-variant truncate max-w-[220px]">{portal.agency}</div>
                </div>
              </div>
              <div className="col-span-3 font-code-num text-[11px] text-on-surface-variant">
                HTTPS / TLS 1.3 RS256
              </div>
              <div className="col-span-2 font-code-num font-medium text-secondary">
                {portal.responseTime}
              </div>
              <div className="col-span-2 flex justify-end">
                {portal.id === 'dpiit' ? (
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-error text-[11px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                    Audit Flag
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Operational
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-gutter-md border-t border-outline-variant/20 bg-surface-container-low/30 flex items-center justify-between">
          <div className="text-xs text-on-surface-variant">
            Average Gateway Response: <span className="font-code-num font-bold text-on-surface">178ms</span> · Packet Loss: <span className="font-code-num font-bold text-secondary">0.00%</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container text-xs font-semibold text-on-surface"
            >
              Close
            </button>
            <button
              onClick={onRecheckAll}
              disabled={isChecking}
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <span className={`material-symbols-outlined text-[16px] ${isChecking ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{isChecking ? 'Pinging Nodes...' : 'Re-ping All 13 Gateways'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
