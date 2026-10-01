/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavPath, ViewMode, PortalData, Bidder, Tender, AuditLogEntry, ClientDocument, ClientTicket } from './types';
import { INITIAL_PORTALS, TENDERS, BIDDERS, INITIAL_AUDIT_LOGS } from './data/portalData';
import { INITIAL_CLIENT_DOCUMENTS, INITIAL_CLIENT_TICKETS } from './data/clientPortalData';
import { formatGovTimestamp } from './utils/format';
import { reverifyPortal, verifyAllPortals, DEFAULT_GATEWAY_CONFIG, GatewayConfig } from './services/gateway';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Evaluator Screens
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

// Client Screens
import { ClientDashboardScreen } from './components/screens/ClientDashboardScreen';
import { ClientUploadScreen } from './components/screens/ClientUploadScreen';
import { ClientReportScreen } from './components/screens/ClientReportScreen';
import { ClientQueriesScreen } from './components/screens/ClientQueriesScreen';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('evaluator');
  const [currentPath, setCurrentPath] = useState<NavPath>('portal-verification');
  const [portals, setPortals] = useState<Record<string, PortalData>>(INITIAL_PORTALS);
  const [activeTender, setActiveTender] = useState<Tender>(TENDERS[0]);
  const [selectedBidder, setSelectedBidder] = useState<Bidder>(BIDDERS[0]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [verifyingPortals, setVerifyingPortals] = useState<Record<string, boolean>>({});
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Client Portal State
  const [clientDocuments, setClientDocuments] = useState<ClientDocument[]>(INITIAL_CLIENT_DOCUMENTS);
  const [clientTickets, setClientTickets] = useState<ClientTicket[]>(INITIAL_CLIENT_TICKETS);

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

  const handleToggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'client') {
      setCurrentPath('client-dashboard');
    } else {
      setCurrentPath('portal-verification');
    }
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

  // Client Handlers
  const handleUploadDocument = (doc: ClientDocument) => {
    setClientDocuments((prev) => [doc, ...prev]);
  };

  const handleRemoveDocument = (docId: string) => {
    setClientDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleAddTicket = (ticket: ClientTicket) => {
    setClientTickets((prev) => [ticket, ...prev]);
  };

  const handleAddTicketMessage = (ticketId: string, messageText: string) => {
    setClientTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: 'Client' as const,
            senderRole: `${selectedBidder.name} (Bidder)`,
            message: messageText,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
          return {
            ...t,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Top Navbar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => setCurrentPath(path)}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onToggleMobile={() => setMobileMenuOpen((v) => !v)}
      />

      {/* Main Content Area */}
      <div className="pt-navbar-height min-h-screen flex flex-col w-full max-w-full">
        {/* Fixed Header below navbar */}
        <Header
          tenders={TENDERS}
          activeTender={activeTender}
          onSelectTender={handleSelectTender}
          onOpenMobileMenu={() => setMobileMenuOpen((v) => !v)}
        />

        {/* Dynamic Screen View */}
        <main className="w-full max-w-full pt-header-height px-gutter-md lg:px-container-padding bg-surface min-h-screen overflow-x-hidden">
          {/* Evaluator Screens */}
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

          {/* Client Screens */}
          {currentPath === 'client-dashboard' && (
            <ClientDashboardScreen
              clientBidder={selectedBidder}
              activeTender={activeTender}
              documents={clientDocuments}
              tickets={clientTickets}
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}

          {currentPath === 'client-upload' && (
            <ClientUploadScreen
              documents={clientDocuments}
              onUploadDocument={handleUploadDocument}
              onRemoveDocument={handleRemoveDocument}
              activeTender={activeTender}
              clientBidder={selectedBidder}
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}

          {currentPath === 'client-report' && (
            <ClientReportScreen
              clientBidder={selectedBidder}
              activeTender={activeTender}
              portals={portals}
              documents={clientDocuments}
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}

          {currentPath === 'client-queries' && (
            <ClientQueriesScreen
              tickets={clientTickets}
              onAddTicket={handleAddTicket}
              onAddMessage={handleAddTicketMessage}
              activeTender={activeTender}
              clientBidder={selectedBidder}
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
