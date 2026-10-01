export type Language = 'vi' | 'en';

export const translations = {
  vi: {
    // Navigation / Sidebar
    navDashboard: 'Tổng quan',
    navCrm: 'CRM & Báo giá',
    navCustomers: 'Quản lý Khách hàng',
    navBookings: 'Quản lý Booking',
    navWaybills: 'Quản lý Vận đơn',
    navRfqs: 'Yêu cầu Báo giá (RFQ)',
    navCommission: 'Công nợ & Hoa hồng',
    navSettings: 'Cài đặt hệ thống',

    // Topbar
    roleCtv: 'Giao diện CTV',
    roleNv: 'Giao diện Điều Hành (NV)',
    roleCtvDesc: 'Cộng Tác Viên Vngrow',
    roleNvDesc: 'Quản Trị / Điều Hành',

    // Page Titles
    titleDashboard: 'Tổng quan hoạt động',
    titleCrm: 'Quản lý Cơ hội & Nhu cầu (CRM)',
    titleCustomers: 'Cơ sở Dữ liệu Khách Hàng 360°',
    titleBookings: 'Quản lý Booking Lô Hàng',
    titleWaybills: 'Quản lý Vận đơn Quốc tế (Waybills)',
    titleRfqs: 'Yêu cầu Báo giá Cước Quốc tế (RFQ)',

    // Common Table Headers
    colBookingId: 'Booking ID',
    colTracking: 'Tracking',
    colGoodsName: 'Tên hàng',
    colRoute: 'Lộ trình',
    colPackagesCw: 'Kiện / CW',
    colStatus: 'Trạng thái',
    colNotes: 'Ghi chú',
    colActions: 'Hành động',
    colCustomer: 'Khách hàng',
    colTaxCode: 'Mã số thuế',
    colPhone: 'Số điện thoại',
    colEmailAddress: 'Email & Địa chỉ',
    colTotalOrders: 'SL Booking',
    colTotalSpend: 'Tổng chi tiêu',
    colCarrier: 'Hãng',
    colTimeline: 'Hành trình',

    // Common Buttons
    btnCreateBooking: 'Tạo Booking',
    btnCreateDeal: 'Tạo Deal',
    btnCreateRfq: 'Tạo Yêu Cầu Báo Giá',
    btnAddCustomer: 'Thêm Khách Hàng',
    btnEdit: 'Sửa',
    btnSend: 'Gửi',
    btnDelete: 'Xóa',
    btnExportCsv: 'Xuất CSV',
    btnConfirmMeasure: 'Xác nhận cân đo',

    // Statuses
    statusDraft: 'Draft',
    statusSent: 'Sent',
    statusBookingConfirmed: 'Xác nhận booking',
    statusAwaitingPickup: 'Chờ nhận hàng',
    statusPickedUp: 'Đã nhận hàng',
    statusMeasuring: 'Chờ xác nhận cân đo',
    statusCtvConfirmed: 'CTV xác nhận',
    statusCreatingBill: 'Đang tạo bill',
    statusBillCreated: 'Đã tạo bill',
    statusDelivered: 'Đã giao hàng',
    statusReject: 'Bị từ chối',
    statusInTransit: 'Đang vận chuyển',
    statusCustoms: 'Thông quan',

    // Units
    packageUnit: 'kiện',
    orderUnit: 'đơn',
  },
  en: {
    // Navigation / Sidebar
    navDashboard: 'Dashboard',
    navCrm: 'CRM & Deals',
    navCustomers: 'Customer 360°',
    navBookings: 'Booking Management',
    navWaybills: 'Waybill Tracking',
    navRfqs: 'Quote Requests (RFQ)',
    navCommission: 'Commissions & Debt',
    navSettings: 'System Settings',

    // Topbar
    roleCtv: 'Collaborator (CTV)',
    roleNv: 'Operations (Ops)',
    roleCtvDesc: 'Vngrow Partner / Agent',
    roleNvDesc: 'Operations Manager',

    // Page Titles
    titleDashboard: 'Operational Overview',
    titleCrm: 'Pipeline & Opportunities (CRM)',
    titleCustomers: 'Customer Database 360°',
    titleBookings: 'Shipment Booking Management',
    titleWaybills: 'International Waybill Tracking',
    titleRfqs: 'Freight Quote Requests (RFQ)',

    // Common Table Headers
    colBookingId: 'Booking ID',
    colTracking: 'Tracking',
    colGoodsName: 'Goods Description',
    colRoute: 'Route',
    colPackagesCw: 'Pkgs / CW',
    colStatus: 'Status',
    colNotes: 'Notes',
    colActions: 'Actions',
    colCustomer: 'Customer',
    colTaxCode: 'Tax Code',
    colPhone: 'Phone',
    colEmailAddress: 'Email & Address',
    colTotalOrders: 'Bookings',
    colTotalSpend: 'Total Spend',
    colCarrier: 'Carrier',
    colTimeline: 'Milestone',

    // Common Buttons
    btnCreateBooking: 'New Booking',
    btnCreateDeal: 'New Deal',
    btnCreateRfq: 'Request Quote',
    btnAddCustomer: 'Add Customer',
    btnEdit: 'Edit',
    btnSend: 'Send',
    btnDelete: 'Delete',
    btnExportCsv: 'Export CSV',
    btnConfirmMeasure: 'Confirm Weight',

    // Statuses
    statusDraft: 'Draft',
    statusSent: 'Sent',
    statusBookingConfirmed: 'Confirmed',
    statusAwaitingPickup: 'Awaiting Pickup',
    statusPickedUp: 'Picked Up',
    statusMeasuring: 'Weight Verification',
    statusCtvConfirmed: 'Agent Confirmed',
    statusCreatingBill: 'Creating Bill',
    statusBillCreated: 'Waybill Created',
    statusDelivered: 'Delivered',
    statusReject: 'Rejected',
    statusInTransit: 'In Transit',
    statusCustoms: 'Customs Clearance',

    // Units
    packageUnit: 'pkgs',
    orderUnit: 'orders',
  },
};
