import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Customer, Booking } from '../../types';
import { CustomerModal } from './CustomerModal';
import { BookingDetailModal } from '../booking/BookingDetailModal';
import {
  Users,
  Search,
  Plus,
  Building,
  User,
  ChevronDown,
  ChevronRight,
  Package,
  Phone,
  Mail,
  MapPin,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface CustomerListProps {
  onOpenCreateBookingForCustomer?: (customer: Customer) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  onOpenCreateBookingForCustomer,
}) => {
  const {
    role,
    visibleCustomers,
    bookings,
    collaborators,
    selectedCtvFilter,
    setSelectedCtvFilter,
    setActivePage,
  } = useLogistics();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'b2b' | 'individual'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<Booking | null>(null);

  // Filter customers
  const filteredCustomers = visibleCustomers.filter((c) => {
    const matchSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.taxCode.includes(searchTerm);

    const matchType = typeFilter === 'all' || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const toggleExpand = (id: string) => {
    setExpandedCustomerId(expandedCustomerId === id ? null : id);
  };

  const getCustomerBookings = (customerId: string): Booking[] => {
    return bookings.filter((b) => b.customerId === customerId);
  };

  const getCtvName = (ctvId: string) => {
    const ctv = collaborators.find((c) => c.id === ctvId);
    return ctv ? ctv.name : 'Vngrow Sales';
  };

  // Metrics
  const totalCount = visibleCustomers.length;
  const b2bCount = visibleCustomers.filter((c) => c.type === 'b2b').length;
  const individualCount = visibleCustomers.filter((c) => c.type === 'individual').length;

  const exportCsv = () => {
    const headers = 'Mã KH,Tên Khách,Công ty,MST,SĐT,Email,Loại,CTV,SL Booking,Tổng chi tiêu\n';
    const rows = filteredCustomers
      .map(
        (c) =>
          `"${c.code}","${c.name}","${c.companyName}","${c.taxCode}","${c.phone}","${c.email}","${c.type}","${getCtvName(c.collaboratorId)}",${c.totalOrders},${c.totalSpend}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vngrow_Customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-5">
      {/* Metric Cards - 3 clean cards, no Tổng Chi Tiêu */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Tổng Khách Hàng</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{totalCount}</div>
          <div className="text-xs text-slate-400 mt-1">
            {role === 'ctv' ? 'Thuộc quyền quản lý của bạn' : 'Toàn bộ hệ thống Vngrow'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Doanh Nghiệp (B2B)</span>
            <Building className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-sky-700 tabular-nums">{b2bCount}</div>
          <div className="text-xs text-slate-400 mt-1">Khách hàng công ty có MST</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Khách Cá Nhân</span>
            <User className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">{individualCount}</div>
          <div className="text-xs text-slate-400 mt-1">Gửi quà & hàng xách tay</div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo Mã KH, Tên công ty, MST, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Loại:</span>
            <select
              aria-label="Lọc theo loại khách hàng"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Tất cả loại khách</option>
              <option value="b2b">Doanh nghiệp (B2B)</option>
              <option value="individual">Cá nhân</option>
            </select>
          </div>

          {role === 'nv' && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">CTV phụ trách:</span>
              <select
                aria-label="Lọc theo Cộng tác viên phụ trách"
                value={selectedCtvFilter}
                onChange={(e) => setSelectedCtvFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">Tất cả CTV ({collaborators.length})</option>
                {collaborators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="Xuất danh sách ra file CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Khách Hàng</span>
          </button>
        </div>
      </div>

      {/* Customer 360 Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Mã KH</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Mã số thuế</th>
                <th className="py-3 px-4">Số điện thoại</th>
                <th className="py-3 px-4">Email & Địa chỉ</th>
                {role === 'nv' && <th className="py-3 px-4">CTV Phụ trách</th>}
                <th className="py-3 px-4 text-center">SL Booking</th>
                <th className="py-3 px-4 text-right">Tổng chi tiêu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={role === 'nv' ? 9 : 8} className="py-12 text-center text-slate-400">
                    Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const isExpanded = expandedCustomerId === customer.id;
                  const custBookings = getCustomerBookings(customer.id);

                  return (
                    <React.Fragment key={customer.id}>
                      <tr
                        onClick={() => toggleExpand(customer.id)}
                        className={`cursor-pointer transition-colors ${
                          isExpanded ? 'bg-sky-50/50' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="py-3 px-4 text-slate-400">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-sky-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-sky-700">
                          {customer.code}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{customer.name}</div>
                          <div className="text-xs text-slate-500 font-medium">
                            {customer.companyName}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-600">
                          {customer.taxCode || '—'}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-800 text-xs tabular-nums">
                          {customer.phone}
                        </td>
                        <td className="py-3 px-4 text-xs max-w-xs">
                          <div className="text-slate-600 truncate">{customer.email || '—'}</div>
                          <div className="text-slate-400 truncate text-[11px]">{customer.address}</div>
                        </td>
                        {role === 'nv' && (
                          <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                            {getCtvName(customer.collaboratorId)}
                          </td>
                        )}
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-sky-700 tabular-nums">
                            {custBookings.length > 0 ? custBookings.length : customer.totalOrders}{' '}
                            đơn
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {customer.totalSpend.toLocaleString('vi-VN')} ₫
                        </td>
                      </tr>

                      {/* Expanded Customer 360° Drawer / Sub-table */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-y border-sky-200">
                          <td colSpan={role === 'nv' ? 9 : 8} className="p-4 sm:p-6">
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-4">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                <div>
                                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    DANH SÁCH LÔ HÀNG & LỊCH SỬ GỬI HÀNG CỦA {customer.code}
                                  </div>
                                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                                    {customer.companyName} · {customer.name}
                                  </div>
                                </div>
                              </div>

                              {/* Bookings Sub-table */}
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left border-collapse">
                                  <thead>
                                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                                      <th className="py-2.5 px-3">Ngày Booking</th>
                                      <th className="py-2.5 px-3">Booking ID</th>
                                      <th className="py-2.5 px-3">Tuyến / Mô tả</th>
                                      <th className="py-2.5 px-3">Trọng lượng (CW)</th>
                                      <th className="py-2.5 px-3 text-right">Cước vận chuyển</th>
                                      <th className="py-2.5 px-3 text-right">Hoa hồng CTV</th>
                                      <th className="py-2.5 px-3">Trạng thái</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {custBookings.length === 0 ? (
                                      <tr>
                                        <td colSpan={7} className="py-6 text-center text-slate-400">
                                          Khách hàng chưa có lô hàng phát sinh gần đây.
                                        </td>
                                      </tr>
                                    ) : (
                                      custBookings.map((b) => (
                                        <tr key={b.id} className="hover:bg-slate-50">
                                          <td className="py-2.5 px-3 text-slate-500">{b.date}</td>
                                          <td className="py-2.5 px-3 font-mono font-bold text-sky-700">
                                            <button
                                              onClick={() => setSelectedBookingForDetail(b)}
                                              className="hover:underline font-mono font-bold text-sky-700 hover:text-sky-900"
                                              title="Xem chi tiết đơn booking"
                                            >
                                              {b.code}
                                            </button>
                                          </td>
                                          <td className="py-2.5 px-3 text-slate-700">
                                            {b.senderCountry.split('(')[0]} ➔ {b.receiverCountry.split('(')[0]} ({b.description})
                                          </td>
                                          <td className="py-2.5 px-3 font-bold tabular-nums">
                                            {b.actualCw || b.totalCw} kg
                                            {b.actualMeasured && (
                                              <span className="text-[10px] text-emerald-600 font-semibold ml-1">
                                                (Đã đo)
                                              </span>
                                            )}
                                          </td>
                                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                                            {b.price.toLocaleString('vi-VN')} ₫
                                          </td>
                                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 tabular-nums">
                                            +{b.commission.toLocaleString('vi-VN')} ₫
                                          </td>
                                          <td className="py-2.5 px-3">
                                            {b.status === 'delivered' ? (
                                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                                                Đã giao hàng
                                              </span>
                                            ) : b.status === 'measuring' ? (
                                              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold">
                                                Chờ duyệt cân đo
                                              </span>
                                            ) : (
                                              <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold">
                                                Đang xử lý
                                              </span>
                                            )}
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal create customer */}
      <CustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Modal booking detail */}
      <BookingDetailModal
        booking={selectedBookingForDetail}
        isOpen={!!selectedBookingForDetail}
        onClose={() => setSelectedBookingForDetail(null)}
      />
    </div>
  );
};
