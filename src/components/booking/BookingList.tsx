import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Booking, BookingStatus, Waybill } from '../../types';
import { CreateBookingModal } from './CreateBookingModal';
import { EditBookingModal } from './EditBookingModal';
import { CtvConfirmMeasureModal } from './CtvConfirmMeasureModal';
import { VngrowTrackingModal } from './VngrowTrackingModal';
import { BookingDetailModal } from './BookingDetailModal';
import { FixedWrapTextBox } from '../common/FixedWrapTextBox';
import {
  Search,
  Plus,
  ArrowRight,
  ExternalLink,
  Edit,
  Send,
  Trash2,
  Scale,
} from 'lucide-react';

export const BookingList: React.FC = () => {
  const {
    role,
    visibleBookings,
    collaborators,
    selectedCtvFilter,
    setSelectedCtvFilter,
    sendBooking,
    deleteBooking,
    updateBookingStatus,
    confirmCtvMeasurementAndPrice,
    createWaybill,
  } = useLogistics();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState<Booking | null>(null);
  const [selectedBookingForMeasure, setSelectedBookingForMeasure] = useState<Booking | null>(null);
  const [selectedBookingForVngrowTracking, setSelectedBookingForVngrowTracking] = useState<Booking | null>(null);
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<Booking | null>(null);

  // Quick Bill creation inputs
  const [billInputs, setBillInputs] = useState<Record<string, string>>({});
  const [carrierInputs, setCarrierInputs] = useState<Record<string, Waybill['carrier']>>({});

  const filteredBookings = visibleBookings.filter((b) => {
    const matchSearch =
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.trackingNumber && b.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.receiverName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getCleanGoodsName = (desc: string) => {
    return desc.replace(/^\d+\s*kiện\s*[,·-]?\s*/i, '').trim() || desc;
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'draft':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 whitespace-nowrap">
            Draft
          </span>
        );
      case 'sent':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-300 whitespace-nowrap">
            Sent
          </span>
        );
      case 'booking_confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-300 whitespace-nowrap">
            Xác nhận booking
          </span>
        );
      case 'awaiting_pickup':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300 whitespace-nowrap">
            Chờ nhận hàng
          </span>
        );
      case 'picked_up':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-300 whitespace-nowrap">
            Đã nhận hàng
          </span>
        );
      case 'measuring':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-300 whitespace-nowrap">
            Chờ xác nhận cân đo
          </span>
        );
      case 'ctv_confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-300 whitespace-nowrap">
            CTV xác nhận
          </span>
        );
      case 'creating_bill':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-300 whitespace-nowrap">
            Đang tạo bill
          </span>
        );
      case 'bill_created':
      case 'shipping':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 whitespace-nowrap">
            Đã tạo bill
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 whitespace-nowrap">
            Đã giao hàng
          </span>
        );
      case 'reject':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 whitespace-nowrap">
            Bị từ chối
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  const getCarrierTrackingUrl = (trackingNumber: string, carrier?: string) => {
    const c = (carrier || '').toUpperCase();
    if (c.includes('DHL')) {
      return `https://www.dhl.com/vn-vi/home/tracking.html?tracking-id=${encodeURIComponent(trackingNumber)}`;
    }
    if (c.includes('UPS')) {
      return `https://www.ups.com/track?tracknum=${encodeURIComponent(trackingNumber)}`;
    }
    if (c.includes('FEDEX')) {
      return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(trackingNumber)}`;
    }
    return null;
  };

  const handleTrackingClick = (e: React.MouseEvent, booking: Booking) => {
    e.preventDefault();
    if (!booking.trackingNumber) return;

    const carrier = booking.carrier || '';
    const externalUrl = getCarrierTrackingUrl(booking.trackingNumber, carrier);

    if (externalUrl) {
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedBookingForVngrowTracking(booking);
    }
  };

  const handleCreateBill = (bookingId: string) => {
    const num = (billInputs[bookingId] || '').trim();
    if (!num) {
      alert('Vui lòng nhập số bill!');
      return;
    }
    const carrier = carrierInputs[bookingId] || 'DHL';
    createWaybill(bookingId, num, carrier);
  };

  const handleDelete = (booking: Booking) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa booking ${booking.code}?`)) {
      deleteBooking(booking.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm Booking ID, Tracking, Tên hàng, Tuyến..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Trạng thái:</span>
            <select
              aria-label="Lọc theo trạng thái booking"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="booking_confirmed">Xác nhận booking</option>
              <option value="awaiting_pickup">Chờ nhận hàng</option>
              <option value="picked_up">Đã nhận hàng</option>
              <option value="measuring">Chờ xác nhận cân đo</option>
              <option value="ctv_confirmed">CTV xác nhận</option>
              <option value="creating_bill">Đang tạo bill</option>
              <option value="bill_created">Đã tạo bill</option>
              <option value="delivered">Đã giao hàng</option>
            </select>
          </div>

          {role === 'nv' && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">CTV:</span>
              <select
                aria-label="Lọc theo Cộng tác viên"
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

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Booking</span>
        </button>
      </div>

      {/* Booking Table with Fixed Size Auto-Wrap Text Boxes & 2 Rows Kiện/CW */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[960px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-28">Booking ID</th>
                <th className="py-3 px-4 w-40">Tracking</th>
                <th className="py-3 px-4 w-[230px]">Tên hàng</th>
                <th className="py-3 px-4 w-36">Lộ trình</th>
                <th className="py-3 px-4 text-center w-36">Kiện / CW</th>
                <th className="py-3 px-4 text-center w-36">Trạng thái</th>
                <th className="py-3 px-4 w-[230px]">Ghi chú</th>
                <th className="py-3 px-4 text-center w-40">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Không tìm thấy booking nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* 1. Booking ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-700 align-top">
                      <button
                        onClick={() => setSelectedBookingForDetail(b)}
                        className="hover:underline text-left block"
                        title="Xem chi tiết đơn"
                      >
                        {b.code}
                      </button>
                      <div className="text-[11px] text-slate-400 font-sans mt-0.5">{b.date}</div>
                    </td>

                    {/* 2. Tracking */}
                    <td className="py-3.5 px-4 align-top">
                      {b.trackingNumber ? (
                        <button
                          onClick={(e) => handleTrackingClick(e, b)}
                          className="text-xs font-mono font-bold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 text-left"
                          title="Bấm để tra cứu hành trình"
                        >
                          <span>{b.trackingNumber} - {b.carrier || 'Vngrow'}</span>
                          <ExternalLink className="w-3 h-3 text-sky-600 shrink-0" />
                        </button>
                      ) : role === 'nv' && b.status !== 'draft' && b.status !== 'reject' ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Số bill..."
                            value={billInputs[b.id] || ''}
                            onChange={(e) =>
                              setBillInputs({ ...billInputs, [b.id]: e.target.value })
                            }
                            className="w-20 px-2 py-0.5 text-xs bg-slate-50 border border-slate-300 rounded font-mono"
                          />
                          <select
                            aria-label="Chọn hãng vận chuyển"
                            value={carrierInputs[b.id] || 'DHL'}
                            onChange={(e) =>
                              setCarrierInputs({
                                ...carrierInputs,
                                [b.id]: e.target.value as Waybill['carrier'],
                              })
                            }
                            className="px-1 py-0.5 text-xs bg-slate-50 border border-slate-300 rounded font-semibold text-slate-700"
                          >
                            <option value="DHL">DHL</option>
                            <option value="UPS">UPS</option>
                            <option value="FedEx">FedEx</option>
                            <option value="Chuyên Tuyến Vngrow">Chuyên tuyến</option>
                          </select>
                          <button
                            onClick={() => handleCreateBill(b.id)}
                            className="px-2 py-0.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded transition-colors shadow-2xs"
                          >
                            Tạo
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-semibold text-xs">—</span>
                      )}
                    </td>

                    {/* 3. Tên hàng trên bill: Fixed Size Text Box with Auto Wrap */}
                    <td className="py-3.5 px-4 align-top w-[230px]">
                      <FixedWrapTextBox
                        text={getCleanGoodsName(b.description)}
                        widthClass="w-[220px]"
                        maxLines={3}
                        variant="default"
                      />
                    </td>

                    {/* 4. Lộ trình */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 flex-wrap">
                        <span>{b.senderCountry.split('(')[0].trim()}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-900">{b.receiverCountry.split('(')[0].trim()}</span>
                      </div>
                    </td>

                    {/* 5. Cột Kiện / CW: Hàng 1 số kiện (có so sánh nếu tách kiện), Hàng 2 trọng lượng CW chuẩn ngang */}
                    <td className="py-3.5 px-4 text-center font-mono align-top whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-800 whitespace-nowrap">
                        {b.actualMeasured && b.actualPackagesCount && b.actualPackagesCount !== b.packages.length ? (
                          <div className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
                            <del className="text-slate-400 font-normal text-[11px]">{b.packages.length || 1} kiện</del>
                            <span className="text-slate-400 text-[10px]">➔</span>
                            <span className="text-slate-900 font-bold">{b.actualPackagesCount} kiện</span>
                          </div>
                        ) : (
                          <span>{b.packages.length || 1} kiện</span>
                        )}
                      </div>
                      <div className="mt-1 text-xs whitespace-nowrap">
                        {b.actualMeasured ? (
                          <div className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-mono">
                            <del className="text-slate-400 line-through text-[11px] tabular-nums font-normal">
                              {b.totalCw} kg
                            </del>
                            <span className="text-slate-400 text-[10px]">➔</span>
                            <span className="font-extrabold text-rose-600 text-xs tabular-nums">
                              {b.actualCw} kg
                            </span>
                          </div>
                        ) : (
                          <span className="font-semibold text-slate-600 text-xs tabular-nums">
                            {b.totalCw} kg
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 6. Trạng thái */}
                    <td className="py-3.5 px-4 text-center align-top">
                      <div className="inline-flex flex-col items-center gap-1.5">
                        {getStatusBadge(b.status)}

                        {role === 'ctv' && b.status === 'measuring' && (
                          <button
                            onClick={() => setSelectedBookingForMeasure(b)}
                            className="px-2 py-0.5 text-[11px] font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors flex items-center gap-1 shadow-2xs whitespace-nowrap"
                            title="Xác nhận cân đo thực tế và nhập giá mới"
                          >
                            <Scale className="w-3 h-3" />
                            <span>Xác nhận cân đo</span>
                          </button>
                        )}

                        {role === 'nv' && (
                          <select
                            aria-label="Cập nhật trạng thái booking"
                            value={b.status === 'shipping' ? 'bill_created' : b.status}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                            className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 focus:outline-none"
                          >
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="booking_confirmed">Xác nhận booking</option>
                            <option value="awaiting_pickup">Chờ nhận hàng</option>
                            <option value="picked_up">Đã nhận hàng</option>
                            <option value="measuring">Chờ xác nhận cân đo</option>
                            <option value="ctv_confirmed">CTV xác nhận</option>
                            <option value="creating_bill">Đang tạo bill</option>
                            <option value="bill_created">Đã tạo bill</option>
                            <option value="delivered">Đã giao hàng</option>
                            <option value="reject">Từ chối</option>
                          </select>
                        )}
                      </div>
                    </td>

                    {/* 7. Ghi chú / Lý do từ chối: Bằng kích thước Tên hàng */}
                    <td className="py-3.5 px-4 align-top w-[230px]">
                      {b.status === 'reject' && b.rejectReason ? (
                        <FixedWrapTextBox
                          text={b.rejectReason}
                          widthClass="w-[220px]"
                          maxLines={3}
                          variant="danger"
                        />
                      ) : b.internalNote ? (
                        <FixedWrapTextBox
                          text={b.internalNote}
                          widthClass="w-[220px]"
                          maxLines={3}
                          variant="subtle"
                        />
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* 8. Hành động gồm 3 nút: Sửa, Gửi, Xóa đồng bộ */}
                    <td className="py-3.5 px-4 text-center align-top">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedBookingForEdit(b)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors flex items-center gap-1 shadow-2xs"
                          title="Sửa thông tin chi tiết booking"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-500" />
                          <span>Sửa</span>
                        </button>

                        <button
                          onClick={() => sendBooking(b.id)}
                          className="px-2.5 py-1 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded transition-colors flex items-center gap-1 shadow-2xs"
                          title="Gửi booking tới Vngrow"
                        >
                          <Send className="w-3.5 h-3.5 text-sky-600" />
                          <span>Gửi</span>
                        </button>

                        <button
                          onClick={() => handleDelete(b)}
                          className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors flex items-center gap-1 shadow-2xs"
                          title="Xóa booking"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditBookingModal
        booking={selectedBookingForEdit}
        isOpen={!!selectedBookingForEdit}
        onClose={() => setSelectedBookingForEdit(null)}
      />

      <CtvConfirmMeasureModal
        booking={selectedBookingForMeasure}
        isOpen={!!selectedBookingForMeasure}
        onClose={() => setSelectedBookingForMeasure(null)}
        onConfirm={confirmCtvMeasurementAndPrice}
      />

      <VngrowTrackingModal
        booking={selectedBookingForVngrowTracking}
        isOpen={!!selectedBookingForVngrowTracking}
        onClose={() => setSelectedBookingForVngrowTracking(null)}
      />

      <BookingDetailModal
        booking={selectedBookingForDetail}
        isOpen={!!selectedBookingForDetail}
        onClose={() => setSelectedBookingForDetail(null)}
      />
    </div>
  );
};
