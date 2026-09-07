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
  | 'settings';

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
  req: Record<string, any>;
  res: Record<string, any>;
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
