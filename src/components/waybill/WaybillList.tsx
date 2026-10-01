import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Waybill, Booking } from '../../types';
import { VngrowTrackingModal } from '../booking/VngrowTrackingModal';
import { FixedWrapTextBox } from '../common/FixedWrapTextBox';
import { Search, ExternalLink } from 'lucide-react';

export const WaybillList: React.FC = () => {
  const { waybills, bookings } = useLogistics();
  const [searchTerm, setSearchTerm] = useState('');
  const [carrierFilter, setCarrierFilter] = useState('all');
  const [selectedBookingForVngrowTracking, setSelectedBookingForVngrowTracking] = useState<Booking | null>(null);

  const filtered = waybills.filter((wb) => {
    const matchSearch =
      wb.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wb.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wb.goodsName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wb.route.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCarrier = carrierFilter === 'all' || wb.carrier === carrierFilter;
    return matchSearch && matchCarrier;
  });

  const getStatusBadge = (status: Waybill['status']) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200/80 shadow-2xs whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
            <span>Đang vận chuyển</span>
          </span>
        );
      case 'Customs Clearance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Thông quan</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300/80 shadow-2xs whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Giao thành công</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>{status}</span>
          </span>
        );
    }
  };

  const getCarrierColor = (carrier: Waybill['carrier']) => {
    switch (carrier) {
      case 'DHL':
        return 'text-red-600 font-extrabold';
      case 'FedEx':
        return 'text-purple-700 font-extrabold';
      case 'UPS':
        return 'text-amber-900 font-extrabold';
      case 'Chuyên Tuyến Vngrow':
        return 'text-sky-700 font-extrabold';
      default:
        return 'font-bold text-slate-800';
    }
  };

  const getTrackingUrl = (wb: Waybill) => {
    const num = wb.trackingNumber;
    if (wb.carrier === 'DHL') {
      return `https://www.dhl.com/vn-vi/home/tracking.html?tracking-id=${encodeURIComponent(num)}`;
    }
    if (wb.carrier === 'UPS') {
      return `https://www.ups.com/track?tracknum=${encodeURIComponent(num)}`;
    }
    if (wb.carrier === 'FedEx') {
      return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(num)}`;
    }
    return null;
  };

  const handleTrackingClick = (e: React.MouseEvent, wb: Waybill) => {
    e.preventDefault();
    const external = getTrackingUrl(wb);
    if (external) {
      window.open(external, '_blank', 'noopener,noreferrer');
    } else {
      // Find matching booking or create a proxy
      const matched = bookings.find((b) => b.code === wb.bookingId) || {
        id: wb.id,
        code: wb.bookingId,
        date: 'Hôm nay',
        senderName: 'Vngrow Express',
        senderPhone: '',
        senderAddress: 'TP.HCM',
        senderCountry: wb.route.split('->')[0]?.trim() || 'Việt Nam',
        receiverName: 'Người nhận',
        receiverPhone: '',
        receiverAddress: 'Quốc tế',
        receiverCountry: wb.route.split('->')[1]?.trim() || 'Quốc tế',
        service: 'Chuyên Tuyến Vngrow',
        pickupMethod: 'Kho Vngrow',
        description: wb.goodsName,
        packages: [],
        totalGw: wb.totalCw,
        totalVw: wb.totalCw,
        totalCw: wb.totalCw,
        declaredValue: 100,
        actualMeasured: true,
        price: 0,
        cost: 0,
        commission: 0,
        collaboratorId: 'ctv-1',
        status: 'shipping' as const,
        trackingNumber: wb.trackingNumber,
        carrier: 'Chuyên Tuyến Vngrow',
        timeline: [],
      };
      setSelectedBookingForVngrowTracking(matched);
    }
  };

  return (
    <div className="space-y-5">
      {/* Control Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm Tracking, Booking ID, Hàng hóa, Tuyến..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Hãng:</span>
            <select
              aria-label="Lọc theo hãng vận chuyển"
              value={carrierFilter}
              onChange={(e) => setCarrierFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Tất cả hãng</option>
              <option value="DHL">DHL Express</option>
              <option value="FedEx">FedEx</option>
              <option value="UPS">UPS</option>
              <option value="Chuyên Tuyến Vngrow">Chuyên Tuyến Vngrow</option>
            </select>
          </div>
        </div>
      </div>

      {/* Waybill Table: Tracking, Hãng, Lộ trình, Tên hàng, Kiện/CW, Hành trình, Ghi chú */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[780px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Tracking</th>
                <th className="py-3 px-4">Hãng</th>
                <th className="py-3 px-4">Lộ trình</th>
                <th className="py-3 px-4">Tên hàng</th>
                <th className="py-3 px-4 text-center">Kiện / CW</th>
                <th className="py-3 px-4">Hành trình</th>
                <th className="py-3 px-4">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không tìm thấy vận đơn nào phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((wb) => (
                  <tr key={wb.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <button
                        onClick={(e) => handleTrackingClick(e, wb)}
                        className="font-extrabold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1.5 text-left text-xs"
                        title="Bấm tra cứu hành trình trực tiếp"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>{wb.trackingNumber}</span>
                      </button>
                      <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                        Booking: <span className="font-bold text-slate-600 font-mono">{wb.bookingId}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-xs ${getCarrierColor(wb.carrier)}`}>{wb.carrier}</span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800 text-xs">
                      {wb.route}
                    </td>

                    <td className="py-3.5 px-4 align-top w-[210px]">
                      <FixedWrapTextBox
                        text={wb.goodsName}
                        widthClass="w-[200px]"
                        maxLines={3}
                        variant="default"
                      />
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono align-top">
                      <div className="text-xs font-bold text-slate-800">{wb.totalPackage} kiện</div>
                      <div className="text-[11px] text-slate-500 font-semibold">{wb.totalCw} kg</div>
                    </td>

                    <td className="py-3.5 px-4 align-top">{getStatusBadge(wb.status)}</td>

                    <td className="py-3.5 px-4 align-top w-[190px]">
                      <FixedWrapTextBox
                        text={wb.note || ''}
                        widthClass="w-[180px]"
                        maxLines={3}
                        variant="subtle"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VngrowTrackingModal
        booking={selectedBookingForVngrowTracking}
        isOpen={!!selectedBookingForVngrowTracking}
        onClose={() => setSelectedBookingForVngrowTracking(null)}
      />
    </div>
  );
};
