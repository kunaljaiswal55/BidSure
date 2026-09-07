/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavPath, PortalData, Bidder, Tender, AuditLogEntry } from './types';
import { INITIAL_PORTALS, TENDERS, BIDDERS, INITIAL_AUDIT_LOGS } from './data/portalData';
import { formatGovTimestamp } from './utils/format';
import { reverifyPortal, verifyAllPortals, DEFAULT_GATEWAY_CONFIG, GatewayConfig } from './services/gateway';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PortalVerificationScreen } from './components/screens/PortalVerificationScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { TendersScreen } from './components/screens/TendersScreen';
import { BiddersScreen } from './components/screens/BiddersScreen';
import { AiVerificationScreen } from './components/screens/AiVerificationScreen';
import { ComplianceChecksScreen } from './components/screens/ComplianceChecksScreen';
import { RiskAnalysisScreen } from './components/screens/RiskAnalysisScreen';
import { BidComparisonScreen } from './components/screens/BidComparisonScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { AuditTrailScreen } from './components/screens/AuditTrailScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

export default function App() {
  const [currentPath, setCurrentPath] = useState<NavPath>('portal-verification');
  const [portals, setPortals] = useState<Record<string, PortalData>>(INITIAL_PORTALS);
  const [activeTender, setActiveTender] = useState<Tender>(TENDERS[0]);
  const [selectedBidder, setSelectedBidder] = useState<Bidder>(BIDDERS[0]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [verifyingPortals, setVerifyingPortals] = useState<Record<string, boolean>>({});
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getFormattedTimestamp = () => formatGovTimestamp(new Date());

  const getGatewayConfig = (): GatewayConfig => {
    try {
      const raw = localStorage.getItem('bidsure_gateway_config');
      if (raw) {
        const parsed = JSON.parse(raw) as { sandboxMode?: boolean; strictMiiFilter?: boolean; latencyThrottle?: number };
        return {
          mode: parsed.sandboxMode === false ? 'live' : 'sandbox',
          baseUrl: DEFAULT_GATEWAY_CONFIG.baseUrl,
          latencyThrottleMs: parsed.latencyThrottle ?? DEFAULT_GATEWAY_CONFIG.latencyThrottleMs,
          strictMii: parsed.strictMiiFilter ?? DEFAULT_GATEWAY_CONFIG.strictMii,
        };
      }
    } catch {
      /* ignore */
    }
    return DEFAULT_GATEWAY_CONFIG;
  };

  const handleReverifyPortal = async (portalId: string) => {
    setVerifyingPortals((prev) => ({ ...prev, [portalId]: true }));
    try {
      const cfg = getGatewayConfig();
      const { portals: nextPortals, log } = await reverifyPortal(portals, portalId, selectedBidder, activeTender, cfg);
      setPortals(nextPortals);
      setAuditLogs((prev) => [log, ...prev]);
    } finally {
      setVerifyingPortals((prev) => ({ ...prev, [portalId]: false }));
    }
  };

  const handleVerifyAll = async () => {
    setIsVerifyingAll(true);
    try {
      const cfg = getGatewayConfig();
      const { portals: nextPortals, log } = await verifyAllPortals(portals, activeTender, cfg);
      setPortals(nextPortals);
      setAuditLogs((prev) => [log, ...prev]);
    } finally {
      setIsVerifyingAll(false);
    }
  };

  const handleBidderChange = (newBidder: Bidder) => {
    setSelectedBidder(newBidder);

    // Update portal request schemas with new bidder's credentials
    setPortals((prev) => {
      const updated = { ...prev };
      if (updated.gem) {
        updated.gem = {
          ...updated.gem,
          req: {
            ...updated.gem.req,
            bidderIdentifier: {
              cin: newBidder.cin,
              pan: newBidder.pan,
              gstin: newBidder.gstin,
              gemSellerId: newBidder.gemSellerId
            }
          },
          res: {
            ...updated.gem.res,
            data: {
              ...updated.gem.res.data,
              organizationName: newBidder.name
            }
          }
        };
      }
      if (updated.pan) {
        updated.pan = {
          ...updated.pan,
          req: {
            pan: newBidder.pan,
            entityName: newBidder.name
          }
        };
      }
      if (updated.mca) {
        updated.mca = {
          ...updated.mca,
          req: {
            cin: newBidder.cin
          },
          res: {
            ...updated.mca.res,
            cin: newBidder.cin
          }
        };
      }
      if (updated.dpiit) {
        updated.dpiit = {
          ...updated.dpiit,
          req: {
            ...updated.dpiit.req,
            bidderCin: newBidder.cin,
            declaredLocalContentPercent: newBidder.miiPercentage
          },
          res: {
            ...updated.dpiit.res,
            declaredContentPercent: newBidder.miiPercentage,
            auditResult: newBidder.miiPercentage >= activeTender.miiRequiredPercent ? 'PASSED' : 'DISCREPANCY_FLAG'
          },
          status: newBidder.miiPercentage >= activeTender.miiRequiredPercent ? 'connected' : 'audit_flag',
          statusDetail:
            newBidder.miiPercentage >= activeTender.miiRequiredPercent
              ? `Compliant (${newBidder.miiPercentage}% declared vs ${activeTender.miiRequiredPercent}% required)`
              : `Self-Declaration Audit Flag (${newBidder.miiPercentage}% declared vs ${activeTender.miiRequiredPercent}% tender requirement)`
        };
      }
      return updated;
    });
  };

  const handleSelectTender = (tender: Tender) => {
    setActiveTender(tender);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Top Navbar – replaces left sidebar (no horizontal overlap) */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => setCurrentPath(path)}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onToggleMobile={() => setMobileMenuOpen((v) => !v)}
      />

      {/* Main Content Area – starts AFTER navbar, no left sidebar offset */}
      <div className="pt-navbar-height min-h-screen flex flex-col w-full max-w-full">
        {/* Fixed Header below navbar */}
        <Header
          tenders={TENDERS}
          activeTender={activeTender}
          onSelectTender={handleSelectTender}
          onOpenMobileMenu={() => setMobileMenuOpen((v) => !v)}
        />

        {/* Dynamic Screen View – offset for fixed header */}
        <main className="w-full max-w-full pt-header-height px-gutter-md lg:px-container-padding bg-surface min-h-screen overflow-x-hidden">
          {currentPath === 'portal-verification' && (
            <PortalVerificationScreen
              portals={portals}
              selectedBidder={selectedBidder}
              activeTender={activeTender}
              auditLogs={auditLogs}
              onReverifyPortal={handleReverifyPortal}
              onVerifyAll={handleVerifyAll}
              isVerifyingAll={isVerifyingAll}
              verifyingPortals={verifyingPortals}
              onBidderChange={handleBidderChange}
              allBidders={BIDDERS}
            />
          )}

          {currentPath === 'dashboard' && (
            <DashboardScreen
              onNavigate={(path) => setCurrentPath(path)}
              activeTender={activeTender}
              bidders={BIDDERS}
            />
          )}

          {currentPath === 'tenders' && (
            <TendersScreen
              tenders={TENDERS}
              activeTender={activeTender}
              onSelectTender={handleSelectTender}
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}

          {currentPath === 'bidders' && (
            <BiddersScreen
              bidders={BIDDERS}
              selectedBidder={selectedBidder}
              onSelectBidder={handleBidderChange}
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}

          {currentPath === 'ai-verification' && (
            <AiVerificationScreen
              selectedBidder={selectedBidder}
              activeTender={activeTender}
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}

          {currentPath === 'compliance-checks' && (
            <ComplianceChecksScreen
              selectedBidder={selectedBidder}
              activeTender={activeTender}
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}

          {currentPath === 'risk-analysis' && (
            <RiskAnalysisScreen
              bidders={BIDDERS}
              activeTender={activeTender}
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}

          {currentPath === 'bid-comparison' && (
            <BidComparisonScreen
              bidders={BIDDERS}
              activeTender={activeTender}
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}

          {currentPath === 'reports' && (
            <ReportsScreen
              selectedBidder={selectedBidder}
              activeTender={activeTender}
              portals={portals}
            />
          )}

          {currentPath === 'audit-trail' && (
            <AuditTrailScreen
              logs={auditLogs}
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}

          {currentPath === 'settings' && (
            <SettingsScreen
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
