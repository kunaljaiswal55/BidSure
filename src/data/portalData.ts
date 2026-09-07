import { PortalData, Bidder, Tender, AuditLogEntry } from '../types';

export const INITIAL_PORTALS: Record<string, PortalData> = {
  gem: {
    id: 'gem',
    name: 'GeM (Government e-Marketplace)',
    shortName: 'GeM',
    agency: 'GeM SPV, Ministry of Commerce & Industry',
    iconName: 'storefront',
    timestamp: '07 Sep 2026, 08:12 PM',
    status: 'connected',
    statusLabel: 'Connected',
    statusDetail: 'Bidder Registered & Active',
    responseTime: '142ms',
    endpoint: '/api/v3/statutory/gem/verify',
    url: 'https://api.gem.gov.in/v3/seller/compliance-check',
    category: 'procurement',
    req: {
      meta: {
        requestId: 'REQ-SIH26100-881920',
        timestamp: '2026-09-07T20:12:04.112Z',
        procurementAuthority: 'GeM_SPV',
        officerClearanceId: 'JS-PROC-RSHARMA'
      },
      bidderIdentifier: {
        cin: 'U72200MP2015PTC034112',
        pan: 'AAECT1234F',
        gstin: '23AAECT1234F1Z8',
        gemSellerId: 'GEM-SEL-IND-90214'
      },
      auditChecks: [
        'SELLER_REGISTRATION_STATUS',
        'DEBARMENT_BLACK_LIST_REGISTRY',
        'ANNUAL_DECLARATION_STATUS'
      ]
    },
    res: {
      statusCode: 200,
      statusMessage: 'RECORD_VERIFIED',
      data: {
        organizationName: 'Apex Tech Solutions Private Limited',
        accountStatus: 'ACTIVE',
        gemTier: 'TIER_1_ENTERPRISE',
        blacklistedStatus: {
          isDebarred: false,
          centralVigilanceCommissionFlag: false,
          stateGovtDebarmentCount: 0
        },
        incidentLogCount: 0,
        lastAuditTimestamp: '2026-09-07T20:12:05.109Z',
        sellerRating: 4.88,
        statutoryCertificates: [
          {
            type: 'OEM_AUTHORIZATION',
            verified: true,
            validTill: '2027-12-31'
          }
        ]
      },
      signatureBlock: {
        issuer: 'cn=GeM Signer Sub-CA 02, o=Government of India',
        digest: 'e4d3f2a1b9c8...[SHA256]'
      }
    }
  },
  gstn: {
    id: 'gstn',
    name: 'GSTN (Goods and Services Tax)',
    shortName: 'GSTN',
    agency: 'Goods and Services Tax Network',
    iconName: 'receipt_long',
    timestamp: '07 Sep 2026, 08:12 PM',
    status: 'connected',
    statusLabel: 'Connected',
    statusDetail: 'Registration Active, 36 Months GSTR-3B/1 Filed',
    responseTime: '195ms',
    endpoint: '/api/v2/gstn/returns/compliance-audit',
    url: 'https://services.gst.gov.in/gstdrive/v2/taxpayer/23AAECT1234F1Z8',
    category: 'tax',
    req: {
      meta: {
        requestId: 'REQ-GSTN-774109',
        timestamp: '2026-09-07T20:12:01.002Z'
      },
      gstin: '23AAECT1234F1Z8',
      periodMonths: 36
    },
    res: {
      statusCode: 200,
      gstinStatus: 'Active',
      gstr3bRegularity: '100%',
      gstr1FiledStatus: 'COMPLIANT',
      taxLiabilityDues: 0.0,
      aggregateTurnoverSlab: 'Rs. 25 Cr to 50 Cr',
      complianceScore: 9.8
    }
  },
  udyam: {
    id: 'udyam',
    name: 'Udyam / MSME Portal',
    shortName: 'Udyam',
    agency: 'Ministry of Micro, Small and Medium Enterprises',
    iconName: 'domain',
    timestamp: '07 Sep 2026, 08:10 PM',
    status: 'connected',
    statusLabel: 'Connected',
    statusDetail: 'Valid MSME UDYAM-MP-03-0019284 (Medium)',
    responseTime: '160ms',
    endpoint: '/api/v1/msme/udyam/validate',
    url: 'https://udyamregistration.gov.in/api/v1/verification',
    category: 'corporate',
    req: {
      udyamNumber: 'UDYAM-MP-03-0019284',
      panNumber: 'AAECT1234F'
    },
    res: {
      statusCode: 200,
      enterpriseName: 'Apex Tech Solutions Private Limited',
      classification: 'Medium Enterprise',
      majorActivity: 'Services / Computer Systems & Infra',
      validityDate: 'Permanent',
      investmentPlantMachinery: 'Rs. 14.82 Cr'
    }
  },
  incometax: {
    id: 'incometax',
    name: 'Income Tax Dept (NSDL/CBDT)',
    shortName: 'Income Tax',
    agency: 'Central Board of Direct Taxes, MoF',
    iconName: 'request_quote',
    timestamp: '07 Sep 2026, 08:11 PM',
    status: 'connected',
    statusLabel: 'Connected',
    statusDetail: 'PAN Linked with Aadhaar, ITR filed AY 25-26',
    responseTime: '210ms',
    endpoint: '/api/v4/cbdt/pan-aadhaar-itr/status',
    url: 'https://eportal.incometax.gov.in/api/v4/itr-status',
    category: 'tax',
    req: {
      pan: 'AAECT1234F',
      assessmentYears: ['2024-25', '2025-26']
    },
    res: {
      statusCode: 200,
      panAadhaarLinkage: 'OPERATIVE',
      itrFilingStatus: [
        { ay: '2025-26', form: 'ITR-6', ackNumber: '89104829104', filingDate: '2025-10-14' },
        { ay: '2024-25', form: 'ITR-6', ackNumber: '74019284019', filingDate: '2024-10-20' }
      ],
      undisclosedForeignAssetsFlag: false
    }
  },
  pan: {
    id: 'pan',
    name: 'PAN Service (Protean / NSDL)',
    shortName: 'PAN Protean',
    agency: 'Protean eGov Technologies Limited',
    iconName: 'badge',
    timestamp: '07 Sep 2026, 08:11 PM',
    status: 'connected',
    statusLabel: 'Connected',
    statusDetail: 'Valid PAN AAECT1234F (Operating Status: Active)',
    responseTime: '115ms',
    endpoint: '/api/v2/protean/pan-verify',
    url: 'https://tin.tin.nsdl.com/pan/verify',
    category: 'identity',
    req: {
      pan: 'AAECT1234F',
      entityName: 'Apex Tech Solutions Private Limited'
    },
    res: {
      statusCode: 200,
      panStatus: 'VALID_EXISTING',
      category: 'Company',
      titleMatch: 'EXACT_100_PERCENT',
      aadhaarSeedingStatus: 'COMPLETED'
    }
  },
  mca: {
    id: 'mca',
    name: 'MCA21 (Ministry of Corp Affairs)',
    shortName: 'MCA21',
    agency: 'Ministry of Corporate Affairs',
    iconName: 'account_balance_wallet',
    timestamp: '07 Sep 2026, 08:09 PM',
    status: 'connected',
    statusLabel: 'Connected',
    statusDetail: 'Active Company CIN: U72200MP2015PTC034112',
    responseTime: '188ms',
    endpoint: '/api/v3/mca21/master-data',
    url: 'https://www.mca.gov.in/mcafoportal/v3/cin-check',
    category: 'corporate',
    req: {
      cin: 'U72200MP2015PTC034112'
    },
    res: {
      cin: 'U72200MP2015PTC034112',
      companyStatus: 'Active',
      dateOfIncorporation: '2015-08-18',
      paidUpCapital: 'Rs. 4,50,00,000',
      chargesRegistered: 'NO_DEFAULT_CHARGES',
      directorsCount: 3,
      disqualifiedDirectors: 0,
      rocLocation: 'RoC-Gwalior'
    }
  },
  startup: {
    id: 'startup',
    name: 'Startup India Portal (DPIIT)',
    shortName: 'Startup India',
    agency: 'DPIIT, Ministry of Commerce & Industry',
    iconName: 'rocket_launch',
    timestamp: '07 Sep 2026, 07:45 PM',
    status: 'exempted',
    statusLabel: 'Connected',
    statusDetail: 'Not Registered / Claimed as MSME',
    responseTime: '122ms',
    endpoint: '/api/v1/dpiit/startup-status',
    url: 'https://api.startupindia.gov.in/v1/check-dipp',
    category: 'corporate',
    isExempt: true,
    req: {
      cin: 'U72200MP2015PTC034112',
      pan: 'AAECT1234F'
    },
    res: {
      statusCode: 404,
      isStartupRecognized: false,
      note: 'Entity claimed status under MSME Act; Startup exemption not utilized',
      priorTurnoverExemptionClaimed: false
    }
  },
  nsic: {
    id: 'nsic',
    name: 'NSIC (National Small Industries Corp)',
    shortName: 'NSIC',
    agency: 'National Small Industries Corporation Ltd.',
    iconName: 'workspace_premium',
    timestamp: '07 Sep 2026, 07:50 PM',
    status: 'connected',
    statusLabel: 'Connected',
    statusDetail: 'Valid Single Point Registration SPRS/2024/9912',
    responseTime: '174ms',
    endpoint: '/api/v1/nsic/sprs-certificate',
    url: 'https://www.nsic.co.in/api/sprs/validity',
    category: 'procurement',
    req: {
      regNumber: 'SPRS/2024/9912'
    },
    res: {
      statusCode: 200,
      status: 'ACTIVE',
      validUntil: '2027-04-30',
      monetaryLimit: 'Rs. 18.50 Crores',
      inspectionAgency: 'RITES Limited'
    }
  },
  epfo: {
    id: 'epfo',
    name: 'EPFO (Provident Fund Org)',
    shortName: 'EPFO',
    agency: 'Employees’ Provident Fund Organisation, MoLE',
    iconName: 'groups',
    timestamp: '07 Sep 2026, 08:05 PM',
    status: 'connected',
    statusLabel: 'Connected',
    statusDetail: 'Active Establishment, 142 employees regularly remitted',
    responseTime: '204ms',
    endpoint: '/api/v2/epfo/establishment-dues',
    url: 'https://unifiedportal-epfo.epfindia.gov.in/api/v2/estb-dues',
    category: 'labor',
    req: {
      estbId: 'MPBPL0041289000'
    },
    res: {
      statusCode: 200,
      establishmentStatus: 'ACTIVE',
      contributingEmployees: 142,
      lastContributionWageMonth: '2026-08',
      defaultNotices: 0,
      ecrRegularityMonths: 36
    }
  },
  esic: {
    id: 'esic',
    name: 'ESIC (State Insurance)',
    shortName: 'ESIC',
    agency: 'Employees State Insurance Corporation, MoLE',
    iconName: 'health_and_safety',
    timestamp: '07 Sep 2026, 08:05 PM',
    status: 'connected',
    statusLabel: 'Connected',
    statusDetail: 'Compliant, monthly remittances regular (Zero dues)',
    responseTime: '191ms',
    endpoint: '/api/v1/esic/compliance',
    url: 'https://www.esic.in/api/v1/employer-status',
    category: 'labor',
    req: {
      employerCode: '11000982340001001'
    },
    res: {
      statusCode: 200,
      codeStatus: 'COMPLIANT',
      latestChallanStatus: 'PAID_VERIFIED',
      clearedThrough: '2026-08-31',
      activeInsuredPersons: 89
    }
  },
  digilocker: {
    id: 'digilocker',
    name: 'DigiLocker (National Digital Locker)',
    shortName: 'DigiLocker',
    agency: 'National e-Governance Division (NeGD), MeitY',
    iconName: 'folder_special',
    timestamp: '07 Sep 2026, 08:14 PM',
    status: 'connected',
    statusLabel: 'Connected',
    statusDetail: '8 Certificates Cryptographically Verified via Issuer URI',
    responseTime: '153ms',
    endpoint: '/api/v2/digilocker/fetch-certificates',
    url: 'https://api.digilocker.gov.in/public/oauth2/1/cert/pull',
    category: 'identity',
    req: {
      uriList: ['in.gov.mca-cer-034112', 'in.gov.gstn-reg-23aaect', 'in.gov.bis-cm-8192048']
    },
    res: {
      statusCode: 200,
      cryptographicallySignedCertsCount: 8,
      issuerVerificationList: [
        { docType: 'COI', status: 'VALID_SIGNED', issuer: 'MCA-RoC' },
        { docType: 'GST_CERT', status: 'VALID_SIGNED', issuer: 'GSTN' },
        { docType: 'ISO_9001', status: 'VALID_SIGNED', issuer: 'BIS-Accredited' }
      ]
    }
  },
  dpiit: {
    id: 'dpiit',
    name: 'DPIIT (Make In India / Local Content)',
    shortName: 'DPIIT MII',
    agency: 'Department for Promotion of Industry and Internal Trade',
    iconName: 'flag',
    timestamp: '07 Sep 2026, 08:12 PM',
    status: 'audit_flag',
    statusLabel: 'Audit Flag',
    statusDetail: 'Self-Declaration Audit Flag (42% declared vs 50% tender requirement)',
    responseTime: '231ms',
    endpoint: '/api/v2/dpiit/make-in-india-audit',
    url: 'https://dpiit.gov.in/api/v2/mii/local-content-audit',
    category: 'procurement',
    isFlagged: true,
    req: {
      tenderNo: 'GEM/2026/INF/001',
      bidderCin: 'U72200MP2015PTC034112',
      declaredLocalContentPercent: 42.0,
      procurementCategory: 'Class-I Local Supplier Target'
    },
    res: {
      statusCode: 422,
      auditResult: 'DISCREPANCY_FLAG',
      thresholdRequiredPercent: 50.0,
      declaredContentPercent: 42.0,
      classification: 'Class-II Local Supplier',
      eligiblePreference: 'NON_ELIGIBLE_FOR_CLASS_I_PREFERENCE',
      auditOfficerFlag: 'MII Clause 3(b) Non-conformance trigger',
      recommendedAction: 'Issue Statutory Clarification Notice under Rule 153(iii)'
    }
  },
  bis: {
    id: 'bis',
    name: 'BIS (Bureau of Indian Standards)',
    shortName: 'BIS',
    agency: 'Bureau of Indian Standards, MoCAF&PD',
    iconName: 'verified',
    timestamp: '07 Sep 2026, 07:55 PM',
    status: 'connected',
    statusLabel: 'Connected',
    statusDetail: 'IS/ISO 9001:2015 & IS 13252 Certified (Valid till 2028)',
    responseTime: '167ms',
    endpoint: '/api/v1/bis/standards/validation',
    url: 'https://www.services.bis.gov.in/api/licence-verify',
    category: 'standards',
    req: {
      licenseNo: 'CM/L-8192048',
      standardNumbers: ['IS/ISO 9001:2015', 'IS 13252:2010']
    },
    res: {
      statusCode: 200,
      certificationStatus: 'VALID',
      validTill: '2028-05-15',
      surveillanceAuditPassed: true,
      labTestReportId: 'NABL-BIS-2026-99018'
    }
  }
};

