export type ViewMode = 'evaluator' | 'client';

export type NavPath = 
  | 'dashboard'
  | 'tenders'
  | 'bidders'
  | 'ai-verification'
  | 'compliance-checks'
  | 'portal-verification'
  | 'risk-analysis'
  | 'bid-comparison'
  | 'reports'
  | 'audit-trail'
  | 'settings'
  | 'client-dashboard'
  | 'client-upload'
  | 'client-report'
  | 'client-queries';

export type PortalPayload = Record<string, unknown>;

export interface PortalData {
  id: string;
  name: string;
  shortName: string;
  agency: string;
  iconName: string;
  timestamp: string;
  status: 'connected' | 'audit_flag' | 'disconnected' | 'exempted';
  statusLabel: string;
  statusDetail: string;
  isFlagged?: boolean;
  isExempt?: boolean;
  responseTime: string;
  endpoint: string;
  url: string;
  req: PortalPayload;
  res: PortalPayload;
  lastVerified?: string;
  category: 'tax' | 'corporate' | 'labor' | 'standards' | 'procurement' | 'identity';
}

export interface Bidder {
  id: string;
  name: string;
  cin: string;
  pan: string;
  gstin: string;
  gemSellerId: string;
  tenderId: string;
  status: 'Verified' | 'Audit Flag' | 'Under Review' | 'Disqualified';
  riskScore: number;
  miiPercentage: number;
  msmeCategory: string;
  registeredState: string;
  incorporationYear: number;
  annualTurnover: string;
}

export interface Tender {
  id: string;
  title: string;
  code: string;
  category: string;
  department: string;
  estimatedValue: string;
  miiRequiredPercent: number;
  msmeExemptionAllowed: boolean;
  startDate: string;
  closingDate: string;
  status: 'Active' | 'Under Evaluation' | 'Awarded' | 'Cancelled';
  biddersCount: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officer: string;
  portal: string;
  action: string;
  status: 'SUCCESS' | 'FLAG' | 'NOTICE';
  latency: string;
  sha256Digest: string;
}

export interface ClientDocument {
  id: string;
  name: string;
  category: 'financial' | 'tax' | 'corporate' | 'technical' | 'emd';
  categoryLabel: string;
  sizeFormatted: string;
  mimeType: string;
  uploadTimestamp: string;
  sha256Hash: string;
  status: 'processing' | 'validated' | 'flagged' | 'rejected';
  extractedData?: {
    pan?: string;
    gstin?: string;
    cin?: string;
    declaredMiiPercent?: number;
    turnoverAmount?: string;
  };
  validationMessage?: string;
  ocrRawText?: string;
  fileDataUrl?: string;
}

export interface ClientTicketMessage {
  id: string;
  sender: 'Client' | 'Procurement Officer' | 'AI Assistant';
  senderRole?: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

export interface ClientTicket {
  id: string;
  ticketNumber: string;
  type: 'Query' | 'Grievance' | 'Audit Appeal';
  tenderId: string;
  tenderCode: string;
  subject: string;
  description: string;
  category: string;
  status: 'Open' | 'Under Review' | 'Information Requested' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdAt: string;
  updatedAt: string;
  messages: ClientTicketMessage[];
}

