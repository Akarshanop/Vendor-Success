import type {
  Supplier, JourneyStage, Product, Tender, Bid, Order, Payment,
  Certification, MessageThread, Stage
} from "@/types";

export const currentSupplier: Supplier = {
  id: "UG-SEL-00234",
  name: "Nakawa Traders Ltd",
  businessType: "Ltd Company",
  ursbNumber: "URSB-2019-84421",
  tin: "1000234567",
  vatRegistered: true,
  district: "Kampala",
  region: "Central",
  contactEmail: "info@nakawatraders.co.ug",
  contactPhone: "+256 772 123 456",
  currentStage: "Catalogue",
  verificationStatus: "In Progress",
  isSME: true,
  isWomenLed: true,
  isYouthLed: false,
  isPWDs: false,
  categoryPrimary: "Medical Supplies",
  categorySecondary: "Office Supplies",
  bankAccount: "Stanbic Bank •••• 4421",
  mobileMoney: "MTN MoMo •••• 3456",
  healthScore: 76,
  performanceRating: 4.2,
  riskScore: 22,
  ppdaId: undefined,
  goLiveDate: undefined,
};

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();
const daysAhead = (n: number) => new Date(now.getTime() + n * 86400000).toISOString();

export const journey: JourneyStage[] = [
  {
    stage: "Account",
    status: "Approved",
    startedAt: daysAgo(28),
    completedAt: daysAgo(27),
    agentVerdicts: [
      { agentName: "OTP Verification Agent", verdict: "Pass", confidence: 100, message: "Email and phone OTP confirmed.", ranAt: daysAgo(27) },
    ],
    requiredActions: [
      { id: "a1", label: "Complete signup form", completed: true, type: "form" },
      { id: "a2", label: "Verify email OTP", completed: true, type: "review" },
      { id: "a3", label: "Verify phone OTP", completed: true, type: "review" },
    ],
  },
  {
    stage: "Identity",
    status: "Approved",
    startedAt: daysAgo(26),
    completedAt: daysAgo(24),
    agentVerdicts: [
      { agentName: "URSB Agent", verdict: "Pass", confidence: 98, message: "Company registered. Directors match applicant.", ranAt: daysAgo(25) },
      { agentName: "TIN Agent", verdict: "Pass", confidence: 95, message: "TIN active. Tax status: Good standing.", ranAt: daysAgo(25) },
    ],
    requiredActions: [
      { id: "i1", label: "Provide URSB number", completed: true, type: "form" },
      { id: "i2", label: "Provide TIN", completed: true, type: "form" },
    ],
  },
  {
    stage: "Documents",
    status: "Approved",
    startedAt: daysAgo(23),
    completedAt: daysAgo(20),
    agentVerdicts: [
      { agentName: "OCR Agent", verdict: "Pass", confidence: 92, message: "All 4 documents legible, expiries extracted.", ranAt: daysAgo(21) },
      { agentName: "Expiry Agent", verdict: "Pass", confidence: 100, message: "No expired documents.", ranAt: daysAgo(21) },
    ],
    requiredActions: [
      { id: "d1", label: "Upload Tax Clearance", completed: true, type: "upload" },
      { id: "d2", label: "Upload Trade Licence", completed: true, type: "upload" },
      { id: "d3", label: "Upload Bank Letter", completed: true, type: "upload" },
      { id: "d4", label: "Upload NSSF Certificate", completed: true, type: "upload" },
    ],
    opsNote: "Documents look great. Proceed to category selection.",
  },
  {
    stage: "Category",
    status: "Approved",
    startedAt: daysAgo(19),
    completedAt: daysAgo(17),
    agentVerdicts: [
      { agentName: "Category Suggestion Agent", verdict: "Pass", confidence: 88, message: "Recommended: Medical Supplies (primary), Office Supplies (secondary).", ranAt: daysAgo(18) },
      { agentName: "NDA Cert Agent", verdict: "Pass", confidence: 96, message: "NDA cert verified with National Drug Authority registry.", ranAt: daysAgo(18) },
    ],
    requiredActions: [
      { id: "c1", label: "Select primary category", completed: true, type: "select" },
      { id: "c2", label: "Select secondary category", completed: true, type: "select" },
      { id: "c3", label: "Upload NDA certification", completed: true, type: "upload" },
    ],
  },
  {
    stage: "Banking",
    status: "Approved",
    startedAt: daysAgo(16),
    completedAt: daysAgo(14),
    agentVerdicts: [
      { agentName: "Bank Verification Agent", verdict: "Pass", confidence: 94, message: "Bank account matches business name. Micro-deposit confirmed.", ranAt: daysAgo(15) },
      { agentName: "MoMo Agent", verdict: "Pass", confidence: 100, message: "MTN MoMo merchant number active.", ranAt: daysAgo(15) },
    ],
    requiredActions: [
      { id: "b1", label: "Add bank account", completed: true, type: "form" },
      { id: "b2", label: "Add mobile money", completed: true, type: "form" },
    ],
  },
  {
    stage: "Catalogue",
    status: "In Progress",
    startedAt: daysAgo(13),
    agentVerdicts: [
      { agentName: "Catalogue Enhancer Agent", verdict: "Manual Review", confidence: 68, message: "3 products published, 10 minimum required. 7 drafts need images and warranty info.", ranAt: daysAgo(1) },
    ],
    requiredActions: [
      { id: "cat1", label: "Publish 10 products (3/10 done)", completed: false, type: "form" },
      { id: "cat2", label: "Fill missing images for 4 products", completed: false, type: "upload" },
      { id: "cat3", label: "Submit catalogue for review", completed: false, type: "review" },
    ],
    opsNote: "You're close! Publish 7 more products and submit for review.",
  },
  {
    stage: "PPDA",
    status: "Not Started",
    agentVerdicts: [],
    requiredActions: [
      { id: "p1", label: "Pay PPDA registration fee (UGX 250,000)", completed: false, type: "payment" },
      { id: "p2", label: "Declare preference categories", completed: false, type: "form" },
      { id: "p3", label: "Upload preference evidence", completed: false, type: "upload" },
    ],
    blockedReason: "Complete Catalogue stage first.",
  },
];