export const TENDERS: Tender[] = [
  {
    id: 'GEM/2026/INF/001',
    code: 'GEM/2026/INF/001',
    title: 'Digital Infrastructure Procurement 2026',
    category: 'Information Technology / Datacenter Hardware',
    department: 'Ministry of Electronics & Information Technology (MeitY)',
    estimatedValue: '₹48.50 Crores',
    miiRequiredPercent: 50,
    msmeExemptionAllowed: true,
    startDate: '15 Aug 2026',
    closingDate: '18 Sep 2026',
    status: 'Active',
    biddersCount: 5
  },
  {
    id: 'GEM/2026/SEC/042',
    code: 'GEM/2026/SEC/042',
    title: 'Perimeter Surveillance & C3i Command Node',
    category: 'Defense / Homeland Security Electronics',
    department: 'Ministry of Home Affairs (MHA)',
    estimatedValue: '₹124.00 Crores',
    miiRequiredPercent: 60,
    msmeExemptionAllowed: false,
    startDate: '01 Sep 2026',
    closingDate: '05 Oct 2026',
    status: 'Active',
    biddersCount: 4
  },
  {
    id: 'GEM/2026/MED/119',
    code: 'GEM/2026/MED/119',
    title: 'Modular High-Performance Patient Monitoring Hubs',
    category: 'Healthcare & Medical Devices',
    department: 'Ministry of Health & Family Welfare (MoHFW)',
    estimatedValue: '₹32.10 Crores',
    miiRequiredPercent: 50,
    msmeExemptionAllowed: true,
    startDate: '20 Aug 2026',
    closingDate: '25 Sep 2026',
    status: 'Under Evaluation',
    biddersCount: 6
  }
];

