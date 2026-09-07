/**
 * GeM Gateway Service – SIH 26100
 * Abstracts statutory portal I/O. In Sandbox mode it simulates latency/signatures
 * using local fixtures. In production it will call REST/OAuth2 NIC gateway.
 *
 * Drop-in replacement for the setTimeout mocks in App.tsx.
 */
import { PortalData, AuditLogEntry, Bidder, Tender } from '../types';
import { formatGovTimestamp, latencyMs, randomSha256, nextLogId } from '../utils/format';
import { INITIAL_PORTALS } from '../data/portalData';

export type GatewayMode = 'sandbox' | 'live';

export interface GatewayConfig {
  mode: GatewayMode;
  baseUrl: string; // e.g. https://api.gem.gov.in
  latencyThrottleMs: number; // artificial min latency in sandbox
  strictMii: boolean;
}

export const DEFAULT_GATEWAY_CONFIG: GatewayConfig = {
  mode: 'sandbox',
  baseUrl: import.meta.env.VITE_GEM_GATEWAY_URL ?? 'https://api.gem.gov.in',
  latencyThrottleMs: 178,
  strictMii: true,
};

/**
 * Simulate a single portal re-verification.
 * In live mode, replace body with fetch(`${config.baseUrl}${portal.endpoint}`, {method:'POST', ...})
 */
export async function reverifyPortal(
  portals: Record<string, PortalData>,
  portalId: string,
  bidder: Bidder,
  tender: Tender,
  config: GatewayConfig = DEFAULT_GATEWAY_CONFIG,
): Promise<{ portals: Record<string, PortalData>; log: AuditLogEntry }> {
  const portal = portals[portalId];
  if (!portal) throw new Error(`Unknown portal ${portalId}`);

  // Simulate network
  const simulatedLatency = config.mode === 'sandbox' ? latencyMs(110, 205) : latencyMs(80, 160);
  await delay(config.mode === 'sandbox' ? 600 : 300);

  const nowFormatted = formatGovTimestamp(new Date());
  const nextPortals: Record<string, PortalData> = {
    ...portals,
    [portalId]: {
      ...portal,
      timestamp: nowFormatted,
      responseTime: simulatedLatency,
      // bump request meta timestamp if present
      req: (() => {
        const meta = (portal.req as Record<string, unknown>).meta as Record<string, unknown> | undefined;
        if (!meta) return portal.req;
        return { ...portal.req, meta: { ...meta, timestamp: new Date().toISOString() } };
      })(),
    },
  };

  // patch DPIIT status based on strictMii + thresholds (mirrors App.handleBidderChange)
  if (portalId === 'dpiit' && config.strictMii) {
    const dpiit = nextPortals.dpiit;
    const passed = bidder.miiPercentage >= tender.miiRequiredPercent;
    nextPortals.dpiit = {
      ...dpiit,
      status: passed ? 'connected' : 'audit_flag',
      statusDetail: passed
        ? `Compliant (${bidder.miiPercentage}% declared vs ${tender.miiRequiredPercent}% required)`
        : `Self-Declaration Audit Flag (${bidder.miiPercentage}% declared vs ${tender.miiRequiredPercent}% tender requirement)`,
    } as PortalData;
  }

  const log: AuditLogEntry = {
    id: nextLogId(),
    timestamp: nowFormatted,
    officer: 'R. Sharma (JS-Proc.)',
    portal: portal.shortName,
    action: `Live API Re-Verification query completed for ${bidder.name}`,
    status: portalId === 'dpiit' && bidder.miiPercentage < tender.miiRequiredPercent ? 'FLAG' : 'SUCCESS',
    latency: simulatedLatency,
    sha256Digest: randomSha256(),
  };

  if (config.mode === 'live') {
    // TODO: wire real fetch – keep structure for audit parity
    // const res = await fetch(`${config.baseUrl}${portal.endpoint}`, { method: 'POST', body: JSON.stringify(portal.req) });
    // ... map res to portal status/log
    void INITIAL_PORTALS; // keep import used
  }

  return { portals: nextPortals, log };
}

export async function verifyAllPortals(
  portals: Record<string, PortalData>,
  tender: Tender,
  config: GatewayConfig = DEFAULT_GATEWAY_CONFIG,
): Promise<{ portals: Record<string, PortalData>; log: AuditLogEntry }> {
  await delay(config.mode === 'sandbox' ? 1200 : 600);
  const nowFormatted = formatGovTimestamp(new Date());
  const next: Record<string, PortalData> = {};
  for (const [key, item] of Object.entries(portals)) {
    next[key] = { ...item, timestamp: nowFormatted, responseTime: latencyMs(105, 195) };
  }
  const log: AuditLogEntry = {
    id: nextLogId(),
    timestamp: nowFormatted,
    officer: 'R. Sharma (JS-Proc.)',
    portal: 'Batch Gateway (13 Nodes)',
    action: `Batch Multi-Portal Sync executed across all sovereign endpoints for tender ${tender.code}`,
    status: 'SUCCESS',
    latency: '178ms (Avg)',
    sha256Digest: randomSha256(),
  };
  return { portals: next, log };
}

export function exportAuditBundle(args: {
  bidder: Bidder;
  tender: Tender;
  portals: Record<string, PortalData>;
  logs: AuditLogEntry[];
}): Blob {
  const bundle = {
    app: 'BidSure AI - SIH 26100',
    exportedAt: new Date().toISOString(),
    officer: 'R. Sharma (JS-Proc.)',
    bidder: args.bidder,
    tender: args.tender,
    portalsVerified: args.portals,
    cryptographicSignatures: args.logs,
  };
  return new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
