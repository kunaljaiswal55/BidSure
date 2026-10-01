import React from 'react';
import { Bidder, Tender, ClientDocument, ClientTicket, NavPath } from '../../types';

interface ClientDashboardScreenProps {
  clientBidder: Bidder;
  activeTender: Tender;
  documents: ClientDocument[];
  tickets: ClientTicket[];
  onNavigate: (path: NavPath) => void;
}

export const ClientDashboardScreen: React.FC<ClientDashboardScreenProps> = ({
  clientBidder,
  activeTender,
  documents,
  tickets,
  onNavigate,
}) => {
  const validatedDocsCount = documents.filter((d) => d.status === 'validated').length;
  const processingDocsCount = documents.filter((d) => d.status === 'processing').length;
  const flaggedDocsCount = documents.filter((d) => d.status === 'flagged' || d.status === 'rejected').length;

  const openTicketsCount = tickets.filter((t) => t.status === 'Open' || t.status === 'Under Review' || t.status === 'Information Requested').length;

  return (
    <div className="space-y-8 py-4 pb-16">
      {/* Top Banner: Client Header */}
      <div className="bg-gradient-to-r from-surface-container-high via-surface-container-highest to-surface-container border border-outline-variant/30 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-3xl">corporate_fare</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary/20">
                  Client / Vendor Portal
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-medium px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Verified GeM Seller
                </span>
              </div>
              <h1 className="text-2xl font-bold text-on-surface mt-1.5">{clientBidder.name}</h1>
              <p className="text-sm text-on-surface-variant flex items-center gap-4 mt-1 flex-wrap">
                <span>CIN: <strong className="text-on-surface font-mono">{clientBidder.cin}</strong></span>
                <span>PAN: <strong className="text-on-surface font-mono">{clientBidder.pan}</strong></span>
                <span>GSTIN: <strong className="text-on-surface font-mono">{clientBidder.gstin}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('client-upload')}
              className="bg-primary hover:bg-primary/90 text-on-primary font-medium text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-primary/10"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              Upload Documents
            </button>
            <button
              onClick={() => onNavigate('client-report')}
              className="bg-surface-container-highest hover:bg-surface-container text-on-surface font-medium text-sm px-4 py-2.5 rounded-xl border border-outline-variant/30 flex items-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
              View Report
            </button>
          </div>
        </div>
      </div>

      {/* Tender Application Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">gavel</span>
          </div>
          <div>
            <div className="text-xs text-on-surface-variant font-medium">Currently Bidding For Tender</div>
            <div className="text-base font-semibold text-on-surface">{activeTender.title}</div>
            <div className="text-xs text-on-surface-variant flex items-center gap-3 mt-0.5">
              <span>Code: <strong className="text-on-surface font-mono">{activeTender.code}</strong></span>
              <span>Dept: {activeTender.department}</span>
              <span>Required MII: <strong className="text-emerald-400">{activeTender.miiRequiredPercent}%</strong></span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
          <span className="text-xs text-on-surface-variant">Closing Date: <strong className="text-on-surface">{activeTender.closingDate}</strong></span>
          <span className="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 rounded-lg border border-amber-500/20 font-medium">
            Active Evaluation
          </span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 hover:border-outline-variant/40 transition-all">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Document Vault</span>
            <span className="material-symbols-outlined text-primary text-xl">folder_zip</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">{documents.length} Files</div>
          <div className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            {validatedDocsCount} Validated & SHA-256 Hashed
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 hover:border-outline-variant/40 transition-all">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Compliance Index</span>
            <span className="material-symbols-outlined text-emerald-400 text-xl">verified_user</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">94 / 100</div>
          <div className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            High Pre-Qualification Score
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 hover:border-outline-variant/40 transition-all">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">MII Local Content</span>
            <span className="material-symbols-outlined text-secondary text-xl">flag</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">{clientBidder.miiPercentage}% Declared</div>
          <div className="text-xs text-on-surface-variant font-medium mt-1">
            Tender Minimum: {activeTender.miiRequiredPercent}% ({clientBidder.miiPercentage >= activeTender.miiRequiredPercent ? 'Pass' : 'Flag'})
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 hover:border-outline-variant/40 transition-all">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Queries & Grievances</span>
            <span className="material-symbols-outlined text-amber-400 text-xl">help_outline</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">{tickets.length} Tickets</div>
          <div className="text-xs text-amber-400 font-medium mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">pending</span>
            {openTicketsCount} Under Active Resolution
          </div>
        </div>
      </div>

      {/* Two Column Layout: Application Checklist & Recent Grievances / Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Application Document Checklist */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-on-surface">Tender Submission Checklist</h2>
              <p className="text-xs text-on-surface-variant">Real-time status of required bid verification artifacts</p>
            </div>
            <button
              onClick={() => onNavigate('client-upload')}
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              Upload More <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container/50 border border-outline-variant/15 hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
                    <span className="material-symbols-outlined text-lg">
                      {doc.category === 'financial' ? 'payments' : doc.category === 'tax' ? 'receipt_long' : doc.category === 'corporate' ? 'domain' : 'description'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-on-surface truncate max-w-[280px] sm:max-w-xs">{doc.name}</div>
                    <div className="text-xs text-on-surface-variant flex items-center gap-2">
                      <span>{doc.categoryLabel}</span>
                      <span>•</span>
                      <span>{doc.sizeFormatted}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {doc.status === 'validated' && (
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-lg border border-emerald-500/20 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Validated
                    </span>
                  )}
                  {doc.status === 'processing' && (
                    <span className="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 rounded-lg border border-amber-500/20 font-medium flex items-center gap-1 animate-pulse">
                      <span className="material-symbols-outlined text-[14px]">sync</span>
                      AI Scanning
                    </span>
                  )}
                  {doc.status === 'flagged' && (
                    <span className="bg-rose-500/10 text-rose-400 text-xs px-2.5 py-1 rounded-lg border border-rose-500/20 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      Flagged
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Support & Complaints Overview */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-on-surface">Queries & Grievances</h2>
                <p className="text-xs text-on-surface-variant">Active support tickets and appeals</p>
              </div>
              <button
                onClick={() => onNavigate('client-queries')}
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
              >
                All Tickets <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="space-y-3">
              {tickets.map((tkt) => (
                <div
                  key={tkt.id}
                  onClick={() => onNavigate('client-queries')}
                  className="p-3.5 rounded-xl bg-surface-container/50 border border-outline-variant/15 hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-primary">{tkt.ticketNumber}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        tkt.status === 'Resolved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {tkt.status}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-on-surface line-clamp-1">{tkt.subject}</div>
                  <div className="text-xs text-on-surface-variant flex items-center justify-between mt-2">
                    <span>Type: {tkt.type}</span>
                    <span>Updated {tkt.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/15 flex items-center justify-between">
            <div className="text-xs text-on-surface-variant">
              Need assistance with RFP specifications or audit flags?
            </div>
            <button
              onClick={() => onNavigate('client-queries')}
              className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium px-3 py-1.5 rounded-lg border border-outline-variant/20 flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[14px]">support_agent</span>
              New Grievance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