export const BIDDERS: Bidder[] = [
  {
    id: 'bidder-1',
    name: 'Apex Tech Solutions Private Limited',
    cin: 'U72200MP2015PTC034112',
    pan: 'AAECT1234F',
    gstin: '23AAECT1234F1Z8',
    gemSellerId: 'GEM-SEL-IND-90214',
    tenderId: 'GEM/2026/INF/001',
    status: 'Audit Flag',
    riskScore: 28,
    miiPercentage: 42,
    msmeCategory: 'Medium (Udyam)',
    registeredState: 'Madhya Pradesh',
    incorporationYear: 2015,
    annualTurnover: '₹42.8 Cr'
  },
  {
    id: 'bidder-2',
    name: 'Bharat Cyber Infra Systems Ltd',
    cin: 'L72900DL2008PLC184910',
    pan: 'AABCB9812M',
    gstin: '07AABCB9812M1ZK',
    gemSellerId: 'GEM-SEL-IND-44102',
    tenderId: 'GEM/2026/INF/001',
    status: 'Verified',
    riskScore: 6,
    miiPercentage: 68,
    msmeCategory: 'Non-MSME (Enterprise)',
    registeredState: 'New Delhi',
    incorporationYear: 2008,
    annualTurnover: '₹188.4 Cr'
  },
  {
    id: 'bidder-3',
    name: 'Vayu Aerospace & Electronics Corp',
    cin: 'U35300KA2012PTC065201',
    pan: 'AABCV7721L',
    gstin: '29AABCV7721L1Z4',
    gemSellerId: 'GEM-SEL-IND-55928',
    tenderId: 'GEM/2026/SEC/042',
    status: 'Verified',
    riskScore: 12,
    miiPercentage: 74,
    msmeCategory: 'Small (Udyam)',
    registeredState: 'Karnataka',
    incorporationYear: 2012,
    annualTurnover: '₹22.5 Cr'
  },
  {
    id: 'bidder-4',
    name: 'Hindustan Smart Grid Networks',
    cin: 'U31909MH2017PTC298114',
    pan: 'AABCH4419E',
    gstin: '27AABCH4419E1ZN',
    gemSellerId: 'GEM-SEL-IND-11842',
    tenderId: 'GEM/2026/INF/001',
    status: 'Under Review',
    riskScore: 54,
    miiPercentage: 35,
    msmeCategory: 'Micro',
    registeredState: 'Maharashtra',
    incorporationYear: 2017,
    annualTurnover: '₹7.2 Cr'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-9921',
    timestamp: '07 Sep 2026, 08:14:02 PM',
    officer: 'R. Sharma (JS-Proc.)',
    portal: 'DigiLocker',
    action: 'Cryptographic URI Certificate Batch Verification (8 documents)',
    status: 'SUCCESS',
    latency: '153ms',
    sha256Digest: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  },
  {
    id: 'LOG-9920',
    timestamp: '07 Sep 2026, 08:12:44 PM',
    officer: 'R. Sharma (JS-Proc.)',
    portal: 'DPIIT (MII)',
    action: 'Local Content Threshold Check vs Tender Tender Specification (42% vs 50%)',
    status: 'FLAG',
    latency: '231ms',
    sha256Digest: 'cb8379ac2098aa165029e3938a51da0bcecfc008b679d440a164670e4b1bee4d'
  },
  {
    id: 'LOG-9919',
    timestamp: '07 Sep 2026, 08:12:15 PM',
    officer: 'R. Sharma (JS-Proc.)',
    portal: 'GeM SPV',
    action: 'Seller Debarment Registry & CVC Watchlist Cross-reference',
    status: 'SUCCESS',
    latency: '142ms',
    sha256Digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'LOG-9918',
    timestamp: '07 Sep 2026, 08:12:02 PM',
    officer: 'R. Sharma (JS-Proc.)',
    portal: 'GSTN',
    action: '36-Month GSTR-3B & GSTR-1 Automated Filing Return Audit',
    status: 'SUCCESS',
    latency: '195ms',
    sha256Digest: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'
  },
  {
    id: 'LOG-9917',
    timestamp: '07 Sep 2026, 08:11:38 PM',
    officer: 'R. Sharma (JS-Proc.)',
    portal: 'CBDT / NSDL',
    action: 'ITR-6 Filing Verification & PAN-Aadhaar Linkage Certification',
    status: 'SUCCESS',
    latency: '210ms',
    sha256Digest: 'fc922262a67a80b06b9944f2d725656d025b306b3a3737a4b27cb0f19818b26a'
  },
  {
    id: 'LOG-9916',
    timestamp: '07 Sep 2026, 08:10:10 PM',
    officer: 'R. Sharma (JS-Proc.)',
    portal: 'Udyam / MSME',
    action: 'MSME Category & Investment in Plant/Machinery Validation',
    status: 'SUCCESS',
    latency: '160ms',
    sha256Digest: '11a527c368bf3979bc97382344738834b719f9002977d5681cb60159f926b114'
  }
];
