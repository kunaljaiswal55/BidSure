import React, { useState } from 'react';
import { ClientTicket, Tender, Bidder, NavPath } from '../../types';

interface ClientQueriesScreenProps {
  tickets: ClientTicket[];
  onAddTicket: (ticket: ClientTicket) => void;
  onAddMessage: (ticketId: string, messageText: string) => void;
  activeTender: Tender;
  clientBidder: Bidder;
  onNavigate: (path: NavPath) => void;
}

export const ClientQueriesScreen: React.FC<ClientQueriesScreenProps> = ({
  tickets,
  onAddTicket,
  onAddMessage,
  activeTender,
  clientBidder,
  onNavigate,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Open' | 'Resolved'>('All');
  const [replyText, setReplyText] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicketType, setNewTicketType] = useState<ClientTicket['type']>('Grievance');
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('MII Local Content Verification');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<ClientTicket['priority']>('High');

  // AI Chat Assistant state
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiQueryText, setAiQueryText] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello ${clientBidder.name}! I am the BidSure AI Procurement Assistant. How can I help you with RFP guidelines, audit flag appeals, or statutory compliance?`,
    },
  ]);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'Open') return t.status !== 'Resolved' && t.status !== 'Closed';
    if (filterStatus === 'Resolved') return t.status === 'Resolved' || t.status === 'Closed';
    return true;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    onAddMessage(selectedTicket.id, replyText.trim());
    setReplyText('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const newTicket: ClientTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-2026-0${Math.floor(Math.random() * 900 + 100)}`,
      type: newTicketType,
      tenderId: activeTender.id,
      tenderCode: activeTender.code,
      subject: newSubject.trim(),
      description: newDescription.trim(),
      category: newCategory,
      status: 'Under Review',
      priority: newPriority,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'Client',
          senderRole: `${clientBidder.name} (Bidder)`,
          message: newDescription.trim(),
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        },
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'AI Assistant',
          senderRole: 'BidSure Ticket Auto-Ack',
          message: `Ticket received and registered under ${activeTender.code}. Procurement Officer assigned to evaluate under SLA (24 Hours).`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        },
      ],
    };

    onAddTicket(newTicket);
    setSelectedTicketId(newTicket.id);
    setIsModalOpen(false);
    setNewSubject('');
    setNewDescription('');
  };

  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQueryText.trim()) return;

    const q = aiQueryText.trim();
    setAiMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setAiQueryText('');

    setTimeout(() => {
      let resp = `According to Procurement General Financial Rules (GFR 2017) and GeM guidelines, statutory declarations attested by a Chartered Accountant are accepted for verification.`;
      if (q.toLowerCase().includes('mii') || q.toLowerCase().includes('local content')) {
        resp = `For Tender ${activeTender.code}, the minimum required Make-in-India (MII) local content is ${activeTender.miiRequiredPercent}%. If your declaration was flagged, please submit a CA-attested local content breakup sheet via the Grievances tab.`;
      } else if (q.toLowerCase().includes('turnover') || q.toLowerCase().includes('msme')) {
        resp = `MSME registered entities under Udyam Registration are entitled to exemption from prior turnover and experience criteria, provided they satisfy technical quality specifications.`;
      }
      setAiMessages((prev) => [...prev, { sender: 'ai', text: resp }]);
    }, 800);
  };

  return (
    <div className="space-y-8 py-4 pb-16">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Grievance & Query Support Center
            </span>
            <span className="text-xs text-on-surface-variant font-mono">Tender: {activeTender.code}</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface mt-1">Designated Complaints, Appeals & RFP Queries</h1>
          <p className="text-sm text-on-surface-variant">
            Direct communication channel with procurement officers, audit appeal committee, and AI support bot.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setAiChatOpen((v) => !v)}
            className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-sm font-medium px-4 py-2.5 rounded-xl border border-outline-variant/30 flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
            AI Procurement Bot
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-on-primary font-medium text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-primary/10"
          >
            <span className="material-symbols-outlined text-[18px]">add_comment</span>
            File New Ticket
          </button>
        </div>
      </div>

      {/* Main Grid: Ticket List (Left) & Ticket Detail Thread (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List Panel */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-4 flex flex-col h-[650px]">
          {/* Filters */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/15">
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Tickets ({tickets.length})</span>
            <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg">
              {(['All', 'Open', 'Resolved'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-all ${
                    filterStatus === st ? 'bg-surface-container-high text-on-surface font-semibold shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* List Scroll */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredTickets.map((tkt) => {
              const isSelected = selectedTicket && selectedTicket.id === tkt.id;
              return (
                <div
                  key={tkt.id}
                  onClick={() => setSelectedTicketId(tkt.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-on-surface shadow-xs'
                      : 'bg-surface-container/30 border-outline-variant/15 text-on-surface-variant hover:bg-surface-container/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-primary">{tkt.ticketNumber}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        tkt.status === 'Resolved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {tkt.status}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-on-surface line-clamp-1">{tkt.subject}</div>
                  
                  <div className="flex items-center justify-between text-[10px] text-on-surface-variant mt-2">
                    <span className="bg-surface-container-high px-2 py-0.5 rounded">{tkt.type}</span>
                    <span>Updated {tkt.updatedAt.slice(5)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket Thread Panel */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 flex flex-col h-[650px]">
          {selectedTicket ? (
            <>
              {/* Thread Header */}
              <div className="pb-4 mb-4 border-b border-outline-variant/15 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className="text-xs font-medium text-on-surface-variant">Type: {selectedTicket.type}</span>
                    <span className="text-xs text-on-surface-variant">•</span>
                    <span className="text-xs text-on-surface-variant">{selectedTicket.category}</span>
                  </div>
                  <h2 className="text-lg font-bold text-on-surface mt-1">{selectedTicket.subject}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                      selectedTicket.status === 'Resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    Status: {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Messages Scroll View */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                {selectedTicket.messages.map((msg) => {
                  const isClient = msg.sender === 'Client';
                  const isAi = msg.sender === 'AI Assistant';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${isClient ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mb-1 px-1">
                        <span className="font-semibold text-on-surface">{msg.senderRole || msg.sender}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed ${
                          isClient
                            ? 'bg-primary text-on-primary rounded-tr-xs shadow-sm'
                            : isAi
                            ? 'bg-secondary/10 border border-secondary/20 text-on-surface rounded-tl-xs'
                            : 'bg-surface-container-high border border-outline-variant/20 text-on-surface rounded-tl-xs'
                        }`}
                      >
                        {msg.message}

                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">attach_file</span>
                            <span className="font-mono text-[10px] underline">{msg.attachments.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-outline-variant/15 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your response or add clarification..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="bg-primary hover:bg-primary/90 text-on-primary font-medium text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 transition-all disabled:opacity-50 shrink-0"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  Send Reply
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant text-center p-8">
              <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
              <p className="text-sm font-medium">Select a ticket to view conversation details</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Bot Side Drawer Modal */}
      {aiChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col h-[480px]">
          <div className="bg-surface-container-high px-4 py-3 border-b border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
              <span className="text-xs font-bold text-on-surface">BidSure AI Procurement Assistant</span>
            </div>
            <button onClick={() => setAiChatOpen(false)} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {aiMessages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl text-xs ${
                  m.sender === 'user' ? 'bg-primary text-on-primary ml-auto max-w-[85%]' : 'bg-surface-container text-on-surface mr-auto max-w-[90%]'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendAiMessage} className="p-3 border-t border-outline-variant/20 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about MII rules, GFR 2017, exemptions..."
              value={aiQueryText}
              onChange={(e) => setAiQueryText(e.target.value)}
              className="flex-1 bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
            />
            <button type="submit" className="bg-primary text-on-primary p-2 rounded-lg text-xs">
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </form>
        </div>
      )}

      {/* New Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="text-base font-bold text-on-surface">File New Complaint / RFP Query</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Ticket Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Grievance', 'Query', 'Audit Appeal'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewTicketType(t)}
                      className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                        newTicketType === t
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-surface-container/40 border-outline-variant/20 text-on-surface-variant'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Subject / Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Appeal against MII local content audit flag"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="MII Local Content Verification">MII Local Content Verification</option>
                  <option value="Financial & CA Certificate Discrepancy">Financial & CA Certificate Discrepancy</option>
                  <option value="Statutory Tax Portal Sync (GST/PAN)">Statutory Tax Portal Sync (GST/PAN)</option>
                  <option value="Technical Specifications & RFP Clauses">Technical Specifications & RFP Clauses</option>
                  <option value="EMD / Bank Guarantee Verification">EMD / Bank Guarantee Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Detailed Description & References</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide complete details, document reference numbers, or rationale..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-on-surface-variant hover:bg-surface-container rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-on-primary font-medium text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary/10"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
