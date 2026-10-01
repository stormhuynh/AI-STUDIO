export type Role = 'ctv' | 'nv';

export type CollaboratorTier = 'silver' | 'gold' | 'diamond';

export interface Collaborator {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  tier: CollaboratorTier;
  commissionRate: number; // e.g. 5, 7, 10
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  activeCustomers: number;
  totalRevenue: number;
  totalBookings: number;
  winRate: number;
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  companyName: string;
  taxCode: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  collaboratorId: string;
  type: 'b2b' | 'individual';
  totalOrders: number;
  totalSpend: number;
  outstandingDebt: number;
  notes?: string;
  createdAt: string;
}

export type DealStage = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';

export interface DealActivity {
  id: string;
  type: 'call' | 'zalo' | 'quote' | 'note';
  content: string;
  createdAt: string;
  author: string;
}

export interface LeadDeal {
  id: string;
  code: string;
  title: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  collaboratorId: string;
  source: 'Zalo' | 'Chatbot' | 'Hotline' | 'Direct' | 'Website';
  stage: DealStage;
  route: string;
  cargoType: string;
  estimatedWeight: number; // kg
  estimatedValue: number; // VND
  lossReason?: string;
  notes?: string;
  lastActivity: string;
  createdAt: string;
  activities: DealActivity[];
}

export interface BookingPackageItem {
  id: string;
  name: string;
  hsCode?: string;
  unitPrice: number;
  currency: string;
  unit: string;
  quantity: number;
  totalAmount: number;
}

export interface BookingPackage {
  id: string;
  length: number; // cm
  width: number; // cm
  height: number; // cm
  gw: number; // kg
  items: BookingPackageItem[];
}

export type BookingStatus =
  | 'draft'
  | 'sent'
  | 'booking_confirmed'
  | 'awaiting_pickup'
  | 'picked_up'
  | 'measuring'
  | 'ctv_confirmed'
  | 'creating_bill'
  | 'bill_created'
  | 'shipping'
  | 'delivered'
  | 'reject'
  | 'cancelled';

export interface BookingTimelineItem {
  title: string;
  time: string;
  completed: boolean;
}

export interface Booking {
  id: string; // e.g. BK-88219
  code: string;
  date: string;
  senderName: string;
  senderPhone: string;
  senderEmail?: string;
  senderCompany?: string;
  senderAddress: string;
  senderCountry: string;
  isSenderOda?: boolean;
  receiverName: string;
  receiverPhone: string;
  receiverEmail?: string;
  receiverCompany?: string;
  receiverAddress: string;
  receiverCountry: string;
  isReceiverOda?: boolean;
  service: string;
  pickupMethod: string;
  description: string;
  packages: BookingPackage[];
  totalGw: number;
  totalVw: number;
  totalCw: number;
  declaredValue: number;
  actualGw?: number;
  actualCw?: number;
  actualPackagesCount?: number;
  actualMeasured: boolean;
  price: number;
  revisedPrice?: number;
  ctvNewPrice?: number;
  cost: number;
  commission: number;
  collaboratorId: string;
  customerId?: string;
  dealId?: string;
  status: BookingStatus;
  rejectReason?: string;
  internalNote?: string;
  trackingNumber?: string;
  carrier?: string;
  timeline: BookingTimelineItem[];
}

export interface Waybill {
  id: string;
  trackingNumber: string;
  carrier: 'DHL' | 'FedEx' | 'UPS' | 'Chuyên Tuyến Vngrow';
  bookingId: string;
  route: string;
  goodsName: string;
  totalPackage: number;
  totalCw: number;
  status: 'In Transit' | 'Customs Clearance' | 'Delivered' | 'Exception';
  note: string;
  trackingUrl?: string;
}

export type RfqStatus = 'draft' | 'sent' | 'reviewing' | 'quoted' | 'accepted' | 'rejected' | 'cancelled';

export interface RfqQuote {
  shippingFee: number;
  customsFee: number;
  specialFee: number;
  totalFee: number;
  note: string;
  quotedDate: string;
}

export interface Rfq {
  id: string; // RFQ-10021
  date: string;
  collaboratorId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCompany?: string;
  originCountry: string;
  destCountry: string;
  desiredServices: string[];
  goodsDescription: string;
  estimatedWeight: number;
  hsCode?: string;
  storageRequirement?: string;
  status: RfqStatus;
  quote?: RfqQuote;
  msdsFile?: string;
}

export interface CommissionRecord {
  id: string;
  bookingCode: string;
  date: string;
  collaboratorId: string;
  customerName: string;
  route: string;
  cw: number;
  isMeasured: boolean;
  salePrice: number;
  commissionAmount: number;
  status: 'pending_audit' | 'paid';
  paidDate?: string;
}

export interface Invoice {
  id: string;
  date: string;
  invoiceCode: string;
  customerName: string;
  collaboratorId: string;
  bookingCode: string;
  type: 'Chính' | 'Phí hoàn hàng' | 'Phụ phí cân đo';
  amount: number;
  status: 'paid' | 'unpaid';
  method: string;
  receiptImage?: string;
}

export interface AuditLog {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  details?: string;
}
