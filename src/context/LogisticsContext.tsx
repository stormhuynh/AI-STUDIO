import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Collaborator,
  Customer,
  LeadDeal,
  DealStage,
  Booking,
  BookingStatus,
  Waybill,
  Rfq,
  RfqQuote,
  CommissionRecord,
  Invoice,
  AuditLog,
} from '../types';
import {
  INITIAL_COLLABORATORS,
  INITIAL_CUSTOMERS,
  INITIAL_DEALS,
  INITIAL_BOOKINGS,
  INITIAL_WAYBILLS,
  INITIAL_RFQS,
  INITIAL_COMMISSIONS,
  INITIAL_INVOICES,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

export type PageId =
  | 'dashboard'
  | 'crm'
  | 'customers'
  | 'collaborators'
  | 'booking'
  | 'waybill'
  | 'rfq'
  | 'commission'
  | 'invoice'
  | 'pricing'
  | 'audit'
  | 'settings';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface LogisticsContextType {
  role: Role;
  setRole: (role: Role) => void;
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  activeCollaborator: Collaborator;
  setActiveCollaborator: (ctv: Collaborator) => void;
  collaborators: Collaborator[];
  customers: Customer[];
  deals: LeadDeal[];
  bookings: Booking[];
  waybills: Waybill[];
  rfqs: Rfq[];
  commissions: CommissionRecord[];
  invoices: Invoice[];
  auditLogs: AuditLog[];
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Filtered views based on Role and active Collaborator
  visibleCustomers: Customer[];
  visibleDeals: LeadDeal[];
  visibleBookings: Booking[];
  visibleCommissions: CommissionRecord[];
  visibleRfqs: Rfq[];
  selectedCtvFilter: string; // for NV view filtering ('all' or ctv.id)
  setSelectedCtvFilter: (id: string) => void;

  // Operations
  addCustomer: (customer: Omit<Customer, 'id' | 'code' | 'createdAt' | 'totalOrders' | 'totalSpend' | 'outstandingDebt'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addDeal: (deal: Omit<LeadDeal, 'id' | 'code' | 'createdAt' | 'lastActivity' | 'activities'>) => LeadDeal;
  updateDealStage: (id: string, stage: DealStage, lossReason?: string) => void;
  addDealActivity: (dealId: string, content: string, type: 'call' | 'zalo' | 'quote' | 'note') => void;
  convertDealToCustomer: (dealId: string) => Customer | null;
  convertDealToBooking: (dealId: string) => Booking;
  addBooking: (booking: Omit<Booking, 'id' | 'code' | 'date' | 'timeline'>) => Booking;
  sendBooking: (bookingId: string) => void;
  rejectBooking: (bookingId: string, reason: string) => void;
  acceptBooking: (bookingId: string) => void;
  updateBookingContent: (bookingId: string, updates: Partial<Booking>, resend?: boolean) => void;
  deleteBooking: (bookingId: string) => void;
  updateBookingNote: (bookingId: string, note: string) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  confirmCtvMeasurementAndPrice: (bookingId: string, ctvNewPrice: number) => void;
  updateBookingMeasurements: (bookingId: string, actualGw: number, actualCw: number, revisedPrice: number) => void;
  confirmBookingMeasurements: (bookingId: string) => void;
  createWaybill: (bookingId: string, trackingNumber: string, carrier: Waybill['carrier']) => void;
  addRfq: (rfq: Omit<Rfq, 'id' | 'date' | 'status'>) => Rfq;
  sendRfq: (rfqId: string) => void;
  deleteRfq: (rfqId: string) => void;
  updateRfqContent: (rfqId: string, updates: Partial<Rfq>, resend?: boolean) => void;
  submitQuoteForRfq: (rfqId: string, quote: RfqQuote) => void;
  approveCommissionPayment: (commissionId: string) => void;
  payAllCtvCommission: (collaboratorId: string) => void;
  markInvoicePaid: (invoiceId: string) => void;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export const LogisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem('vngrow_role') as Role) || 'ctv';
  });

  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);
  const [activeCollaborator, setActiveCollaborator] = useState<Collaborator>(INITIAL_COLLABORATORS[0]);
  const [selectedCtvFilter, setSelectedCtvFilter] = useState<string>('all');

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('vngrow_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [deals, setDeals] = useState<LeadDeal[]>(() => {
    const saved = localStorage.getItem('vngrow_deals');
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('vngrow_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [waybills, setWaybills] = useState<Waybill[]>(() => {
    const saved = localStorage.getItem('vngrow_waybills');
    return saved ? JSON.parse(saved) : INITIAL_WAYBILLS;
  });

  const [rfqs, setRfqs] = useState<Rfq[]>(() => {
    const saved = localStorage.getItem('vngrow_rfqs');
    return saved ? JSON.parse(saved) : INITIAL_RFQS;
  });

  const [commissions, setCommissions] = useState<CommissionRecord[]>(() => {
    const saved = localStorage.getItem('vngrow_commissions');
    return saved ? JSON.parse(saved) : INITIAL_COMMISSIONS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('vngrow_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem('vngrow_role', newRole);
    addToast(
      newRole === 'ctv'
        ? `Đã chuyển sang giao diện Cộng Tác Viên (${activeCollaborator.name})`
        : 'Đã chuyển sang giao diện Quản Trị / Điều Hành (Vngrow Admin)',
      'info'
    );
  };

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAudit = (action: string, target: string) => {
    const now = new Date();
    const timeStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const actor = role === 'ctv' ? `${activeCollaborator.name} (CTV)` : 'Trần Điều Hành (NV)';
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      time: timeStr,
      actor,
      action,
      target,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('vngrow_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('vngrow_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('vngrow_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('vngrow_commissions', JSON.stringify(commissions));
  }, [commissions]);

  useEffect(() => {
    localStorage.setItem('vngrow_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Role-based visibility
  const visibleCustomers = customers.filter((c) => {
    if (role === 'ctv') return c.collaboratorId === activeCollaborator.id;
    if (selectedCtvFilter !== 'all') return c.collaboratorId === selectedCtvFilter;
    return true;
  });

  const visibleDeals = deals.filter((d) => {
    if (role === 'ctv') return d.collaboratorId === activeCollaborator.id;
    if (selectedCtvFilter !== 'all') return d.collaboratorId === selectedCtvFilter;
    return true;
  });

  const visibleBookings = bookings.filter((b) => {
    if (role === 'ctv') return b.collaboratorId === activeCollaborator.id;
    if (selectedCtvFilter !== 'all') return b.collaboratorId === selectedCtvFilter;
    return true;
  });

  const visibleCommissions = commissions.filter((c) => {
    if (role === 'ctv') return c.collaboratorId === activeCollaborator.id;
    if (selectedCtvFilter !== 'all') return c.collaboratorId === selectedCtvFilter;
    return true;
  });

  const visibleRfqs = rfqs.filter((r) => {
    if (role === 'ctv') return r.collaboratorId === activeCollaborator.id;
    if (selectedCtvFilter !== 'all') return r.collaboratorId === selectedCtvFilter;
    return true;
  });

  // Action implementations
  const addCustomer = (customerData: Omit<Customer, 'id' | 'code' | 'createdAt' | 'totalOrders' | 'totalSpend' | 'outstandingDebt'>) => {
    const newCode = `KH-${1020 + customers.length}`;
    const newCustomer: Customer = {
      ...customerData,
      id: 'cust-' + Date.now(),
      code: newCode,
      createdAt: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpend: 0,
      outstandingDebt: 0,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    logAudit('Thêm Khách Hàng mới', `${newCustomer.code} - ${newCustomer.name}`);
    addToast(`Đã thêm khách hàng ${newCustomer.name} (${newCustomer.code}) thành công!`);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    addToast('Đã cập nhật thông tin khách hàng');
  };

  const addDeal = (dealData: Omit<LeadDeal, 'id' | 'code' | 'createdAt' | 'lastActivity' | 'activities'>) => {
    const newCode = `DL-${1010 + deals.length}`;
    const newDeal: LeadDeal = {
      ...dealData,
      id: 'deal-' + Date.now(),
      code: newCode,
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: 'Vừa xong',
      activities: [
        {
          id: 'act-' + Date.now(),
          type: 'note',
          content: 'Cơ hội (Deal) được tạo mới trên hệ thống.',
          createdAt: new Date().toLocaleString('vi-VN'),
          author: role === 'ctv' ? `${activeCollaborator.name} (CTV)` : 'Trần Điều Hành (NV)',
        },
      ],
    };
    setDeals((prev) => [newDeal, ...prev]);
    logAudit('Tạo Deal mới', `${newDeal.code}: ${newDeal.title}`);
    addToast(`Tạo cơ hội mới ${newDeal.code} thành công!`);
    return newDeal;
  };

  const updateDealStage = (id: string, stage: DealStage, lossReason?: string) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const stageNames: Record<DealStage, string> = {
          new: 'Mới tiếp nhận',
          contacted: 'Đang tư vấn',
          quoted: 'Đã báo giá',
          won: 'Đã chốt (Thành công)',
          lost: 'Đã hủy / Mất deal',
        };
        const newActivity = {
          id: 'act-' + Date.now(),
          type: 'note' as const,
          content: `Chuyển trạng thái sang: ${stageNames[stage]}${lossReason ? ` (Lý do: ${lossReason})` : ''}`,
          createdAt: new Date().toLocaleString('vi-VN'),
          author: role === 'ctv' ? `${activeCollaborator.name} (CTV)` : 'Trần Điều Hành (NV)',
        };
        return {
          ...d,
          stage,
          lossReason: stage === 'lost' ? lossReason : undefined,
          lastActivity: 'Vừa xong',
          activities: [newActivity, ...d.activities],
        };
      })
    );
    addToast(`Đã cập nhật trạng thái cơ hội sang "${stage}"!`);
  };

  const addDealActivity = (dealId: string, content: string, type: 'call' | 'zalo' | 'quote' | 'note') => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        const newAct = {
          id: 'act-' + Date.now(),
          type,
          content,
          createdAt: new Date().toLocaleString('vi-VN'),
          author: role === 'ctv' ? `${activeCollaborator.name} (CTV)` : 'Trần Điều Hành (NV)',
        };
        return {
          ...d,
          lastActivity: 'Vừa xong',
          activities: [newAct, ...d.activities],
        };
      })
    );
    addToast('Đã lưu ghi chú chăm sóc deal!');
  };

  const convertDealToCustomer = (dealId: string) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return null;
    const existing = customers.find(
      (c) => c.phone === deal.customerPhone || (deal.customerId && c.id === deal.customerId)
    );
    if (existing) {
      addToast(`Khách hàng ${existing.name} (${existing.code}) đã tồn tại trong hệ thống!`, 'info');
      return existing;
    }
    const newCust = addCustomer({
      name: deal.customerName,
      companyName: 'Khách hàng cá nhân',
      taxCode: '',
      email: deal.customerEmail || '',
      phone: deal.customerPhone,
      address: 'Việt Nam',
      country: 'Việt Nam',
      collaboratorId: deal.collaboratorId,
      type: 'individual',
      notes: `Chuyển đổi từ Deal ${deal.code}: ${deal.title}`,
    });
    // Link customerId to deal
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, customerId: newCust.id } : d))
    );
    return newCust;
  };

  const convertDealToBooking = (dealId: string) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) throw new Error('Deal not found');

    const customer = convertDealToCustomer(dealId);
    const newBooking = addBooking({
      senderName: deal.customerName,
      senderPhone: deal.customerPhone,
      senderEmail: deal.customerEmail,
      senderAddress: customer?.address || 'TP.HCM, Việt Nam',
      senderCountry: 'Việt Nam (VN)',
      receiverName: 'Đối tác nhận quốc tế',
      receiverPhone: '',
      receiverAddress: deal.route.split('->')[1]?.trim() || 'Quốc tế',
      receiverCountry: deal.route.split('->')[1]?.trim() || 'Quốc tế',
      service: 'Vngrow đề xuất (Tối ưu nhất)',
      pickupMethod: 'Lấy tận nơi (Pick-up)',
      description: deal.cargoType,
      packages: [
        {
          id: 'pkg-' + Date.now(),
          length: 30,
          width: 25,
          height: 20,
          gw: deal.estimatedWeight,
          items: [
            {
              id: 'it-' + Date.now(),
              name: deal.cargoType,
              unitPrice: 10,
              currency: 'USD',
              unit: 'kiện',
              quantity: 1,
              totalAmount: 10,
            },
          ],
        },
      ],
      totalGw: deal.estimatedWeight,
      totalVw: deal.estimatedWeight,
      totalCw: deal.estimatedWeight,
      declaredValue: 50,
      actualMeasured: false,
      price: deal.estimatedValue,
      cost: Math.round(deal.estimatedValue * 0.75),
      commission: Math.round(deal.estimatedValue * (activeCollaborator.commissionRate / 100)),
      collaboratorId: deal.collaboratorId,
      customerId: customer?.id,
      dealId: deal.id,
      status: 'sent',
    });

    // Mark deal as won
    updateDealStage(dealId, 'won');
    addToast(`Đã tạo thành công Booking ${newBooking.code} từ cơ hội ${deal.code}!`);
    return newBooking;
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'code' | 'date' | 'timeline'>) => {
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const newCode = `BK-${88222 + bookings.length}`;
    const newBooking: Booking = {
      ...bookingData,
      id: 'bk-' + Date.now(),
      code: newCode,
      date: dateStr,
      timeline: [
        { title: 'Chờ lấy hàng (awaiting_pickup)', time: `${dateStr} ${now.getHours()}:${now.getMinutes()}`, completed: true },
        { title: 'Đã nhận hàng tại kho Vngrow (picked_up)', time: '', completed: false },
        { title: 'Cân đo kích thước thực tế (measured)', time: '', completed: false },
        { title: 'Đã tạo vận đơn AWB (bill_created)', time: '', completed: false },
      ],
    };
    setBookings((prev) => [newBooking, ...prev]);

    // Create a matching Commission record
    const newComm: CommissionRecord = {
      id: 'comm-' + Date.now(),
      bookingCode: newBooking.code,
      date: dateStr,
      collaboratorId: newBooking.collaboratorId,
      customerName: `${newBooking.senderName} -> ${newBooking.receiverName}`,
      route: `${newBooking.senderCountry} -> ${newBooking.receiverCountry}`,
      cw: newBooking.totalCw,
      isMeasured: false,
      salePrice: newBooking.price,
      commissionAmount: newBooking.commission,
      status: 'pending_audit',
    };
    setCommissions((prev) => [newComm, ...prev]);

    logAudit('Tạo Booking mới', `${newBooking.code} - ${newBooking.senderName} -> ${newBooking.receiverName}`);
    return newBooking;
  };

  const sendBooking = (bookingId: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    let bCode = '';
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        bCode = b.code;
        return {
          ...b,
          status: 'sent' as const,
          rejectReason: undefined,
          timeline: [
            ...b.timeline,
            { title: 'CTV đã gửi đơn tới Vngrow tiếp nhận (sent)', time: timeStr, completed: true },
          ],
        };
      })
    );
    logAudit('Gửi booking', `CTV gửi đơn ${bCode} tới Vngrow tiếp nhận`);
    addToast(`Đã gửi booking ${bCode} tới đội ngũ điều hành Vngrow!`);
  };

  const rejectBooking = (bookingId: string, reason: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    let bCode = '';
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        bCode = b.code;
        return {
          ...b,
          status: 'reject' as const,
          rejectReason: reason,
          timeline: [
            ...b.timeline,
            { title: `Vngrow từ chối booking: ${reason}`, time: timeStr, completed: false },
          ],
        };
      })
    );
    logAudit('Từ chối booking', `Vngrow từ chối ${bCode}: ${reason}`);
    addToast(`Đã từ chối booking ${bCode} kèm lý do!`, 'warning');
  };

  const acceptBooking = (bookingId: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    let bCode = '';
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        bCode = b.code;
        return {
          ...b,
          status: 'booking_confirmed' as const,
          rejectReason: undefined,
          timeline: [
            ...b.timeline,
            { title: 'Vngrow đã xác nhận booking và liên hệ lấy hàng', time: timeStr, completed: true },
          ],
        };
      })
    );
    logAudit('Tiếp nhận booking', `Vngrow tiếp nhận xử lý đơn ${bCode}`);
    addToast(`Đã tiếp nhận booking ${bCode} thành công!`);
  };

  const updateBookingContent = (
    bookingId: string,
    updates: Partial<Booking>,
    resend: boolean = false
  ) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    let bCode = '';
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        bCode = b.code;
        const newStatus = resend ? ('sent' as const) : (updates.status || b.status);
        const newTimeline = resend
          ? [
              ...b.timeline,
              {
                title: 'CTV đã chỉnh sửa và gửi lại đơn hàng (sent)',
                time: timeStr,
                completed: true,
              },
            ]
          : b.timeline;

        return {
          ...b,
          ...updates,
          status: newStatus,
          rejectReason: resend ? undefined : updates.rejectReason !== undefined ? updates.rejectReason : b.rejectReason,
          timeline: newTimeline,
        };
      })
    );

    if (resend) {
      logAudit(
        'Sửa & Gửi lại booking',
        `CTV cập nhật và gửi lại đơn ${bCode} (quay lại trạng thái sent)`
      );
      addToast(`Đã cập nhật và gửi lại booking ${bCode} tới Vngrow!`);
    } else {
      logAudit('Cập nhật booking', `Chỉnh sửa thông tin đơn ${bCode}`);
      addToast(`Đã cập nhật thông tin booking ${bCode}!`);
    }
  };

  const deleteBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    setCommissions((prev) => prev.filter((c) => c.bookingCode !== target.code));
    logAudit('Xóa booking', `Đã xóa booking ${target.code} khỏi hệ thống`);
    addToast(`Đã xóa booking ${target.code} thành công!`, 'info');
  };

  const updateBookingNote = (bookingId: string, note: string) => {
    let bCode = '';
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        bCode = b.code;
        return { ...b, internalNote: note };
      })
    );
    logAudit('Cập nhật ghi chú vận hành', `Booking ${bCode}: ${note}`);
    addToast(`Đã cập nhật ghi chú vận hành cho đơn ${bCode}!`);
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    let bCode = '';
    const nowStr = new Date().toLocaleString('vi-VN');
    const statusLabels: Record<string, string> = {
      draft: 'Draft (Bản nháp)',
      sent: 'Sent (Đã gửi)',
      booking_confirmed: 'Xác nhận booking',
      awaiting_pickup: 'Chờ nhận hàng',
      picked_up: 'Đã nhận hàng',
      measuring: 'Chờ xác nhận cân đo thực tế',
      ctv_confirmed: 'CTV xác nhận',
      creating_bill: 'Đang tạo bill',
      bill_created: 'Đã tạo bill (In Transit)',
      shipping: 'Đang vận chuyển',
      delivered: 'Đã giao hàng',
      reject: 'Bị từ chối',
      cancelled: 'Đã hủy',
    };

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        bCode = b.code;
        return {
          ...b,
          status,
          timeline: [
            ...b.timeline,
            { title: statusLabels[status] || status, time: nowStr, completed: true },
          ],
        };
      })
    );
    logAudit('Cập nhật trạng thái booking', `${bCode} ➔ ${statusLabels[status] || status}`);
    addToast(`Đã cập nhật trạng thái đơn ${bCode} thành "${statusLabels[status] || status}"!`);
  };

  const confirmCtvMeasurementAndPrice = (bookingId: string, ctvNewPrice: number) => {
    let bCode = '';
    const nowStr = new Date().toLocaleString('vi-VN');
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        bCode = b.code;
        return {
          ...b,
          ctvNewPrice,
          price: ctvNewPrice,
          status: 'ctv_confirmed' as const,
          timeline: [
            ...b.timeline,
            {
              title: `CTV đã xác nhận số đo thực tế & nhập giá bán mới: ${ctvNewPrice.toLocaleString('vi-VN')} VND`,
              time: nowStr,
              completed: true,
            },
          ],
        };
      })
    );
    logAudit('CTV xác nhận cân đo & giá mới', `Booking ${bCode}: Giá mới ${ctvNewPrice.toLocaleString('vi-VN')} VND`);
    addToast(`CTV đã xác nhận cân đo và cập nhật giá mới cho đơn ${bCode}!`);
  };

  const updateBookingMeasurements = (
    bookingId: string,
    actualGw: number,
    actualCw: number,
    revisedPrice: number
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          actualGw,
          actualCw,
          revisedPrice,
          actualMeasured: true,
          status: 'measuring',
        };
      })
    );
    logAudit('Cập nhật cân đo thực tế', `Booking #${bookingId}: CW ${actualCw}kg, Giá mới ${revisedPrice.toLocaleString()} VND`);
    addToast('Đã lưu số liệu cân đo thực tế và gửi thông báo xác nhận giá cho CTV/Khách!');
  };

  const confirmBookingMeasurements = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const finalPrice = b.revisedPrice || b.price;
        const finalCommission = Math.round(finalPrice * (activeCollaborator.commissionRate / 100));
        return {
          ...b,
          price: finalPrice,
          commission: finalCommission,
          status: 'ctv_confirmed',
        };
      })
    );
    // Update commission record as well
    setCommissions((prev) =>
      prev.map((c) => {
        const bk = bookings.find((b) => b.id === bookingId);
        if (bk && c.bookingCode === bk.code) {
          const finalPrice = bk.revisedPrice || bk.price;
          return {
            ...c,
            cw: bk.actualCw || c.cw,
            isMeasured: true,
            salePrice: finalPrice,
            commissionAmount: Math.round(finalPrice * (activeCollaborator.commissionRate / 100)),
          };
        }
        return c;
      })
    );
    addToast('CTV đã xác nhận số liệu cân đo và chấp thuận giá cước mới!');
  };

  const createWaybill = (bookingId: string, trackingNumber: string, carrier: Waybill['carrier']) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              trackingNumber,
              carrier,
              status: 'shipping',
            }
          : b
      )
    );

    const newWb: Waybill = {
      id: 'wb-' + Date.now(),
      trackingNumber,
      carrier,
      bookingId: booking.code,
      route: `${booking.senderCountry.split('(')[0].trim()} -> ${booking.receiverCountry.split('(')[0].trim()}`,
      goodsName: booking.description,
      totalPackage: booking.packages.length || 1,
      totalCw: booking.actualCw || booking.totalCw,
      status: 'In Transit',
      note: 'Khởi tạo từ Booking ' + booking.code,
    };
    setWaybills((prev) => [newWb, ...prev]);

    logAudit('Tạo Vận đơn Waybill', `${carrier} - AWB ${trackingNumber} cho ${booking.code}`);
    addToast(`Đã xuất vận đơn AWB ${trackingNumber} (${carrier}) thành công!`);
  };

  const addRfq = (rfqData: Omit<Rfq, 'id' | 'date' | 'status'>) => {
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const newId = `RFQ-${10024 + rfqs.length}`;
    const newRfq: Rfq = {
      ...rfqData,
      id: newId,
      date: dateStr,
      status: 'sent',
    };
    setRfqs((prev) => [newRfq, ...prev]);
    logAudit('Tạo RFQ Báo Giá', `${newRfq.id} cho ${newRfq.customerName}`);
    addToast(`Đã gửi yêu cầu báo giá ${newRfq.id} tới đội ngũ điều hành Vngrow!`);
    return newRfq;
  };

  const sendRfq = (rfqId: string) => {
    setRfqs((prev) =>
      prev.map((r) => (r.id === rfqId ? { ...r, status: 'sent' as const } : r))
    );
    logAudit('Gửi RFQ', `Gửi yêu cầu báo giá ${rfqId} tới Vngrow`);
    addToast(`Đã gửi yêu cầu báo giá ${rfqId} tới Vngrow tiếp nhận!`);
  };

  const deleteRfq = (rfqId: string) => {
    setRfqs((prev) => prev.filter((r) => r.id !== rfqId));
    logAudit('Xóa RFQ', `Đã xóa yêu cầu báo giá ${rfqId}`);
    addToast(`Đã xóa yêu cầu báo giá ${rfqId}!`, 'info');
  };

  const updateRfqContent = (
    rfqId: string,
    updates: Partial<Rfq>,
    resend: boolean = false
  ) => {
    setRfqs((prev) =>
      prev.map((r) => {
        if (r.id !== rfqId) return r;
        return {
          ...r,
          ...updates,
          status: resend ? ('sent' as const) : updates.status || r.status,
        };
      })
    );
    if (resend) {
      logAudit('Sửa & Gửi lại RFQ', `Cập nhật và gửi lại yêu cầu báo giá ${rfqId}`);
      addToast(`Đã cập nhật và gửi lại yêu cầu báo giá ${rfqId}!`);
    } else {
      logAudit('Cập nhật RFQ', `Lưu thay đổi yêu cầu báo giá ${rfqId}`);
      addToast(`Đã lưu thay đổi yêu cầu báo giá ${rfqId}!`);
    }
  };

  const submitQuoteForRfq = (rfqId: string, quote: RfqQuote) => {
    setRfqs((prev) =>
      prev.map((r) =>
        r.id === rfqId
          ? {
              ...r,
              status: 'quoted',
              quote,
            }
          : r
      )
    );
    logAudit('Phê duyệt Báo giá RFQ', `${rfqId}: Tổng cước ${quote.totalFee.toLocaleString()} VND`);
    addToast(`Đã gửi bảng báo giá chính thức cho ${rfqId}!`);
  };

  const approveCommissionPayment = (commissionId: string) => {
    setCommissions((prev) =>
      prev.map((c) =>
        c.id === commissionId
          ? {
              ...c,
              status: 'paid',
              paidDate: new Date().toLocaleDateString('vi-VN'),
            }
          : c
      )
    );
    addToast('Kế toán đã duyệt chi hoa hồng thành công!');
  };

  const payAllCtvCommission = (collaboratorId: string) => {
    const nowStr = new Date().toLocaleDateString('vi-VN');
    let totalPaid = 0;
    setCommissions((prev) =>
      prev.map((c) => {
        if (c.collaboratorId === collaboratorId && c.status === 'pending_audit') {
          totalPaid += c.commissionAmount;
          return {
            ...c,
            status: 'paid',
            paidDate: nowStr,
          };
        }
        return c;
      })
    );
    // Update collaborator cache
    setCollaborators((prev) =>
      prev.map((ctv) => {
        if (ctv.id === collaboratorId) {
          return {
            ...ctv,
            paidCommission: ctv.paidCommission + totalPaid,
            pendingCommission: 0,
          };
        }
        return ctv;
      })
    );
    addToast(`Đã phê duyệt thanh toán tất cả hoa hồng cho CTV! Tổng chi: ${totalPaid.toLocaleString()} VND`);
  };

  const markInvoicePaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'paid' } : inv))
    );
    addToast('Đã ghi nhận thanh toán Invoice thành công!');
  };

  return (
    <LogisticsContext.Provider
      value={{
        role,
        setRole,
        activePage,
        setActivePage,
        activeCollaborator,
        setActiveCollaborator,
        collaborators,
        customers,
        deals,
        bookings,
        waybills,
        rfqs,
        commissions,
        invoices,
        auditLogs,
        toasts,
        addToast,
        removeToast,
        visibleCustomers,
        visibleDeals,
        visibleBookings,
        visibleCommissions,
        visibleRfqs,
        selectedCtvFilter,
        setSelectedCtvFilter,
        addCustomer,
        updateCustomer,
        addDeal,
        updateDealStage,
        addDealActivity,
        convertDealToCustomer,
        convertDealToBooking,
        addBooking,
        sendBooking,
        rejectBooking,
        acceptBooking,
        updateBookingContent,
        deleteBooking,
        updateBookingNote,
        updateBookingStatus,
        confirmCtvMeasurementAndPrice,
        updateBookingMeasurements,
        confirmBookingMeasurements,
        createWaybill,
        addRfq,
        sendRfq,
        deleteRfq,
        updateRfqContent,
        submitQuoteForRfq,
        approveCommissionPayment,
        payAllCtvCommission,
        markInvoicePaid,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
};
