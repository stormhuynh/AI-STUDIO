import React, { useState } from 'react';
import { Rfq } from '../../types';
import { useLogistics } from '../../context/LogisticsContext';
import { X, Send, DollarSign, Calculator } from 'lucide-react';

interface CreateQuoteModalProps {
  rfq: Rfq | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateQuoteModal: React.FC<CreateQuoteModalProps> = ({
  rfq,
  isOpen,
  onClose,
}) => {
  const { submitQuoteForRfq } = useLogistics();

  const [shippingFee, setShippingFee] = useState<number>(4500000);
  const [customsFee, setCustomsFee] = useState<number>(2000000);
  const [specialFee, setSpecialFee] = useState<number>(1500000);
  const [note, setNote] = useState(
    'Báo giá đã bao gồm phụ phí xăng dầu và kiểm dịch hàng không. Chưa bao gồm thuế VAT tại đầu đến nếu có.'
  );

  if (!isOpen || !rfq) return null;

  const totalFee = (Number(shippingFee) || 0) + (Number(customsFee) || 0) + (Number(specialFee) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuoteForRfq(rfq.id, {
      shippingFee,
      customsFee,
      specialFee,
      totalFee,
      note,
      quotedDate: new Date().toLocaleString('vi-VN'),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Lập Bảng Báo Giá (Gửi CTV / Khách)
            </h2>
            <p className="text-xs text-slate-500">
              Tham chiếu yêu cầu: {rfq.id} · {rfq.goodsDescription}
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
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              1. Cước vận chuyển chính (Freight Fee, VND) *
            </label>
            <input
              type="number"
              required
              step="50000"
              value={shippingFee}
              onChange={(e) => setShippingFee(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              2. Phí khai báo Hải quan & Kiểm dịch (VND)
            </label>
            <input
              type="number"
              step="50000"
              value={customsFee}
              onChange={(e) => setCustomsFee(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              3. Phụ phí hàng nguy hiểm DG / Đóng gói chuyên dụng (VND)
            </label>
            <input
              type="number"
              step="50000"
              value={specialFee}
              onChange={(e) => setSpecialFee(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold tabular-nums"
            />
          </div>

          {/* Total calculation box */}
          <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-sky-900 uppercase">
              TỔNG CƯỚC BÁO GIÁ CHO LÔ HÀNG:
            </span>
            <span className="text-xl font-mono font-extrabold text-sky-700 tabular-nums">
              {totalFee.toLocaleString('vi-VN')} ₫
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ghi chú gửi kèm báo giá (Quy chuẩn đóng gói, nhãn mác, thời hạn giá)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs leading-relaxed"
            />
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
              className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              Chốt và Gửi Báo Giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