export const products: Product[] = [
  { id: "P001", sku: "NT-MED-001", name: "Surgical Face Masks (Box of 50)", categoryL1: "Medical", categoryL2: "PPE", categoryL3: "Masks", brand: "MedGuard", unitPriceUGX: 45000, moq: 10, leadTimeDays: 3, warrantyMonths: 0, stock: 850, imageUrl: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400", rating: 4.6, status: "Published", qualityScore: 92, missingFields: [], reviewCount: 24 },
  { id: "P002", sku: "NT-MED-002", name: "Nitrile Examination Gloves (Box of 100)", categoryL1: "Medical", categoryL2: "PPE", categoryL3: "Gloves", brand: "SafeHands", unitPriceUGX: 68000, moq: 5, leadTimeDays: 3, warrantyMonths: 0, stock: 420, imageUrl: "https://images.unsplash.com/photo-1583912086096-8c60d75a53f9?w=400", rating: 4.4, status: "Published", qualityScore: 88, missingFields: [], reviewCount: 18 },
  { id: "P003", sku: "NT-MED-003", name: "Digital Thermometer", categoryL1: "Medical", categoryL2: "Diagnostics", categoryL3: "Thermometers", brand: "ThermPro", unitPriceUGX: 32000, moq: 20, leadTimeDays: 5, warrantyMonths: 12, stock: 175, imageUrl: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400", rating: 4.7, status: "Published", qualityScore: 95, missingFields: [], reviewCount: 31 },
  { id: "P004", sku: "NT-MED-004", name: "Pulse Oximeter Fingertip", categoryL1: "Medical", categoryL2: "Diagnostics", categoryL3: "Monitoring", brand: "PulseCare", unitPriceUGX: 85000, moq: 5, leadTimeDays: 7, warrantyMonths: 12, stock: 60, status: "Under Review", qualityScore: 76, missingFields: ["image"], reviewCount: 0 },
  { id: "P005", sku: "NT-MED-005", name: "Cotton Wool Rolls 500g", categoryL1: "Medical", categoryL2: "Consumables", categoryL3: "Wound Care", brand: "PureCotton", unitPriceUGX: 18000, moq: 50, leadTimeDays: 2, warrantyMonths: 0, stock: 1200, status: "Under Review", qualityScore: 71, missingFields: ["image", "description"], reviewCount: 0 },
  { id: "P006", sku: "NT-MED-006", name: "Disposable Syringes 5ml (Box of 100)", categoryL1: "Medical", categoryL2: "Consumables", categoryL3: "Injection", brand: "MediShot", unitPriceUGX: 55000, moq: 10, leadTimeDays: 4, warrantyMonths: 0, stock: 380, status: "Under Review", qualityScore: 82, missingFields: ["warranty"], reviewCount: 0 },
  { id: "P007", sku: "NT-OFF-001", name: "A4 Copy Paper 80gsm (Ream)", categoryL1: "Office", categoryL2: "Paper", categoryL3: "Copy Paper", brand: "PaperOne", unitPriceUGX: 22000, moq: 100, leadTimeDays: 2, warrantyMonths: 0, stock: 2400, status: "Under Review", qualityScore: 78, missingFields: ["image"], reviewCount: 0 },
  { id: "P008", sku: "NT-OFF-002", name: "Ballpoint Pens Blue (Pack of 50)", categoryL1: "Office", categoryL2: "Writing", categoryL3: "Pens", brand: "BiClass", unitPriceUGX: 15000, moq: 20, leadTimeDays: 2, warrantyMonths: 0, stock: 800, status: "Under Review", qualityScore: 74, missingFields: ["image", "brand-verified"], reviewCount: 0 },
  { id: "P009", sku: "NT-MED-007", name: "IV Drip Set with Needle", categoryL1: "Medical", categoryL2: "Consumables", categoryL3: "Injection", brand: "MediShot", unitPriceUGX: 4500, moq: 100, leadTimeDays: 5, warrantyMonths: 0, stock: 1800, status: "Draft", qualityScore: 55, missingFields: ["image", "description", "warranty", "specs"], reviewCount: 0 },
  { id: "P010", sku: "NT-MED-008", name: "Surgical Gauze 10x10cm", categoryL1: "Medical", categoryL2: "Consumables", categoryL3: "Wound Care", brand: "PureCotton", unitPriceUGX: 12000, moq: 50, leadTimeDays: 3, warrantyMonths: 0, stock: 950, status: "Draft", qualityScore: 48, missingFields: ["image", "description", "specs"], reviewCount: 0 },
  { id: "P011", sku: "NT-OFF-003", name: "Staplers Heavy Duty", categoryL1: "Office", categoryL2: "Desk", categoryL3: "Staplers", brand: "MaxOffice", unitPriceUGX: 35000, moq: 10, leadTimeDays: 4, warrantyMonths: 6, stock: 120, status: "Draft", qualityScore: 62, missingFields: ["image", "description"], reviewCount: 0 },
  { id: "P012", sku: "NT-OFF-004", name: "Manila Folders (Pack of 100)", categoryL1: "Office", categoryL2: "Filing", categoryL3: "Folders", brand: "FileEase", unitPriceUGX: 28000, moq: 20, leadTimeDays: 3, warrantyMonths: 0, stock: 400, status: "Draft", qualityScore: 58, missingFields: ["image", "specs"], reviewCount: 0 },
  { id: "P013", sku: "NT-MED-009", name: "Alcohol-based Hand Sanitizer 500ml", categoryL1: "Medical", categoryL2: "Hygiene", categoryL3: "Sanitizers", brand: "SafeHands", unitPriceUGX: 15000, moq: 40, leadTimeDays: 2, warrantyMonths: 0, stock: 0, status: "Draft", qualityScore: 65, missingFields: ["stock", "image"], reviewCount: 0 },
  { id: "P014", sku: "NT-MED-010", name: "Blood Pressure Monitor Digital", categoryL1: "Medical", categoryL2: "Diagnostics", categoryL3: "Monitoring", brand: "PulseCare", unitPriceUGX: 220000, moq: 2, leadTimeDays: 10, warrantyMonths: 24, stock: 25, status: "Draft", qualityScore: 70, missingFields: ["image", "description"], reviewCount: 0 },
  { id: "P015", sku: "NT-OFF-005", name: "Whiteboard Markers Assorted (Pack of 12)", categoryL1: "Office", categoryL2: "Writing", categoryL3: "Markers", brand: "BiClass", unitPriceUGX: 24000, moq: 15, leadTimeDays: 3, warrantyMonths: 0, stock: 200, status: "Rejected", qualityScore: 42, missingFields: ["image", "brand-mismatch", "description"], reviewCount: 0 },
];

const ug_districts = ["Kampala", "Wakiso", "Mukono", "Jinja", "Mbarara", "Gulu", "Lira", "Mbale", "Masaka", "Fort Portal", "Arua", "Soroti"];

export const tenders: Tender[] = [
  { id: "UG-TND-2026-0142", title: "Medical Supplies Framework Agreement", buyer: "Ministry of Health", category: "Medical", estimatedValueUGX: 480000000, submissionDeadline: daysAhead(4), district: "Kampala", bidBondRequired: true, bidBondAmountUGX: 4800000, numBidders: 2, matchScore: 89, winProbability: 72, preferenceEligible: true, status: "Closing Soon", description: "3-year framework agreement for medical PPE, diagnostics and consumables for regional hospitals.", eligibilityChecks: [{ requirement: "Tax clearance current", met: true }, { requirement: "PPDA active", met: false, reason: "Complete PPDA registration" }, { requirement: "Preference eligible (Women-led)", met: true }, { requirement: "NDA certification current", met: true }] },
  { id: "UG-TND-2026-0143", title: "ICT Equipment for Schools", buyer: "Ministry of Education", category: "ICT", estimatedValueUGX: 320000000, submissionDeadline: daysAhead(12), district: "Wakiso", bidBondRequired: true, bidBondAmountUGX: 3200000, numBidders: 8, matchScore: 42, winProbability: 18, preferenceEligible: false, status: "Open", eligibilityChecks: [{ requirement: "ICT category registration", met: false, reason: "Not in your categories" }, { requirement: "Tax clearance current", met: true }] },
  { id: "UG-TND-2026-0144", title: "Office Supplies Q2 Restock", buyer: "URA", category: "Office", estimatedValueUGX: 65000000, submissionDeadline: daysAhead(6), district: "Kampala", bidBondRequired: false, bidBondAmountUGX: 0, numBidders: 5, matchScore: 84, winProbability: 55, preferenceEligible: true, status: "Closing Soon", eligibilityChecks: [{ requirement: "Office category registration", met: true }, { requirement: "Tax clearance current", met: true }, { requirement: "Preference eligible", met: true }] },
  { id: "UG-TND-2026-0145", title: "Pharmaceutical Supplies Mbarara Regional Hospital", buyer: "Mbarara Regional Referral Hospital", category: "Medical", estimatedValueUGX: 120000000, submissionDeadline: daysAhead(9), district: "Mbarara", bidBondRequired: true, bidBondAmountUGX: 1200000, numBidders: 4, matchScore: 81, winProbability: 48, preferenceEligible: true, status: "Open", eligibilityChecks: [{ requirement: "NDA certification", met: true }, { requirement: "Tax clearance current", met: true }, { requirement: "Cold chain capability", met: false, reason: "Optional — declare in bid" }] },
  { id: "UG-TND-2026-0146", title: "School Furniture Supply — Northern Region", buyer: "Ministry of Education", category: "Works", estimatedValueUGX: 210000000, submissionDeadline: daysAhead(18), district: "Gulu", bidBondRequired: true, bidBondAmountUGX: 2100000, numBidders: 6, matchScore: 28, winProbability: 8, preferenceEligible: true, status: "Open", eligibilityChecks: [{ requirement: "Works category registration", met: false, reason: "Not in your categories" }] },
  { id: "UG-TND-2026-0147", title: "Laboratory Reagents Bulk Purchase", buyer: "Uganda Virus Research Institute", category: "Medical", estimatedValueUGX: 95000000, submissionDeadline: daysAhead(14), district: "Wakiso", bidBondRequired: true, bidBondAmountUGX: 950000, numBidders: 3, matchScore: 76, winProbability: 44, preferenceEligible: true, status: "Open", eligibilityChecks: [{ requirement: "Medical category registration", met: true }, { requirement: "Cold chain certification", met: false, reason: "Recommended for reagents" }] },
  { id: "UG-TND-2026-0148", title: "Stationery Framework - 2026 FY", buyer: "Ministry of Finance", category: "Office", estimatedValueUGX: 180000000, submissionDeadline: daysAhead(21), district: "Kampala", bidBondRequired: true, bidBondAmountUGX: 1800000, numBidders: 12, matchScore: 71, winProbability: 32, preferenceEligible: true, status: "Open", eligibilityChecks: [{ requirement: "Office category registration", met: true }, { requirement: "Tax clearance current", met: true }] },
  { id: "UG-TND-2026-0149", title: "Ambulance Consumables Restock", buyer: "St Mary's Hospital Lacor", category: "Medical", estimatedValueUGX: 42000000, submissionDeadline: daysAhead(3), district: "Gulu", bidBondRequired: false, bidBondAmountUGX: 0, numBidders: 2, matchScore: 87, winProbability: 68, preferenceEligible: true, status: "Closing Soon", eligibilityChecks: [{ requirement: "Medical category registration", met: true }, { requirement: "NDA cert", met: true }] },
  { id: "UG-TND-2026-0150", title: "Agricultural Inputs Distribution Programme", buyer: "NAADS", category: "Agriculture", estimatedValueUGX: 380000000, submissionDeadline: daysAhead(25), district: "Mbale", bidBondRequired: true, bidBondAmountUGX: 3800000, numBidders: 7, matchScore: 15, winProbability: 4, preferenceEligible: true, status: "Open", eligibilityChecks: [{ requirement: "Agriculture category", met: false, reason: "Not in your categories" }] },
  { id: "UG-TND-2026-0151", title: "Hospital Cleaning Supplies Framework", buyer: "Mulago National Referral Hospital", category: "Medical", estimatedValueUGX: 88000000, submissionDeadline: daysAhead(10), district: "Kampala", bidBondRequired: true, bidBondAmountUGX: 880000, numBidders: 5, matchScore: 79, winProbability: 41, preferenceEligible: true, status: "Open", eligibilityChecks: [{ requirement: "Medical category", met: true }, { requirement: "Tax clearance", met: true }] },
  { id: "UG-TND-2026-0152", title: "IT Networking Equipment", buyer: "Bank of Uganda", category: "ICT", estimatedValueUGX: 520000000, submissionDeadline: daysAhead(20), district: "Kampala", bidBondRequired: true, bidBondAmountUGX: 5200000, numBidders: 10, matchScore: 22, winProbability: 5, preferenceEligible: false, status: "Open", eligibilityChecks: [{ requirement: "ICT category", met: false }] },
  { id: "UG-TND-2026-0153", title: "First Aid Kits — District Health Offices", buyer: "Ministry of Health", category: "Medical", estimatedValueUGX: 55000000, submissionDeadline: daysAhead(7), district: "Kampala", bidBondRequired: false, bidBondAmountUGX: 0, numBidders: 4, matchScore: 83, winProbability: 52, preferenceEligible: true, status: "Closing Soon", eligibilityChecks: [{ requirement: "Medical category", met: true }, { requirement: "NDA cert", met: true }] },
  { id: "UG-TND-2026-0154", title: "Printer Toner & Cartridges", buyer: "URA", category: "Office", estimatedValueUGX: 38000000, submissionDeadline: daysAhead(11), district: "Kampala", bidBondRequired: false, bidBondAmountUGX: 0, numBidders: 6, matchScore: 68, winProbability: 30, preferenceEligible: true, status: "Open", eligibilityChecks: [{ requirement: "Office category", met: true }] },
  { id: "UG-TND-2026-0155", title: "Diagnostic Devices — Regional Hospitals", buyer: "Ministry of Health", category: "Medical", estimatedValueUGX: 240000000, submissionDeadline: daysAhead(16), district: "Fort Portal", bidBondRequired: true, bidBondAmountUGX: 2400000, numBidders: 3, matchScore: 85, winProbability: 58, preferenceEligible: true, status: "Open", eligibilityChecks: [{ requirement: "Medical category", met: true }, { requirement: "PPDA active", met: false }, { requirement: "Preference eligible", met: true }] },
  { id: "UG-TND-2026-0156", title: "Road Construction - Kampala-Jinja Highway Section", buyer: "UNRA", category: "Works", estimatedValueUGX: 4200000000, submissionDeadline: daysAhead(30), district: "Jinja", bidBondRequired: true, bidBondAmountUGX: 42000000, numBidders: 15, matchScore: 8, winProbability: 1, preferenceEligible: false, status: "Open", eligibilityChecks: [{ requirement: "Works category", met: false }] },
  { id: "UG-TND-2026-0157", title: "Vaccine Cold Storage Consumables", buyer: "UNEPI", category: "Medical", estimatedValueUGX: 75000000, submissionDeadline: daysAhead(13), district: "Kampala", bidBondRequired: true, bidBondAmountUGX: 750000, numBidders: 4, matchScore: 77, winProbability: 43, preferenceEligible: true, status: "Open", eligibilityChecks: [{ requirement: "Medical category", met: true }, { requirement: "Cold chain", met: false, reason: "Recommended" }] },
  { id: "UG-TND-2026-0158", title: "Office Furniture Refresh", buyer: "Ministry of Public Service", category: "Office", estimatedValueUGX: 145000000, submissionDeadline: daysAhead(22), district: "Kampala", bidBondRequired: true, bidBondAmountUGX: 1450000, numBidders: 8, matchScore: 55, winProbability: 22, preferenceEligible: true, status: "Open", eligibilityChecks: [{ requirement: "Office/Works category", met: true }] },
  { id: "UG-TND-2026-0159", title: "Maize Seed Distribution", buyer: "NAADS", category: "Agriculture", estimatedValueUGX: 92000000, submissionDeadline: daysAhead(17), district: "Soroti", bidBondRequired: true, bidBondAmountUGX: 920000, numBidders: 6, matchScore: 12, winProbability: 2, preferenceEligible: true, status: "Open", eligibilityChecks: [{ requirement: "Agriculture category", met: false }] },
  { id: "UG-TND-2026-0160", title: "Emergency PPE Reserve Restock", buyer: "Ministry of Health", category: "Medical", estimatedValueUGX: 165000000, submissionDeadline: daysAhead(8), district: "Kampala", bidBondRequired: true, bidBondAmountUGX: 1650000, numBidders: 3, matchScore: 91, winProbability: 74, preferenceEligible: true, status: "Closing Soon", eligibilityChecks: [{ requirement: "Medical category", met: true }, { requirement: "NDA cert", met: true }, { requirement: "Preference eligible", met: true }] },
  { id: "UG-TND-2026-0161", title: "Sanitary Products for Schools", buyer: "Ministry of Education", category: "Medical", estimatedValueUGX: 68000000, submissionDeadline: daysAhead(15), district: "Lira", bidBondRequired: false, bidBondAmountUGX: 0, numBidders: 4, matchScore: 73, winProbability: 38, preferenceEligible: true, status: "Open", eligibilityChecks: [{ requirement: "Medical/Hygiene category", met: true }, { requirement: "Preference eligible", met: true }] },
];

export const bids: Bid[] = [
  { id: "BID-00891", tenderId: "UG-TND-2025-0987", tenderTitle: "PPE Supply Q4 2025", buyer: "Ministry of Health", category: "Medical", bidAmountUGX: 88000000, submittedAt: daysAgo(3), status: "Under Evaluation" },
  { id: "BID-00887", tenderId: "UG-TND-2025-0964", tenderTitle: "Office Stationery Q4", buyer: "URA", category: "Office", bidAmountUGX: 42000000, submittedAt: daysAgo(10), status: "Shortlisted", technicalScore: 78, financialScore: 82, rank: 2 },
  { id: "BID-00882", tenderId: "UG-TND-2025-0951", tenderTitle: "Hospital Consumables — Jinja", buyer: "Jinja Regional Hospital", category: "Medical", bidAmountUGX: 65000000, submittedAt: daysAgo(18), status: "Won", technicalScore: 84, financialScore: 88, rank: 1 },
  { id: "BID-00876", tenderId: "UG-TND-2025-0921", tenderTitle: "First Aid Restock — Wakiso", buyer: "Ministry of Health", category: "Medical", bidAmountUGX: 28000000, submittedAt: daysAgo(24), status: "Won", technicalScore: 82, financialScore: 90, rank: 1 },
  { id: "BID-00874", tenderId: "UG-TND-2025-0918", tenderTitle: "Digital Thermometer Bulk Supply", buyer: "Ministry of Health", category: "Medical", bidAmountUGX: 48000000, submittedAt: daysAgo(30), status: "Lost", technicalScore: 74, financialScore: 62, rank: 4, rejectionReason: "Financial score too low — bid was UGX 12M above the lowest bidder." },
  { id: "BID-00869", tenderId: "UG-TND-2025-0901", tenderTitle: "Gloves & Masks Framework", buyer: "Mulago Hospital", category: "Medical", bidAmountUGX: 112000000, submittedAt: daysAgo(45), status: "Lost", technicalScore: 68, financialScore: 71, rank: 5, rejectionReason: "Technical scoring gap — quality certifications from an unrecognised issuer." },
  { id: "BID-00858", tenderId: "UG-TND-2025-0872", tenderTitle: "Paper & Toner Framework", buyer: "Ministry of Finance", category: "Office", bidAmountUGX: 38000000, submittedAt: daysAgo(58), status: "Disqualified", rejectionReason: "Bid bond amount was UGX 200,000 short of required." },
  { id: "BID-00901", tenderId: "UG-TND-2026-0140", tenderTitle: "Ministry of Defence — Emergency Medical", buyer: "Ministry of Defence", category: "Medical", bidAmountUGX: 155000000, submittedAt: daysAgo(0), status: "Draft" },
];

export const orders: Order[] = [
  { id: "UG-ORD-000891", buyer: "Jinja Regional Hospital", category: "Medical", totalUGX: 12400000, orderDate: daysAgo(7), expectedDelivery: daysAhead(2), deliveryStatus: "In Transit", paymentStatus: "Pending", district: "Jinja", lineItems: [{ productName: "Surgical Face Masks (Box of 50)", qty: 100, unitPriceUGX: 45000, lineTotal: 4500000 }, { productName: "Nitrile Gloves (Box of 100)", qty: 80, unitPriceUGX: 68000, lineTotal: 5440000 }, { productName: "Digital Thermometer", qty: 75, unitPriceUGX: 32000, lineTotal: 2400000 }] },
  { id: "UG-ORD-000892", buyer: "URA", category: "Office", totalUGX: 5800000, orderDate: daysAgo(3), expectedDelivery: daysAhead(4), deliveryStatus: "Pending", paymentStatus: "Pending", district: "Kampala", lineItems: [{ productName: "A4 Copy Paper", qty: 200, unitPriceUGX: 22000, lineTotal: 4400000 }, { productName: "Ballpoint Pens (Pack of 50)", qty: 90, unitPriceUGX: 15000, lineTotal: 1350000 }] },
  { id: "UG-ORD-000885", buyer: "Ministry of Health", category: "Medical", totalUGX: 28000000, orderDate: daysAgo(24), expectedDelivery: daysAgo(14), actualDelivery: daysAgo(14), deliveryStatus: "Delivered", paymentStatus: "Paid", district: "Kampala", lineItems: [{ productName: "PPE Kit Bundle", qty: 200, unitPriceUGX: 140000, lineTotal: 28000000 }] },
  { id: "UG-ORD-000882", buyer: "Mulago National Referral", category: "Medical", totalUGX: 45000000, orderDate: daysAgo(35), expectedDelivery: daysAgo(20), actualDelivery: daysAgo(19), deliveryStatus: "Delivered", paymentStatus: "Paid", district: "Kampala", lineItems: [{ productName: "Pulse Oximeter Fingertip", qty: 500, unitPriceUGX: 85000, lineTotal: 42500000 }, { productName: "Digital Thermometer", qty: 80, unitPriceUGX: 32000, lineTotal: 2500000 }] },
  { id: "UG-ORD-000878", buyer: "Jinja Regional Hospital", category: "Medical", totalUGX: 6500000, orderDate: daysAgo(45), expectedDelivery: daysAgo(38), actualDelivery: daysAgo(38), deliveryStatus: "Delivered", paymentStatus: "Paid", district: "Jinja", lineItems: [{ productName: "Cotton Wool Rolls", qty: 350, unitPriceUGX: 18000, lineTotal: 6300000 }] },
  { id: "UG-ORD-000895", buyer: "St Mary's Hospital Lacor", category: "Medical", totalUGX: 9800000, orderDate: daysAgo(2), expectedDelivery: daysAhead(6), deliveryStatus: "Pending", paymentStatus: "Pending", district: "Gulu", lineItems: [{ productName: "Nitrile Gloves (Box of 100)", qty: 140, unitPriceUGX: 68000, lineTotal: 9520000 }] },
  { id: "UG-ORD-000870", buyer: "Ministry of Education", category: "Office", totalUGX: 15200000, orderDate: daysAgo(52), expectedDelivery: daysAgo(45), actualDelivery: daysAgo(43), deliveryStatus: "Delivered", paymentStatus: "Paid", district: "Kampala", lineItems: [{ productName: "A4 Copy Paper", qty: 700, unitPriceUGX: 22000, lineTotal: 15200000 }] },
  { id: "UG-ORD-000898", buyer: "Mbarara Regional Hospital", category: "Medical", totalUGX: 18500000, orderDate: daysAgo(12), expectedDelivery: daysAgo(2), deliveryStatus: "Partial", paymentStatus: "Processing", district: "Mbarara", lineItems: [{ productName: "Disposable Syringes 5ml", qty: 250, unitPriceUGX: 55000, lineTotal: 13750000 }, { productName: "Surgical Gauze", qty: 400, unitPriceUGX: 12000, lineTotal: 4800000 }] },
  { id: "UG-ORD-000866", buyer: "URA", category: "Office", totalUGX: 4200000, orderDate: daysAgo(65), expectedDelivery: daysAgo(60), actualDelivery: daysAgo(59), deliveryStatus: "Delivered", paymentStatus: "Paid", district: "Kampala", lineItems: [{ productName: "Ballpoint Pens (Pack of 50)", qty: 200, unitPriceUGX: 15000, lineTotal: 3000000 }, { productName: "Manila Folders", qty: 40, unitPriceUGX: 28000, lineTotal: 1120000 }] },
  { id: "UG-ORD-000893", buyer: "Ministry of Health", category: "Medical", totalUGX: 22400000, orderDate: daysAgo(5), expectedDelivery: daysAhead(3), deliveryStatus: "In Transit", paymentStatus: "Pending", district: "Kampala", lineItems: [{ productName: "First Aid Kits", qty: 80, unitPriceUGX: 280000, lineTotal: 22400000 }] },
  { id: "UG-ORD-000860", buyer: "Uganda Virus Research Institute", category: "Medical", totalUGX: 34000000, orderDate: daysAgo(78), expectedDelivery: daysAgo(70), actualDelivery: daysAgo(68), deliveryStatus: "Delivered", paymentStatus: "Paid", district: "Wakiso", lineItems: [{ productName: "Nitrile Gloves (Box of 100)", qty: 500, unitPriceUGX: 68000, lineTotal: 34000000 }] },
  { id: "UG-ORD-000894", buyer: "Mulago Hospital", category: "Medical", totalUGX: 7200000, orderDate: daysAgo(4), expectedDelivery: daysAhead(3), deliveryStatus: "Pending", paymentStatus: "Pending", district: "Kampala", lineItems: [{ productName: "Surgical Face Masks (Box of 50)", qty: 160, unitPriceUGX: 45000, lineTotal: 7200000 }] },
];

export const payments: Payment[] = [
  { id: "PAY-000891", orderId: "UG-ORD-000891", invoiceNumber: "", invoiceDate: "", grossUGX: 12400000, vatUGX: 2232000, whtUGX: 744000, netUGX: 13888000, status: "Not Invoiced", buyer: "Jinja Regional Hospital" },
  { id: "PAY-000892", orderId: "UG-ORD-000892", invoiceNumber: "", invoiceDate: "", grossUGX: 5800000, vatUGX: 1044000, whtUGX: 348000, netUGX: 6496000, status: "Not Invoiced", buyer: "URA" },
  { id: "PAY-000885", orderId: "UG-ORD-000885", invoiceNumber: "INV-2026-000885", invoiceDate: daysAgo(13), grossUGX: 28000000, vatUGX: 5040000, whtUGX: 1680000, netUGX: 31360000, status: "Paid", paidDate: daysAgo(3), daysToPayment: 10, buyer: "Ministry of Health" },
  { id: "PAY-000882", orderId: "UG-ORD-000882", invoiceNumber: "INV-2026-000882", invoiceDate: daysAgo(18), grossUGX: 45000000, vatUGX: 8100000, whtUGX: 2700000, netUGX: 50400000, status: "Paid", paidDate: daysAgo(4), daysToPayment: 14, buyer: "Mulago National Referral" },
  { id: "PAY-000878", orderId: "UG-ORD-000878", invoiceNumber: "INV-2026-000878", invoiceDate: daysAgo(37), grossUGX: 6500000, vatUGX: 1170000, whtUGX: 390000, netUGX: 7280000, status: "Paid", paidDate: daysAgo(20), daysToPayment: 17, buyer: "Jinja Regional Hospital" },
  { id: "PAY-000895", orderId: "UG-ORD-000895", invoiceNumber: "", invoiceDate: "", grossUGX: 9800000, vatUGX: 1764000, whtUGX: 588000, netUGX: 10976000, status: "Not Invoiced", buyer: "St Mary's Hospital Lacor" },
  { id: "PAY-000870", orderId: "UG-ORD-000870", invoiceNumber: "INV-2026-000870", invoiceDate: daysAgo(42), grossUGX: 15200000, vatUGX: 2736000, whtUGX: 912000, netUGX: 17024000, status: "Paid", paidDate: daysAgo(25), daysToPayment: 17, buyer: "Ministry of Education" },
  { id: "PAY-000898", orderId: "UG-ORD-000898", invoiceNumber: "INV-2026-000898", invoiceDate: daysAgo(1), grossUGX: 18500000, vatUGX: 3330000, whtUGX: 1110000, netUGX: 20720000, status: "Under Review", buyer: "Mbarara Regional Hospital" },
  { id: "PAY-000866", orderId: "UG-ORD-000866", invoiceNumber: "INV-2026-000866", invoiceDate: daysAgo(58), grossUGX: 4200000, vatUGX: 756000, whtUGX: 252000, netUGX: 4704000, status: "Paid", paidDate: daysAgo(40), daysToPayment: 18, buyer: "URA" },
  { id: "PAY-000893", orderId: "UG-ORD-000893", invoiceNumber: "INV-2026-000893", invoiceDate: daysAgo(2), grossUGX: 22400000, vatUGX: 4032000, whtUGX: 1344000, netUGX: 25088000, status: "Invoiced", buyer: "Ministry of Health" },
  { id: "PAY-000860", orderId: "UG-ORD-000860", invoiceNumber: "INV-2026-000860", invoiceDate: daysAgo(66), grossUGX: 34000000, vatUGX: 6120000, whtUGX: 2040000, netUGX: 38080000, status: "Paid", paidDate: daysAgo(45), daysToPayment: 21, buyer: "Uganda Virus Research Institute" },
  { id: "PAY-000894", orderId: "UG-ORD-000894", invoiceNumber: "", invoiceDate: "", grossUGX: 7200000, vatUGX: 1296000, whtUGX: 432000, netUGX: 8064000, status: "Not Invoiced", buyer: "Mulago Hospital" },
];

export const certifications: Certification[] = [
  { id: "CERT-001", name: "Tax Clearance Certificate", issuer: "Uganda Revenue Authority", number: "TCC/2025/48221", issueDate: daysAgo(180), expiryDate: daysAhead(185), status: "Valid", daysToExpiry: 185, kind: "document" },
  { id: "CERT-002", name: "Trade Licence", issuer: "Kampala Capital City Authority", number: "TL/KCCA/2026/9021", issueDate: daysAgo(90), expiryDate: daysAhead(275), status: "Valid", daysToExpiry: 275, kind: "document" },
  { id: "CERT-003", name: "NDA Certification", issuer: "National Drug Authority", number: "NDA/CERT/2025/3488", issueDate: daysAgo(325), expiryDate: daysAhead(42), status: "Expiring Soon", daysToExpiry: 42, kind: "certification" },
  { id: "CERT-004", name: "NSSF Compliance Certificate", issuer: "National Social Security Fund", number: "NSSF/2025/45211", issueDate: daysAgo(260), expiryDate: daysAhead(28), status: "Expiring Soon", daysToExpiry: 28, kind: "document" },
  { id: "CERT-005", name: "ISO 9001 Quality Management", issuer: "SGS Uganda", number: "ISO/UG/2023/1188", issueDate: daysAgo(390), expiryDate: daysAgo(24), status: "Expired", daysToExpiry: -24, kind: "certification" },
  { id: "CERT-006", name: "Bank Reference Letter", issuer: "Stanbic Bank Uganda", number: "SB/REF/2025/8842", issueDate: daysAgo(100), expiryDate: daysAhead(265), status: "Valid", daysToExpiry: 265, kind: "document" },
  { id: "CERT-007", name: "Audited Financial Statements 2024", issuer: "PwC Uganda", number: "PWC/AUD/2025/223", issueDate: daysAgo(120), expiryDate: daysAhead(245), status: "Valid", daysToExpiry: 245, kind: "document" },
];

export const threads: MessageThread[] = [
  {
    id: "TH-001", subject: "Documents stage approved", fromName: "GEP Operations", channel: "In-app", lastAt: daysAgo(20), unread: 0,
    messages: [
      { id: "M001", from: "ops", fromName: "GEP Operations", channel: "In-app", subject: "Documents stage approved", body: "We've approved your Documents stage. Please proceed to Category selection.", at: daysAgo(20), read: true, threadId: "TH-001" },
      { id: "M002", from: "me", fromName: "Me", channel: "In-app", body: "Thank you! Moving to category selection now.", at: daysAgo(20), read: true, threadId: "TH-001" },
    ]
  },
  {
    id: "TH-002", subject: "Catalogue submission — action needed", fromName: "GEP Operations", channel: "In-app", lastAt: daysAgo(1), unread: 1,
    messages: [
      { id: "M010", from: "ops", fromName: "GEP Operations", channel: "In-app", subject: "Catalogue — publish 7 more", body: "You've published 3 products. Publish 7 more (10 minimum) and submit for review to advance to PPDA registration.", at: daysAgo(1), read: false, threadId: "TH-002" },
    ]
  },
  {
    id: "TH-003", subject: "Order UG-ORD-000891 — delivery clarification", fromName: "Jinja Regional Hospital", channel: "In-app", lastAt: daysAgo(2), unread: 1,
    messages: [
      { id: "M020", from: "buyer", fromName: "Dr. Okello (Procurement)", channel: "In-app", subject: "Delivery Monday?", body: "Can you confirm delivery by Monday morning? Our ward stock is running low.", at: daysAgo(2), read: false, threadId: "TH-003" },
    ]
  },
  {
    id: "TH-004", subject: "NDA cert expiring soon", fromName: "GEP System", channel: "Email", lastAt: daysAgo(3), unread: 0,
    messages: [
      { id: "M030", from: "system", fromName: "GEP System", channel: "Email", subject: "NDA certification expiring in 42 days", body: "Your NDA Certification (NDA/CERT/2025/3488) expires in 42 days. Renew now to keep bidding on pharmaceutical tenders.", at: daysAgo(3), read: true, threadId: "TH-004" },
    ]
  },
  {
    id: "TH-005", subject: "WhatsApp support conversation", fromName: "GEP Support", channel: "WhatsApp", lastAt: daysAgo(5), unread: 0,
    messages: [
      { id: "M040", from: "me", fromName: "Me", channel: "WhatsApp", body: "Hi, how do I add products in bulk?", at: daysAgo(5), read: true, threadId: "TH-005" },
      { id: "M041", from: "ops", fromName: "GEP Support", channel: "WhatsApp", body: "You can upload a CSV in Catalogue → Bulk Upload. Sample template attached.", at: daysAgo(5), read: true, threadId: "TH-005", attachmentUrl: "template.csv" },
    ]
  },
  {
    id: "TH-006", subject: "Bid BID-00882 — you won!", fromName: "GEP System", channel: "Telegram", lastAt: daysAgo(18), unread: 0,
    messages: [
      { id: "M050", from: "system", fromName: "GEP System", channel: "Telegram", body: "🎉 Congratulations! Your bid for Hospital Consumables — Jinja has been awarded. Please review contract terms in the Bids tab.", at: daysAgo(18), read: true, threadId: "TH-006" },
    ]
  },
];

export const healthScoreHistory = [
  { m: "Jan", score: 62 }, { m: "Feb", score: 65 }, { m: "Mar", score: 68 }, { m: "Apr", score: 66 }, { m: "May", score: 70 }, { m: "Jun", score: 72 }, { m: "Jul", score: 71 }, { m: "Aug", score: 73 }, { m: "Sep", score: 74 }, { m: "Oct", score: 75 }, { m: "Nov", score: 74 }, { m: "Dec", score: 76 },
];

export const onTimeDelivery = [
  { m: "Jul", pct: 78 }, { m: "Aug", pct: 80 }, { m: "Sep", pct: 82 }, { m: "Oct", pct: 79 }, { m: "Nov", pct: 84 }, { m: "Dec", pct: 82 },
];

export const complaints = [
  { m: "Jul", n: 3 }, { m: "Aug", n: 2 }, { m: "Sep", n: 1 }, { m: "Oct", n: 2 }, { m: "Nov", n: 1 }, { m: "Dec", n: 1 },
];

export const reviews = [
  { id: "R1", buyer: "Ministry of Health", rating: 5, sentiment: "positive" as const, body: "Excellent delivery time. Quality PPE. Will re-order.", at: daysAgo(5) },
  { id: "R2", buyer: "Jinja Regional Hospital", rating: 4, sentiment: "positive" as const, body: "Good products but one carton had minor damage in transit.", at: daysAgo(15) },
  { id: "R3", buyer: "Mulago Hospital", rating: 3, sentiment: "neutral" as const, body: "Delivery was 2 days late but products were fine.", at: daysAgo(28) },
  { id: "R4", buyer: "URA", rating: 5, sentiment: "positive" as const, body: "Very professional, prompt invoicing.", at: daysAgo(40) },
  { id: "R5", buyer: "Mbarara Regional Hospital", rating: 2, sentiment: "negative" as const, body: "Partial delivery, still waiting for balance.", at: daysAgo(3) },
];

export const activityFeed = [
  { id: "A1", at: daysAgo(0), text: "Order UG-ORD-000891 marked In Transit" },
  { id: "A2", at: daysAgo(1), text: "Ops sent a note about your catalogue submission" },
  { id: "A3", at: daysAgo(2), text: "Buyer Jinja Regional replied on Order UG-ORD-000891" },
  { id: "A4", at: daysAgo(3), text: "Bid BID-00891 submitted for PPE Supply Q4 2025" },
  { id: "A5", at: daysAgo(4), text: "Payment PAY-000885 received (UGX 31.36M)" },
  { id: "A6", at: daysAgo(7), text: "New order UG-ORD-000891 from Jinja Regional Hospital" },
];
