import React from 'react';
import { Rfq } from '../../types';
import { useLogistics } from '../../context/LogisticsContext';
import {
  X,
  FileSpreadsheet,
  Download,
  Share2,
  PackagePlus,
  AlertCircle,
  CheckCircle2,
  Printer,
} from 'lucide-react';

interface QuoteDetailModalProps {
  rfq: Rfq | null;
  isOpen: boolean;
  onClose: () => void;
  onConvertBooking: (rfq: Rfq) => void;
}

export const QuoteDetailModal: React.FC<QuoteDetailModalProps> = ({
  rfq,
  isOpen,
  onClose,
  onConvertBooking,
}) => {
  const { role, addToast } = useLogistics();

  if (!isOpen || !rfq || !rfq.quote) return null;

  const quote = rfq.quote;

  const handleShareZalo = () => {
    addToast('Đã tạo liên kết chia sẻ báo giá PDF qua Zalo cho khách hàng!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="text-xs font-bold uppercase text-sky-800 tracking-wider">
              BẢNG BÁO GIÁ CƯỚC CHUYỂN PHÁT QUỐC TẾ
            </div>
            <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
              Mã tham chiếu: {rfq.id}
            </h2>
            <div className="text-xs text-slate-500">
              {rfq.originCountry} ➔ {rfq.destCountry} · Ngày báo: {quote.quotedDate}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Detailed Fee Rows */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Chi phí dự kiến cho lô hàng ({rfq.estimatedWeight} kg)
            </h3>
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/80">
                <span className="font-semibold text-slate-600">
                  1. Cước vận chuyển chính (Air Freight Rate)
                </span>
                <span className="font-mono font-bold text-slate-800 tabular-nums">
                  {quote.shippingFee.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/80">
                <span className="font-semibold text-slate-600">
                  2. Phụ phí khai báo hàng nguy hiểm (DG) / Đặc biệt
                </span>
                <span className="font-mono font-bold text-slate-800 tabular-nums">
                  {quote.specialFee.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/80">
                <span className="font-semibold text-slate-600">
                  3. Phí soi chiếu an ninh & Khai báo Hải quan
                </span>
                <span className="font-mono font-bold text-slate-800 tabular-nums">
                  {quote.customsFee.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 text-sm font-extrabold text-sky-800">
                <span>TỔNG CỘNG LÔ HÀNG:</span>
                <span className="text-xl font-mono tabular-nums">
                  {quote.totalFee.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Packing Guidelines */}
          {quote.note && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Lưu ý quan trọng khi đóng gói & gửi hàng:
              </div>
              <p className="leading-relaxed text-amber-850 pl-5">{quote.note}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareZalo}
              className="px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" /> Gửi Zalo
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Tải PDF
            </button>
          </div>

          {role === 'ctv' && (
            <button
              onClick={() => {
                onConvertBooking(rfq);
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <PackagePlus className="w-4 h-4" />
              Tạo Booking Ngay
            </button>
          )}

          {role === 'nv' && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
