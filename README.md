# 🛡️ BidSure AI

### AI-Powered Bid Compliance & Verification Platform for Government Procurement

> **Verify. Analyze. Detect. Decide.**

BidSure AI is an AI-powered procurement compliance platform designed to streamline **Government e-Marketplace (GeM) bid and bidder verification**.

The platform brings together multi-portal verification, document intelligence, compliance analysis, risk detection, bidder comparison, AI-assisted forensic analysis, reporting, and audit trails into a unified procurement workspace.

---

## 🚀 Overview

Government procurement requires procurement officers to verify bidder information across multiple regulatory and statutory sources.

BidSure AI provides a centralized verification workflow that allows evaluators to:

* Verify bidder information across multiple government portals
* Analyze tender and bidder compliance
* Detect potential discrepancies and risk indicators
* Perform AI-assisted document and integrity analysis
* Compare multiple bidders
* Generate verification reports
* Maintain an auditable history of verification actions
* Export verification and audit data
* Provide bidders with a dedicated client portal for document submission and queries

The current implementation operates primarily as a **SIH demonstration environment**, using local fixtures and sandbox verification flows while maintaining an architecture intended for future live gateway integrations.

---

## 🎯 Problem Statement

Government tender evaluation can involve manually checking:

* GeM registration
* GST compliance
* Udyam/MSME registration
* PAN information
* Corporate records
* Income-tax compliance
* Labour compliance
* Certifications
* Local-content declarations
* Procurement-related registrations and documents

Performing these checks manually can require significant time and can make it difficult to maintain a consistent, traceable verification process.

**BidSure AI** aims to provide a centralized digital workflow for collecting, validating, analyzing, and auditing this information.

---

## ✨ Key Features

### 🔍 Multi-Portal Verification

BidSure provides a centralized verification hub for multiple statutory and procurement-related sources, including:

* GeM
* GSTN
* Udyam / MSME
* Income Tax
* PAN
* MCA21
* Startup India / DPIIT
* NSIC
* EPFO
* ESIC
* DigiLocker
* BIS
* Make in India / Local Content

The application models portal requests, responses, status, response time, verification timestamps, and audit information.

---

### 🤖 AI Document & Integrity Verification

The AI verification module provides a forensic-analysis workflow covering:

* Document tampering analysis
* Pixel/splicing risk
* UDIN verification
* Shell-company risk indicators
* Circular trading analysis
* Collusion-related indicators
* AI-generated executive assessment

The project integrates Google's Gemini API through `@google/genai` and supports a deterministic sandbox fallback when an API key is unavailable.

---

### 📊 Compliance Analysis

BidSure evaluates bidder information against tender requirements and highlights potential compliance issues.

Example:

```text
Declared Local Content: 42%
Tender Requirement:     50%

Result: Audit Flag
```

The DPIIT/Make-in-India workflow specifically demonstrates threshold-based compliance checking.

---

### ⚠️ Risk Analysis

Bidder profiles include structured risk information such as:

* Risk score
* Verification status
* MSME classification
* Annual turnover
* Registration state
* Incorporation year
* Local-content percentage

This information can be used by procurement officers as part of the broader evaluation workflow.

---

### 📑 Tender Management

The platform includes tender-oriented workflows for:

* Tender selection
* Tender details
* Procurement department
* Estimated tender value
* Tender category
* Bidder count
* Tender status
* Local-content requirements
* MSME exemption information

---

### 🏢 Bidder Management

Evaluators can inspect and select bidders while viewing information such as:

* Company name
* CIN
* PAN
* GSTIN
* GeM Seller ID
* Compliance status
* Risk score
* MSME category
* Annual turnover
* Registered state
* Local-content declaration

---

### 🔄 Re-Verification & Synchronization

Individual portals can be re-verified, or the evaluator can initiate a multi-portal verification process.

The gateway service supports:

* Sandbox verification
* Configurable latency
* Portal status updates
* Verification timestamps
* Audit-log generation
* SHA-256-style audit digests

The current gateway architecture keeps a path open for replacing sandbox behavior with live REST/OAuth2 gateway calls.

---

### 🧾 Audit Trail

Every major verification action can generate an audit entry containing:

* Log ID
* Timestamp
* Officer
* Portal
* Action
* Status
* Response latency
* SHA-256 digest

BidSure can also export an **audit bundle as JSON** containing bidder, tender, portal verification, and cryptographic audit information.

---

### 📄 Client Document Portal

The client-side workflow allows bidders to:

* View their dashboard
* Upload documents
* Remove uploaded documents
* View validation status
* Access generated reports
* Raise queries
* Submit grievances
* Submit audit appeals
* Communicate with procurement officers

