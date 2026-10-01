import React from 'react';
import { Booking } from '../../types';
import { useLogistics } from '../../context/LogisticsContext';
import {
  X,
  FileSpreadsheet,
  FileText,
  Clock,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Truck,
} from 'lucide-react';

interface BookingDetailModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { collaborators, role } = useLogistics();

  if (!isOpen || !booking) return null;

  const ctv = collaborators.find((c) => c.id === booking.collaboratorId);
  const profit = booking.price - booking.cost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-extrabold text-sky-700 text-lg">
                {booking.code}
              </span>
              <span className="text-slate-300">|</span>
              <h2 className="text-sm font-bold text-slate-800">
                {booking.senderName} ➔ {booking.receiverName} ({booking.receiverCountry.split('(')[0]})
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Khởi tạo ngày {booking.date} · Dịch vụ: {booking.service}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Main 2 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Timeline & Documents */}
            <div className="md:col-span-2 space-y-6">
              {/* Timeline */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  Tiến độ vận chuyển & Trạng thái lô hàng
                </h3>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {booking.timeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3">
                      <div
                        className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          step.completed ? 'bg-sky-600' : 'bg-slate-300'
                        }`}
                      ></div>
                      <div>
                        <div
                          className={`text-xs font-bold ${
                            step.completed ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </div>
                        {step.time && (
                          <div className="text-[11px] text-slate-400 font-medium tabular-nums">
                            {step.time}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items & Documents */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-600" />
                  Chứng từ & Chi tiết mặt hàng
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-500">Mô tả hàng hóa:</span>
                    <span className="font-bold text-slate-800">{booking.description}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-500">Số lượng kiện:</span>
                    <span className="font-bold text-slate-800">
                      {booking.packages.length || 1} kiện
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-500">Trọng lượng tính cước (CW):</span>
                    <span className="font-bold text-sky-700 tabular-nums">
                      {booking.actualCw || booking.totalCw} kg
                      {booking.actualMeasured && (
                        <span className="text-[10px] text-emerald-600 ml-1 font-semibold">
                          (Đã đo thực tế tại kho)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">File đính kèm:</span>
                    <div className="flex gap-2">
                      <span className="text-sky-700 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                        <FileSpreadsheet className="w-3.5 h-3.5" /> packing_list.xlsx
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Financials & CTV Commission */}
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Tài chính & Hoa hồng
                </h3>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500">Cước thu khách (Doanh số):</span>
                    <div className="font-mono font-extrabold text-lg text-slate-900 tabular-nums">
                      {booking.price.toLocaleString('vi-VN')} ₫
                    </div>
                  </div>

                  {role === 'nv' && (
                    <>
                      <div>
                        <span className="text-slate-500">Giá vốn đại lý (Cost):</span>
                        <div className="font-mono font-bold text-sm text-rose-600 tabular-nums">
                          {booking.cost.toLocaleString('vi-VN')} ₫
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-slate-500 font-bold">Lợi nhuận gộp Vngrow:</span>
                        <div className="font-mono font-extrabold text-base text-emerald-600 tabular-nums">
                          +{profit.toLocaleString('vi-VN')} ₫
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-sky-800 font-bold">Hoa hồng CTV ({ctv?.name || 'CTV'}):</span>
                    <div className="font-mono font-extrabold text-base text-sky-700 tabular-nums">
                      +{booking.commission.toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                </div>
              </div>

              {/* Incidents box */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Ghi nhận sự cố (Incident)
                  </span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Chưa ghi nhận sự cố nào phát sinh trên lô hàng này. Hàng hóa di chuyển đúng tiến độ.
                </p>
                <button
                  type="button"
                  onClick={() => alert('Chức năng ghi nhận sự cố kiểm tra ngoại quan kiện hàng')}
                  className="w-full py-1 text-xs font-semibold text-amber-800 border border-amber-300 rounded hover:bg-amber-100 transition-colors"
                >
                  + Báo cáo sự cố kiện hàng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" /> In Phiếu Gửi Hàng (Air Waybill)
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
