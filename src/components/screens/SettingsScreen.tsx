import React, { useState, useEffect } from 'react';
import { NavPath } from '../../types';

interface SettingsScreenProps {
  onNavigate: (path: NavPath) => void;
}

const LS_KEY = 'bidsure_gateway_config';

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const [latencyThrottle, setLatencyThrottle] = useState(178);
  const [sandboxMode, setSandboxMode] = useState(true);
  const [strictMiiFilter, setStrictMiiFilter] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const cfg = JSON.parse(raw) as { latencyThrottle?: number; sandboxMode?: boolean; strictMiiFilter?: boolean };
        if (typeof cfg.latencyThrottle === 'number') setLatencyThrottle(cfg.latencyThrottle);
        if (typeof cfg.sandboxMode === 'boolean') setSandboxMode(cfg.sandboxMode);
        if (typeof cfg.strictMiiFilter === 'boolean') setStrictMiiFilter(cfg.strictMiiFilter);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ latencyThrottle, sandboxMode, strictMiiFilter }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-gutter-xl space-y-gutter-lg">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-gutter-md">
        <div>
          <div className="flex items-center gap-gutter-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span>Gateway & Verification Config</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            System & Gateway Settings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
            Configure SIH 26100 mock gateway hooks, latency simulation, and cryptographic signing keys.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">
            {saved ? 'check' : 'save'}
          </span>
          <span>{saved ? 'Settings Saved' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* Settings Sections */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-gutter-md shadow-xs space-y-6 max-w-3xl">
        {/* Sandbox Mode */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <div>
            <h3 className="text-sm font-bold text-on-surface">SIH 26100 Simulation Sandbox</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Serve mock authentic JSON schemas with RS256 digital signature simulation.
            </p>
          </div>
          <button
            onClick={() => setSandboxMode(!sandboxMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              sandboxMode ? 'bg-secondary' : 'bg-surface-container-high'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                sandboxMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Latency throttle */}
        <div className="pb-4 border-b border-outline-variant/20">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-bold text-on-surface">Simulated Gateway Latency</h3>
            <span className="font-code-num text-xs font-bold text-secondary">{latencyThrottle} ms</span>
          </div>
          <p className="text-xs text-on-surface-variant mb-3">
            Emulate NIC sovereign API gateway round-trip time across Indian state data centers.
          </p>
          <input
            type="range"
            min="40"
            max="600"
            value={latencyThrottle}
            onChange={(e) => setLatencyThrottle(Number(e.target.value))}
            className="w-full accent-secondary"
          />
        </div>

        {/* Strict MII Filter */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <div>
            <h3 className="text-sm font-bold text-on-surface">Strict DPIIT Local Content Enforcement</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Automatically flag vendors with declared local content under 50% for Class-I tenders.
            </p>
          </div>
          <button
            onClick={() => setStrictMiiFilter(!strictMiiFilter)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              strictMiiFilter ? 'bg-secondary' : 'bg-surface-container-high'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                strictMiiFilter ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Certificate Keys */}
        <div>
          <h3 className="text-sm font-bold text-on-surface mb-1">NIC Gateway Root Anchor CA</h3>
          <p className="text-xs text-on-surface-variant mb-2">
            Configured X.509 Certificate thumbprint for payload verification:
          </p>
          <pre className="font-code-num text-[11px] p-3 rounded-lg bg-surface-container-low text-on-surface">
            SHA256 Fingerprint: E4:D3:F2:A1:B9:C8:44:19:AA:EC:71:23:4F:1Z:89:90:21:44:11:02
          </pre>
        </div>
      </div>
    </div>
  );
};