Document objects support metadata, extracted fields, hashes, OCR text, and validation status.

---

### 📈 Reports & Bid Comparison

The evaluator workspace includes dedicated interfaces for:

* Compliance reports
* Bid comparison
* Risk analysis
* Audit history
* Tender analysis
* Bidder assessment

---

## 🧠 System Architecture

```text
                         ┌───────────────────────┐
                         │      BidSure AI       │
                         │    React Frontend     │
                         └───────────┬───────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
       Evaluator Portal        Client Portal          AI Analysis
              │                      │                      │
              │                      │                      ▼
              │                      │                Gemini API
              │                      │
              ▼                      ▼
       Verification Hub       Document Workflow
              │
              ▼
       Gateway / Sandbox
              │
     ┌────────┼─────────┐
     ▼        ▼         ▼
    GeM     GSTN      Udyam
     │        │         │
     ├────────┼─────────┤
     ▼        ▼         ▼
    PAN      MCA      Income Tax
     │
     ├──── EPFO / ESIC
     ├──── DPIIT / MII
     ├──── NSIC
     ├──── DigiLocker
     └──── BIS

              │
              ▼
        Audit Trail
              │
              ▼
        Reports / Export
```

---

## 🛠️ Tech Stack

### Frontend

* **React 19**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Framer Motion**
* **Lucide React**

### AI

* **Google Gemini API**
* `@google/genai`
* AI forensic-analysis workflow
* Deterministic sandbox fallback

### Document Processing

* **Tesseract.js** for OCR capabilities
* **PDF.js** for PDF processing

### Application / Utilities

* **Express**
* **dotenv**
* TypeScript
* Local storage for selected configuration/state

The project's `package.json` confirms React 19, Vite, TypeScript, Tailwind CSS, Gemini, Express, PDF.js, Tesseract.js, Framer Motion, and Lucide React as core dependencies.

---

## 📁 Project Structure

```text
BidSure/
│
├── public/
│   └── assets/
│
├── src/
│   ├── components/
│   │   ├── screens/
│   │   │   ├── DashboardScreen
│   │   │   ├── TendersScreen
│   │   │   ├── BiddersScreen
│   │   │   ├── AiVerificationScreen
│   │   │   ├── ComplianceChecksScreen
│   │   │   ├── RiskAnalysisScreen
│   │   │   ├── BidComparisonScreen
│   │   │   ├── ReportsScreen
│   │   │   ├── AuditTrailScreen
│   │   │   ├── PortalVerificationScreen
│   │   │   └── Client Portal Screens
│   │   │
│   │   ├── modals/
│   │   └── shared/
│   │
│   ├── data/
│   │   ├── portalData.ts
│   │   └── clientPortalData.ts
│   │
│   ├── services/
│   │   ├── gateway.ts
│   │   └── gemini.ts
│   │
│   ├── utils/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
│
├── .env.example
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

The application routing/state is centralized in `App.tsx`, while typed domain models cover portals, bidders, tenders, audit logs, documents, and client queries.

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/kunaljaiswal55/BidSure.git
cd BidSure
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GEM_GATEWAY_URL=https://api.gem.gov.in
```

> The Gemini API key is optional for the demo. Without a key, BidSure uses its built-in sandbox/mock forensic response.

---

### 4. Start Development Server

```bash
npm run dev
```

The configured Vite development server runs on:

```text
http://localhost:3000
```

---

### 5. Build for Production

```bash
npm run build
```

---

### 6. Preview Production Build

```bash
npm run preview
```

---

### 7. Type Check

```bash
npm run lint
```

---

## 🔐 Environment Variables

| Variable               | Required | Description                                  |
| ---------------------- | -------- | -------------------------------------------- |
| `VITE_GEMINI_API_KEY`  | Optional | Gemini API key for AI forensic analysis      |
| `VITE_GEM_GATEWAY_URL` | Optional | Gateway base URL for future live integration |

For production deployments, API credentials should preferably be handled through a secure backend/server-side proxy rather than exposing secrets in the browser. The repository's Gemini service itself recommends a server-side proxy for production use.

---

## 🧪 Demo / Sandbox Mode

BidSure currently includes a **sandbox environment** designed for demonstration and development.

In sandbox mode:

```text
User Action
     ↓
BidSure Gateway
     ↓
Local Portal Fixtures
     ↓
Simulated Verification
     ↓
Compliance Result
     ↓
Audit Log
```

This allows the complete UI workflow to be demonstrated without requiring direct access to restricted government systems.

The gateway explicitly identifies sandbox behavior and contains the integration structure for a future live gateway implementation.

