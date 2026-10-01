import React, { useState } from 'react';
import { Booking } from '../../types';
import { useLogistics } from '../../context/LogisticsContext';
import { X, Scale, AlertTriangle, Send } from 'lucide-react';

interface UpdateSizeModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateSizeModal: React.FC<UpdateSizeModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { updateBookingMeasurements } = useLogistics();

  const [actualGw, setActualGw] = useState<number>(booking?.actualGw || booking?.totalGw || 12.5);
  const [actualLength, setActualLength] = useState<number>(45);
  const [actualWidth, setActualWidth] = useState<number>(35);
  const [actualHeight, setActualHeight] = useState<number>(35);
  const [packingFee, setPackingFee] = useState<number>(200000);

  if (!isOpen || !booking) return null;

  const actualVw = Math.round(((actualLength * actualWidth * actualHeight) / 5000) * 10) / 10;
  const actualCw = Math.max(actualGw, actualVw);

  // Price adjustment
  const unitRatePerKg = Math.round(booking.price / (booking.totalCw || 1));
  const newFreightPrice = Math.round(actualCw * unitRatePerKg);
  const revisedPrice = newFreightPrice + packingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookingMeasurements(booking.id, actualGw, actualCw, revisedPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Đo Đạc & Cập Nhật Giá Thực Tế ({booking.code})
            </h2>
            <p className="text-xs text-slate-500">
              Cập nhật kích thước thực đo tại kho Vngrow và gửi thông báo xác nhận giá mới
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* Declared vs Measured */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between">
            <div>
              <span className="text-slate-500">Khách khai báo ban đầu:</span>
              <div className="font-bold text-slate-800 text-sm mt-0.5">
                {booking.totalCw} kg CW · {booking.price.toLocaleString('vi-VN')} ₫
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Lô hàng:</span>
              <div className="font-semibold text-slate-800">{booking.description}</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Kích thước và Cân nặng thực đo tại kho
            </label>
            <div className="grid grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <label className="text-[11px] text-slate-500 font-semibold">GW (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={actualGw}
                  onChange={(e) => setActualGw(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold text-sky-700"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-semibold">Dài (cm)</label>
                <input
                  type="number"
                  value={actualLength}
                  onChange={(e) => setActualLength(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-center"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-semibold">Rộng (cm)</label>
                <input
                  type="number"
                  value={actualWidth}
                  onChange={(e) => setActualWidth(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-center"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-semibold">Cao (cm)</label>
                <input
                  type="number"
                  value={actualHeight}
                  onChange={(e) => setActualHeight(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-center"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Phí gia cố đóng gói đặc biệt (nếu có, VND)
            </label>
            <input
              type="number"
              step="50000"
              value={packingFee}
              onChange={(e) => setPackingFee(Number(e.target.value))}
              placeholder="VD: 200000"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold tabular-nums"
            />
          </div>

          {/* Pricing Comparison */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-amber-50/80 border border-amber-300 rounded-xl">
            <div>
              <div className="text-xs text-slate-500 font-semibold">GIÁ CŨ ĐÃ BÁO</div>
              <div className="text-base line-through text-slate-500 font-mono mt-1">
                {booking.price.toLocaleString('vi-VN')} ₫
              </div>
              <div className="text-[11px] text-slate-400">({booking.totalCw} kg)</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-amber-900 font-extrabold flex items-center justify-end gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                GIÁ MỚI SAU KHI ĐO
              </div>
              <div className="text-xl font-extrabold text-rose-600 font-mono mt-1 tabular-nums">
                {revisedPrice.toLocaleString('vi-VN')} ₫
              </div>
              <div className="text-[11px] text-slate-600 font-semibold">
                (Thực tính CW: {actualCw} kg)
              </div>
            </div>
          </div>

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
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Gửi Xác Nhận Giá Mới Cho CTV / Khách
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
