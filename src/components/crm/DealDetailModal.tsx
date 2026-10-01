import React, { useState } from 'react';
import { LeadDeal, DealStage } from '../../types';
import { useLogistics } from '../../context/LogisticsContext';
import {
  X,
  Phone,
  MessageSquare,
  FileSpreadsheet,
  PackagePlus,
  UserPlus,
  Send,
  Clock,
  MapPin,
  Package,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface DealDetailModalProps {
  deal: LeadDeal | null;
  onClose: () => void;
  onConvertBooking: (deal: LeadDeal) => void;
  onOpenCreateQuote?: (deal: LeadDeal) => void;
}

export const DealDetailModal: React.FC<DealDetailModalProps> = ({
  deal,
  onClose,
  onConvertBooking,
  onOpenCreateQuote,
}) => {
  const {
    updateDealStage,
    addDealActivity,
    convertDealToCustomer,
    collaborators,
    role,
  } = useLogistics();

  const [newActivityContent, setNewActivityContent] = useState('');
  const [activityType, setActivityType] = useState<'call' | 'zalo' | 'quote' | 'note'>('zalo');

  if (!deal) return null;

  const ctv = collaborators.find((c) => c.id === deal.collaboratorId);

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityContent.trim()) return;
    addDealActivity(deal.id, newActivityContent.trim(), activityType);
    setNewActivityContent('');
  };

  const handleSaveAsCustomer = () => {
    convertDealToCustomer(deal.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="font-mono font-extrabold text-sky-700 text-base">{deal.code}</span>
            <span className="text-slate-300">|</span>
            <h2 className="text-base font-bold text-slate-900 truncate max-w-md">{deal.title}</h2>
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
          {/* Top Status & Fast Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase block mb-1">
                Giai đoạn hiện tại:
              </span>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Thay đổi trạng thái cơ hội"
                  value={deal.stage}
                  onChange={(e) => updateDealStage(deal.id, e.target.value as DealStage)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="new">Mới tiếp nhận (New)</option>
                  <option value="contacted">Đang tư vấn / Cân đối (Contacted)</option>
                  <option value="quoted">Đã báo giá (Quoted)</option>
                  <option value="won">Đã chốt thành công (Won)</option>
                  <option value="lost">Đã hủy / Mất deal (Lost)</option>
                </select>
                <span className="text-xs text-slate-400">· Nguồn: {deal.source}</span>
              </div>
            </div>

            {/* Conversion Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveAsCustomer}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                title="Lưu thông tin khách hàng này vào danh bạ Customer 360"
              >
                <UserPlus className="w-3.5 h-3.5 text-sky-600" />
                Lưu vào Khách Hàng
              </button>

              <button
                onClick={() => {
                  onConvertBooking(deal);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                title="Chuyển ngay cơ hội này thành Booking vận đơn"
              >
                <PackagePlus className="w-3.5 h-3.5" />
                1-Click Tạo Booking
              </button>
            </div>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
              <div className="font-bold text-xs uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                Thông tin người gửi & Liên hệ
              </div>
              <div className="text-base font-bold text-slate-900">{deal.customerName}</div>
              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800 tabular-nums">{deal.customerPhone}</span>
                </div>
                {deal.customerEmail && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">@</span>
                    <span>{deal.customerEmail}</span>
                  </div>
                )}
                {role === 'nv' && ctv && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">CTV phụ trách:</span>
                    <span className="font-bold text-sky-700">{ctv.name} ({ctv.code})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipment Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
              <div className="font-bold text-xs uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-sky-600" />
                Nhu cầu vận chuyển & Dự toán
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Tuyến bay:</span>
                <span className="font-bold text-slate-900">{deal.route}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Hàng hóa:</span>
                <span className="font-semibold text-slate-800">{deal.cargoType}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Khối lượng ước tính:</span>
                <span className="font-bold text-sky-700 tabular-nums">{deal.estimatedWeight} kg</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500 font-semibold">Giá trị deal dự kiến:</span>
                <span className="font-mono font-extrabold text-base text-slate-900 tabular-nums">
                  {deal.estimatedValue.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>
          </div>

          {deal.lossReason && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Lý do hủy / không chốt:</span> {deal.lossReason}
              </div>
            </div>
          )}

          {/* Activity / Interaction History & Add New Activity */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span>Nhật ký tương tác & Chăm sóc ({deal.activities.length})</span>
              <span className="text-xs font-normal text-slate-400">Cập nhật lần cuối: {deal.lastActivity}</span>
            </h3>

            {/* Input to add activity */}
            <form onSubmit={handleAddActivity} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">Hình thức:</span>
                <div className="flex items-center gap-2 text-xs">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="actType"
                      checked={activityType === 'zalo'}
                      onChange={() => setActivityType('zalo')}
                    />
                    <span>Chat Zalo</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="actType"
                      checked={activityType === 'call'}
                      onChange={() => setActivityType('call')}
                    />
                    <span>Gọi điện thoại</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="actType"
                      checked={activityType === 'quote'}
                      onChange={() => setActivityType('quote')}
                    />
                    <span>Gửi bảng giá</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="actType"
                      checked={activityType === 'note'}
                      onChange={() => setActivityType('note')}
                    />
                    <span>Ghi chú nội bộ</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập nội dung trao đổi với khách, kết quả tư vấn, lịch hẹn..."
                  value={newActivityContent}
                  onChange={(e) => setNewActivityContent(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  Ghi lại
                </button>
              </div>
            </form>

            {/* List of past activities */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {deal.activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    {act.type === 'call' && <Phone className="w-3.5 h-3.5 text-emerald-600" />}
                    {act.type === 'zalo' && <MessageSquare className="w-3.5 h-3.5 text-sky-600" />}
                    {act.type === 'quote' && <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />}
                    {act.type === 'note' && <Clock className="w-3.5 h-3.5 text-slate-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-bold text-slate-700">{act.author}</span>
                      <span>{act.createdAt}</span>
                    </div>
                    <div className="text-slate-800 leading-relaxed font-medium">{act.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-end bg-slate-50/50">
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