---

## 🔌 Future Integration

The architecture is designed to support integration with authorized government APIs and gateways.

Potential production architecture:

```text
React Client
     │
     ▼
Secure Backend
     │
     ├── Authentication
     ├── Authorization
     ├── API Gateway
     ├── Audit Service
     └── AI Service
              │
              ▼
       Authorized APIs
              │
      ┌───────┼────────┐
      ▼       ▼        ▼
     GeM     GSTN     MCA
      │       │        │
      └───────┼────────┘
              ▼
       Verification Engine
              │
              ▼
        Compliance Result
```

> **Important:** The repository's current government-portal responses are demo fixtures. They should not be interpreted as live government API results.

---

## 🔎 Verification Workflow

```text
1. Select Tender
        ↓
2. Select Bidder
        ↓
3. Verify Government Records
        ↓
4. Cross-Check Bidder Information
        ↓
5. Evaluate Tender Requirements
        ↓
6. Run AI Forensic Analysis
        ↓
7. Identify Compliance / Risk Issues
        ↓
8. Review Bidder
        ↓
9. Generate Report
        ↓
10. Store / Export Audit Trail
```

---

## 🧩 Main Application Modules

| Module              | Purpose                               |
| ------------------- | ------------------------------------- |
| Dashboard           | Procurement overview and key metrics  |
| Tender Management   | View and select procurement tenders   |
| Bidder Management   | Inspect and manage bidder information |
| Portal Verification | Cross-check statutory information     |
| AI Verification     | AI-assisted forensic analysis         |
| Compliance Checks   | Evaluate bidder requirements          |
| Risk Analysis       | Identify bidder risk indicators       |
| Bid Comparison      | Compare bidders                       |
| Reports             | Generate verification reports         |
| Audit Trail         | Track verification activity           |
| Settings            | Configure application behavior        |
| Client Dashboard    | Bidder-facing workspace               |
| Document Upload     | Submit procurement documents          |
| Client Reports      | View verification results             |
| Client Queries      | Raise queries and appeals             |

The available navigation paths and evaluator/client modules are defined directly in the application's TypeScript types and main application component.

---

## 🎓 Smart India Hackathon

BidSure AI was developed around the **Smart India Hackathon problem statement SIH26100**:

> **AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement**

The project demonstrates how AI, document processing, automated verification, and structured audit workflows can be combined into a procurement-support platform.

---

## 🛡️ Security Considerations

For production deployment, additional security controls should be implemented, including:

* Server-side API key management
* Role-based access control
* Secure authentication
* Encryption of sensitive documents
* Secure document storage
* API request signing
* Rate limiting
* Comprehensive server-side audit logging
* Government API authorization
* PII/data-retention controls
* Secure secrets management

The current repository should therefore be treated as a **demonstration/prototype implementation**, not as a production government procurement system.

---

## 🚧 Current Limitations

The current version is primarily a demonstration environment.

### Current

* Local portal fixtures
* Sandbox verification gateway
* Client-side application state
* Gemini API integration with mock fallback
* Demonstration audit data
* Demonstration bidder/tender data

### Planned Production Capabilities

* Secure backend architecture
* Authorized government API integrations
* Production authentication
* Persistent database
* Secure document storage
* Real-time verification jobs
* Production-grade audit infrastructure
* Role-based access control
* Advanced document intelligence
* Scalable AI processing pipeline

---

## 🔮 Roadmap

* [ ] Production backend
* [ ] PostgreSQL/MongoDB persistence
* [ ] Secure authentication & RBAC
* [ ] Authorized government API integrations
* [ ] Server-side Gemini integration
* [ ] Advanced OCR pipeline
* [ ] Automated document classification
* [ ] Explainable compliance scoring
* [ ] Advanced fraud detection
* [ ] Bidder relationship/network analysis
* [ ] Real-time verification jobs
* [ ] Secure cloud document storage
* [ ] Production monitoring and logging
* [ ] Automated testing
* [ ] CI/CD pipeline

---

## 👨‍💻 Contributors

Developed as a Smart India Hackathon project by the BidSure team.

**Repository:**
https://github.com/kunaljaiswal55/BidSure

---

## 📄 License

This project includes source files carrying Apache-2.0 licensing information. Review the repository's licensing files before redistributing or deploying the project.

---

## ⭐ Support

If you find the project useful:

* ⭐ Star the repository
* 🍴 Fork the project
* 🐛 Report issues
* 💡 Suggest improvements
* 🤝 Contribute to the project

---

### BidSure AI

**Making procurement verification faster, more transparent, and auditable.**
