import React, { useState, useEffect } from 'react';
import { X, Scale, CheckCircle2, DollarSign, AlertCircle } from 'lucide-react';
import { Booking } from '../../types';

interface CtvConfirmMeasureModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingId: string, ctvNewPrice: number) => void;
}

export const CtvConfirmMeasureModal: React.FC<CtvConfirmMeasureModalProps> = ({
  booking,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [ctvNewPrice, setCtvNewPrice] = useState<number>(0);

  useEffect(() => {
    if (booking) {
      // Default to revisedPrice or current price
      setCtvNewPrice(booking.revisedPrice || booking.price || 0);
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ctvNewPrice <= 0) {
      alert('Vui lòng nhập giá bán hợp lệ của CTV cho khách hàng!');
      return;
    }
    onConfirm(booking.id, ctvNewPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Xác Nhận Cân Đo Thực Tế & Giá Bán Mới
              </h2>
              <div className="text-[11px] text-slate-500 font-mono">
                Booking: <span className="font-bold text-sky-700">{booking.code}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Warehouse Measurement Summary */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Số Liệu Đo Đạc Thực Tế Tại Kho Vngrow
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Trọng lượng ban đầu (Khai báo):</span>
                <span className="font-mono font-bold text-slate-700">
                  {booking.totalCw} kg CW
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Trọng lượng tính cước (Thực tế):</span>
                <span className="font-mono font-extrabold text-rose-600 text-sm">
                  {booking.actualCw || booking.totalCw} kg CW
                </span>
              </div>
            </div>
            {booking.revisedPrice && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Giá cước Vngrow đề xuất mới:</span>
                <span className="font-mono font-bold text-slate-900">
                  {booking.revisedPrice.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            )}
          </div>

          {/* CTV New Price Input */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-bold text-slate-800">
              Nhập giá bán mới của CTV cho khách hàng (VND) *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="1000"
                step="10000"
                value={ctvNewPrice}
                onChange={(e) => setCtvNewPrice(Number(e.target.value))}
                className="w-full px-3 py-2 pr-12 border border-slate-300 rounded-lg text-sm font-mono font-extrabold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Ví dụ: 3500000"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                VND
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Đây là giá cuối cùng bạn báo khách hàng sau khi cập nhật cân nặng thực tế tại kho.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Sau khi xác nhận, trạng thái sẽ tự động chuyển sang <strong>&ldquo;CTV xác nhận&rdquo;</strong> để Vngrow tiến hành tạo bill vận chuyển.
            </span>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác Nhận Giá & Đổi Trạng Thái</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
