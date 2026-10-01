import { ClientDocument, ClientTicket } from '../types';

export const INITIAL_CLIENT_DOCUMENTS: ClientDocument[] = [
  {
    id: 'doc-001',
    name: 'CA_Certified_Turnover_Cert_FY24-25.pdf',
    category: 'financial',
    categoryLabel: 'Financial Certificate',
    sizeFormatted: '2.4 MB',
    mimeType: 'application/pdf',
    uploadTimestamp: '2026-09-22 14:30',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'validated',
    extractedData: {
      turnoverAmount: '₹ 18.5 Crore',
      cin: 'U72200MP2015PTC034112',
    },
    validationMessage: 'Successfully verified against ICAI Portal registry hash.'
  },
  {
    id: 'doc-002',
    name: 'DPIIT_MII_Local_Content_Self_Declaration.pdf',
    category: 'corporate',
    categoryLabel: 'DPIIT MII Certificate',
    sizeFormatted: '1.8 MB',
    mimeType: 'application/pdf',
    uploadTimestamp: '2026-09-23 10:15',
    sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    status: 'validated',
    extractedData: {
      declaredMiiPercent: 68,
      cin: 'U72200MP2015PTC034112',
    },
    validationMessage: 'Local Content 68% exceeds mandatory requirement (60%).'
  },
  {
    id: 'doc-003',
    name: 'GST_Return_GSTR3B_Q1_2026.pdf',
    category: 'tax',
    categoryLabel: 'Tax & Statutory',
    sizeFormatted: '3.1 MB',
    mimeType: 'application/pdf',
    uploadTimestamp: '2026-09-23 11:45',
    sha256Hash: 'a204000305e557b77f9e8a7ef9f2571239c4d9fa24d1a581451f22e37e954efc',
    status: 'validated',
    extractedData: {
      gstin: '23AAECT1234F1Z8',
      pan: 'AAECT1234F'
    },
    validationMessage: 'GSTN Portal API confirmed active filing status without tax arrears.'
  },
  {
    id: 'doc-004',
    name: 'EMD_Bank_Guarantee_SBI_2026.pdf',
    category: 'emd',
    categoryLabel: 'EMD / Deposit Proof',
    sizeFormatted: '1.2 MB',
    mimeType: 'application/pdf',
    uploadTimestamp: '2026-09-24 09:00',
    sha256Hash: '43997c11f7c20c0fa90a174092b6a67f08c5c567845f7f95085e353243ddf3aa',
    status: 'validated',
    validationMessage: 'Bank Guarantee verified via SFMS (Structured Financial Messaging System).'
  },
  {
    id: 'doc-005',
    name: 'Technical_Specification_Compliance_Matrix.xlsx',
    category: 'technical',
    categoryLabel: 'Technical Matrix',
    sizeFormatted: '4.5 MB',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTimestamp: '2026-09-24 12:20',
    sha256Hash: '91d5f3089fae15f27fa008892f2545d625b01859c2288339b168691b0559fef1',
    status: 'processing',
    validationMessage: 'AI OCR scanning technical compliance criteria against RFP Annexure-B.'
  }
];

export const INITIAL_CLIENT_TICKETS: ClientTicket[] = [
  {
    id: 'tkt-101',
    ticketNumber: 'TKT-2026-0042',
    type: 'Grievance',
    tenderId: 'TND-2026-8841',
    tenderCode: 'GEM/2026/B/884192',
    subject: 'Appeal against MII Self-Declaration Audit Flag',
    description: 'Our MII local content declaration was flagged during automated verification. We have uploaded the revised auditor certificate confirming 68% domestic value addition.',
    category: 'MII Local Content Verification',
    status: 'Under Review',
    priority: 'High',
    createdAt: '2026-09-23 16:30',
    updatedAt: '2026-09-24 10:15',
    messages: [
      {
        id: 'msg-1',
        sender: 'Client',
        senderRole: 'Apex Tech Solutions (Bidder)',
        message: 'Respected Procurement Officer, our automated verification returned an audit flag for MII percentage. We have attached our CA-attested local content breakup sheet confirming 68% local content.',
        timestamp: '2026-09-23 16:30',
        attachments: ['CA_MII_Breakup_Signed.pdf']
      },
      {
        id: 'msg-2',
        sender: 'Procurement Officer',
        senderRole: 'Senior Evaluation Officer, GeM Cell',
        message: 'Ticket received. We are running the document hash against DPIIT Gateway API for re-validation. Will update status within 24 hours.',
        timestamp: '2026-09-24 10:15'
      }
    ]
  },
  {
    id: 'tkt-102',
    ticketNumber: 'TKT-2026-0038',
    type: 'Query',
    tenderId: 'TND-2026-8841',
    tenderCode: 'GEM/2026/B/884192',
    subject: 'Clarification on ISO 27001 Certification Validity Date',
    description: 'Please clarify if ISO 27001:2022 recertification under process is acceptable alongside existing ISO 27001:2013 certificate.',
    category: 'Technical Specifications & Certifications',
    status: 'Resolved',
    priority: 'Medium',
    createdAt: '2026-09-21 11:00',
    updatedAt: '2026-09-22 09:30',
    messages: [
      {
        id: 'msg-3',
        sender: 'Client',
        senderRole: 'Apex Tech Solutions (Bidder)',
        message: 'Could you please confirm if a copy of the audit renewal receipt is required alongside ISO 27001:2013?',
        timestamp: '2026-09-21 11:00'
      },
      {
        id: 'msg-4',
        sender: 'AI Assistant',
        senderRole: 'BidSure Compliance Bot',
        message: 'Per RFP Clause 4.2.1, candidates with valid ISO 27001:2013 plus an active audit extension receipt from an NABCB accredited agency meet pre-qualification criteria.',
        timestamp: '2026-09-21 11:02'
      },
      {
        id: 'msg-5',
        sender: 'Procurement Officer',
        senderRole: 'GeM Procurement Cell',
        message: 'Confirmed. Upload the extension receipt in the Document Upload Vault under Technical Certificates.',
        timestamp: '2026-09-22 09:30'
      }
    ]
  }
];
