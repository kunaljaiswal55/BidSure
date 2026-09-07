/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavPath, PortalData, Bidder, Tender, AuditLogEntry } from './types';
import { INITIAL_PORTALS, TENDERS, BIDDERS, INITIAL_AUDIT_LOGS } from './data/portalData';
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

  // Format current date/time in authentic government timestamp format: "07 Sep 2026, 08:14 PM"
  const getFormattedTimestamp = () => {
    const d = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear() + 2; // Keep in 2026 era matching prototype
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, '0');
    return `${day} ${month} ${year}, ${strHours}:${minutes} ${ampm}`;
  };

  const handleReverifyPortal = (portalId: string) => {
    setVerifyingPortals((prev) => ({ ...prev, [portalId]: true }));

    setTimeout(() => {
      const nowFormatted = getFormattedTimestamp();
      const randomLatency = Math.floor(110 + Math.random() * 95) + 'ms';

      setPortals((prev) => {
        const existing = prev[portalId];
        if (!existing) return prev;
        return {
          ...prev,
          [portalId]: {
            ...existing,
            timestamp: nowFormatted,
            responseTime: randomLatency,
            req: {
              ...existing.req,
              meta: {
                ...existing.req.meta,
                timestamp: new Date().toISOString()
              }
            }
          }
        };
      });

      // Add to audit trail
      const newLog: AuditLogEntry = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: nowFormatted,
        officer: 'R. Sharma (JS-Proc.)',
        portal: portals[portalId]?.shortName || portalId.toUpperCase(),
        action: `Live API Re-Verification query completed for ${selectedBidder.name}`,
        status: portalId === 'dpiit' ? 'FLAG' : 'SUCCESS',
        latency: randomLatency,
        sha256Digest: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      };

      setAuditLogs((prev) => [newLog, ...prev]);
      setVerifyingPortals((prev) => ({ ...prev, [portalId]: false }));
    }, 600);
  };

  const handleVerifyAll = () => {
    setIsVerifyingAll(true);

    setTimeout(() => {
      const nowFormatted = getFormattedTimestamp();
      setPortals((prev) => {
        const next: Record<string, PortalData> = {};
        Object.keys(prev).forEach((key) => {
          const item = prev[key];
          const randomLatency = Math.floor(105 + Math.random() * 90) + 'ms';
          next[key] = {
            ...item,
            timestamp: nowFormatted,
            responseTime: randomLatency
          };
        });
        return next;
      });

      const batchLog: AuditLogEntry = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: nowFormatted,
        officer: 'R. Sharma (JS-Proc.)',
        portal: 'Batch Gateway (13 Nodes)',
        action: `Batch Multi-Portal Sync executed across all sovereign endpoints for tender ${activeTender.code}`,
        status: 'SUCCESS',
        latency: '178ms (Avg)',
        sha256Digest: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      };

      setAuditLogs((prev) => [batchLog, ...prev]);
      setIsVerifyingAll(false);
    }, 1200);
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
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => setCurrentPath(path)}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area (shifted right by sidebar on desktop) */}
      <div className="lg:pl-sidebar-width-expanded min-h-screen flex flex-col">
        {/* Fixed Header */}
        <Header
          tenders={TENDERS}
          activeTender={activeTender}
          onSelectTender={handleSelectTender}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Dynamic Screen View */}
        <main className="w-full pt-header-height px-gutter-md lg:px-container-padding bg-surface min-h-screen">
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
