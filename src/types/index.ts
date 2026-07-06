export type Stage = "Account" | "Identity" | "Documents" | "Category" | "Banking" | "Catalogue" | "PPDA" | "Live";

export const STAGES: Stage[] = ["Account", "Identity", "Documents", "Category", "Banking", "Catalogue", "PPDA", "Live"];

export interface Supplier {
  id: string;
  name: string;
  businessType: "Sole Proprietor" | "Ltd Company" | "Partnership" | "Cooperative";
  ursbNumber?: string;
  tin?: string;
  vatRegistered: boolean;
  district: string;
  region: string;
  contactEmail: string;
  contactPhone: string;
  currentStage: Stage;
  verificationStatus: "Draft" | "In Progress" | "Verified" | "Suspended";
  isSME: boolean;
  isWomenLed: boolean;
  isYouthLed: boolean;
  isPWDs: boolean;
  categoryPrimary?: string;
  categorySecondary?: string;
  bankAccount?: string;
  mobileMoney?: string;
  healthScore: number;
  performanceRating: number;
  riskScore: number;
  ppdaId?: string;
  goLiveDate?: string;
}

export interface RequiredAction {
  id: string;
  label: string;
  completed: boolean;
  type: "form" | "upload" | "select" | "payment" | "review";
}

export interface AgentVerdict {
  agentName: string;
  verdict: "Pass" | "Fail" | "Manual Review";
  confidence: number;
  message: string;
  ranAt: string;
}

export interface JourneyStage {
  stage: Stage;
  status: "Not Started" | "In Progress" | "Under Review" | "Approved" | "Rejected" | "Complete";
  startedAt?: string;
  completedAt?: string;
  agentVerdicts: AgentVerdict[];
  requiredActions: RequiredAction[];
  blockedReason?: string;
  opsNote?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  categoryL1: string;
  categoryL2: string;
  categoryL3: string;
  brand: string;
  unitPriceUGX: number;
  moq: number;
  leadTimeDays: number;
  warrantyMonths: number;
  stock: number;
  imageUrl?: string;
  rating?: number;
  status: "Draft" | "Under Review" | "Published" | "Rejected";
  qualityScore: number;
  missingFields: string[];
  reviewCount: number;
}

export interface EligibilityCheck {
  requirement: string;
  met: boolean;
  reason?: string;
}

export interface Tender {
  id: string;
  title: string;
  buyer: string;
  category: string;
  estimatedValueUGX: number;
  submissionDeadline: string;
  district: string;
  bidBondRequired: boolean;
  bidBondAmountUGX: number;
  numBidders: number;
  matchScore: number;
  winProbability: number;
  eligibilityChecks: EligibilityCheck[];
  preferenceEligible: boolean;
  status: "Open" | "Closing Soon" | "Bids Under Evaluation" | "Awarded" | "Cancelled";
  description?: string;
}

export interface Bid {
  id: string;
  tenderId: string;
  tenderTitle: string;
  buyer: string;
  category: string;
  bidAmountUGX: number;
  submittedAt: string;
  status: "Draft" | "Submitted" | "Under Evaluation" | "Shortlisted" | "Won" | "Lost" | "Disqualified";
  technicalScore?: number;
  financialScore?: number;
  rank?: number;
  rejectionReason?: string;
}

export interface OrderLineItem {
  productName: string;
  qty: number;
  unitPriceUGX: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  buyer: string;
  category: string;
  totalUGX: number;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  deliveryStatus: "Pending" | "In Transit" | "Delivered" | "Partial";
  paymentStatus: "Pending" | "Processing" | "Paid";
  district: string;
  lineItems: OrderLineItem[];
}

export interface Payment {
  id: string;
  orderId: string;
  invoiceNumber: string;
  invoiceDate: string;
  grossUGX: number;
  vatUGX: number;
  whtUGX: number;
  netUGX: number;
  status: "Not Invoiced" | "Invoiced" | "Under Review" | "Approved" | "Paid";
  paidDate?: string;
  daysToPayment?: number;
  buyer: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  status: "Valid" | "Expiring Soon" | "Expired";
  daysToExpiry: number;
  fileUrl?: string;
  kind: "certification" | "document";
}

export interface Message {
  id: string;
  from: "buyer" | "ops" | "system" | "me";
  fromName: string;
  channel: "In-app" | "WhatsApp" | "Telegram" | "Email";
  subject?: string;
  body: string;
  at: string;
  read: boolean;
  threadId: string;
  attachmentUrl?: string;
}

export interface MessageThread {
  id: string;
  subject: string;
  fromName: string;
  channel: "In-app" | "WhatsApp" | "Telegram" | "Email";
  lastAt: string;
  unread: number;
  messages: Message[];
}
