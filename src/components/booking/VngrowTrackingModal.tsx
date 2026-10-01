import React from 'react';
import { X, Plane, CheckCircle2, Clock, MapPin, Truck, Building2, ShieldCheck } from 'lucide-react';
import { Booking } from '../../types';

interface VngrowTrackingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VngrowTrackingModal: React.FC<VngrowTrackingModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !booking) return null;

  const trackingCode = booking.trackingNumber || `VNG-${booking.code.replace('BK-', '')}`;

  const internalTimeline = [
    {
      time: '01/10/2026 08:30',
      title: 'Đã hoàn tất thông quan xuất khẩu tại Cảng hàng không Tân Sơn Nhất (SGN)',
      location: 'TP. Hồ Chí Minh, Việt Nam',
      completed: true,
    },
    {
      time: '30/09/2026 16:45',
      title: 'Hàng đã kiểm tra an ninh soi chiếu và xếp lên mâm bay ULD chuyên tuyến',
      location: 'Kho hàng Vngrow Express SGN',
      completed: true,
    },
    {
      time: '29/09/2026 14:20',
      title: 'Nhận hàng tại văn phòng & Cân đo kiểm tra quy cách đóng gói',
      location: 'Trung tâm khai thác Vngrow Express',
      completed: true,
    },
    {
      time: '29/09/2026 09:15',
      title: 'Khởi tạo vận đơn chuyên tuyến Vngrow Express',
      location: 'Hệ thống Vngrow Portal',
      completed: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-sky-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-sky-200 font-bold">
                Tra Cứu Chuyên Tuyến Vngrow Express
              </div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Mã Vận Đơn:</span>
                <span className="font-mono text-amber-300">{trackingCode}</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Shipment Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Booking ID</span>
              <span className="font-mono font-bold text-sky-700">{booking.code}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Trọng lượng tính</span>
              <span className="font-mono font-bold text-slate-800">
                {booking.actualCw || booking.totalCw} kg
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Lộ trình</span>
              <span className="font-bold text-slate-800 truncate block">
                {booking.senderCountry.split('(')[0]} ➔ {booking.receiverCountry.split('(')[0]}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Dịch vụ</span>
              <span className="font-bold text-emerald-700 truncate block">Chuyên Tuyến Vngrow</span>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-sky-600" />
              Lịch Trình Vận Chuyển Chi Tiết
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {internalTimeline.map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-400 text-[11px] mb-1">
                      <span className="font-mono text-slate-700 font-bold">{item.time}</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
                      </span>
                    </div>
                    <div className="font-bold text-slate-800 text-xs">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notice */}
          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-sky-800 flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              Hàng hóa được giám sát trực tiếp bởi Đội ngũ Điều Hành Vngrow Express 24/7.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex justify-end bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
