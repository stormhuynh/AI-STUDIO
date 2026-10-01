import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Rfq, RfqStatus } from '../../types';
import { CreateRfqModal } from './CreateRfqModal';
import { EditRfqModal } from './EditRfqModal';
import { CreateQuoteModal } from './CreateQuoteModal';
import { QuoteDetailModal } from './QuoteDetailModal';
import { FixedWrapTextBox } from '../common/FixedWrapTextBox';
import {
  FileSpreadsheet,
  Search,
  Plus,
  ArrowRight,
  Eye,
  Send,
  Edit,
  Trash2,
} from 'lucide-react';

interface RfqListProps {
  onConvertRfqToBooking?: (rfq: Rfq) => void;
}

export const RfqList: React.FC<RfqListProps> = ({ onConvertRfqToBooking }) => {
  const {
    role,
    visibleRfqs,
    collaborators,
    selectedCtvFilter,
    setSelectedCtvFilter,
    sendRfq,
    deleteRfq,
    addBooking,
  } = useLogistics();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRfqForEdit, setSelectedRfqForEdit] = useState<Rfq | null>(null);
  const [selectedRfqForQuote, setSelectedRfqForQuote] = useState<Rfq | null>(null);
  const [selectedRfqForDetail, setSelectedRfqForDetail] = useState<Rfq | null>(null);

  const filteredRfqs = visibleRfqs.filter((r) => {
    return (
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.goodsDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusBadge = (status: RfqStatus) => {
    switch (status) {
      case 'draft':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            Draft
          </span>
        );
      case 'sent':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-300">
            Sent
          </span>
        );
      case 'reviewing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Reviewing
          </span>
        );
      case 'quoted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Quoted
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getCtvName = (ctvId: string) => {
    const ctv = collaborators.find((c) => c.id === ctvId);
    return ctv ? ctv.name : 'Vngrow';
  };

  const handleDelete = (rfq: Rfq) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa yêu cầu báo giá ${rfq.id}?`)) {
      deleteRfq(rfq.id);
    }
  };

  const handleCreateBookingFromQuote = (rfq: Rfq) => {
    if (!rfq.quote) return;
    addBooking({
      senderName: rfq.customerName,
      senderPhone: rfq.customerPhone,
      senderEmail: rfq.customerEmail,
      senderAddress: 'Việt Nam',
      senderCountry: rfq.originCountry,
      receiverName: 'Đối tác nhận quốc tế',
      receiverPhone: '',
      receiverAddress: rfq.destCountry,
      receiverCountry: rfq.destCountry,
      service: rfq.desiredServices[0] || 'Vngrow đề xuất',
      pickupMethod: 'Lấy tận nơi (Pick-up)',
      description: rfq.goodsDescription,
      packages: [
        {
          id: 'pkg-' + Date.now(),
          length: 40,
          width: 30,
          height: 30,
          gw: rfq.estimatedWeight,
          items: [
            {
              id: 'it-' + Date.now(),
              name: rfq.goodsDescription,
              unitPrice: 50,
              currency: 'USD',
              unit: 'kiện',
              quantity: 1,
              totalAmount: 50,
            },
          ],
        },
      ],
      totalGw: rfq.estimatedWeight,
      totalVw: rfq.estimatedWeight,
      totalCw: rfq.estimatedWeight,
      declaredValue: 50,
      actualMeasured: false,
      price: rfq.quote.totalFee,
      cost: Math.round(rfq.quote.totalFee * 0.8),
      commission: Math.round(rfq.quote.totalFee * 0.07),
      collaboratorId: rfq.collaboratorId,
      status: 'sent',
    });
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
              placeholder="Tìm theo Mã RFQ, Tên hàng, Khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all font-mono"
            />
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
          <span>Tạo Yêu Cầu Báo Giá</span>
        </button>
      </div>

      {/* RFQ Table with Sửa, Gửi, Xóa */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Mã RFQ</th>
                <th className="py-3 px-4">Lộ trình</th>
                <th className="py-3 px-4">Hàng hóa</th>
                <th className="py-3 px-4 text-center">Trọng lượng</th>
                {role === 'nv' && <th className="py-3 px-4">Khách & CTV</th>}
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRfqs.length === 0 ? (
                <tr>
                  <td colSpan={role === 'nv' ? 7 : 6} className="py-12 text-center text-slate-400">
                    Không tìm thấy yêu cầu báo giá nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredRfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-700">
                      {rfq.id}
                      <div className="text-[11px] text-slate-400 font-sans mt-0.5">{rfq.date}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                        <span>{rfq.originCountry.split('(')[0].trim()}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-slate-900">{rfq.destCountry.split('(')[0].trim()}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top w-[250px]">
                      <FixedWrapTextBox
                        text={rfq.goodsDescription}
                        widthClass="w-[240px]"
                        maxLines={2}
                        variant="default"
                      />
                      {rfq.storageRequirement && (
                        <div className="mt-1">
                          <FixedWrapTextBox
                            text={rfq.storageRequirement}
                            widthClass="w-[240px]"
                            maxLines={2}
                            variant="subtle"
                          />
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 text-xs tabular-nums">
                      {rfq.estimatedWeight} kg
                    </td>

                    {role === 'nv' && (
                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-semibold text-slate-800">{rfq.customerName}</div>
                        <div className="text-slate-400 text-[11px]">
                          CTV: {getCtvName(rfq.collaboratorId)}
                        </div>
                      </td>
                    )}

                    <td className="py-3.5 px-4">{getStatusBadge(rfq.status)}</td>

                    {/* Action buttons: Sửa, Gửi, Xóa (and View Quote if quoted) */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {/* Sửa */}
                        <button
                          onClick={() => setSelectedRfqForEdit(rfq)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors flex items-center gap-1 shadow-2xs"
                          title="Sửa chi tiết RFQ"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-600" />
                          <span>Sửa</span>
                        </button>

                        {/* Gửi */}
                        <button
                          onClick={() => sendRfq(rfq.id)}
                          className="px-2.5 py-1 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded transition-colors flex items-center gap-1 shadow-2xs"
                          title="Gửi yêu cầu tới Vngrow"
                        >
                          <Send className="w-3.5 h-3.5 text-sky-600" />
                          <span>Gửi</span>
                        </button>

                        {/* Xóa */}
                        <button
                          onClick={() => handleDelete(rfq)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Xóa yêu cầu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Xem báo giá nếu đã có quote */}
                        {rfq.status === 'quoted' && (
                          <button
                            onClick={() => setSelectedRfqForDetail(rfq)}
                            className="px-2 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors flex items-center gap-1 shadow-2xs"
                            title="Xem chi tiết bảng báo giá"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Báo giá</span>
                          </button>
                        )}

                        {/* NV action: Gửi bảng giá */}
                        {role === 'nv' && rfq.status !== 'quoted' && (
                          <button
                            onClick={() => setSelectedRfqForQuote(rfq)}
                            className="px-2 py-1 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded transition-colors shadow-2xs"
                            title="Lập và gửi bảng giá cho CTV"
                          >
                            Lập giá
                          </button>
                        )}
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
      <CreateRfqModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditRfqModal
        rfq={selectedRfqForEdit}
        isOpen={!!selectedRfqForEdit}
        onClose={() => setSelectedRfqForEdit(null)}
      />

      <CreateQuoteModal
        rfq={selectedRfqForQuote}
        isOpen={!!selectedRfqForQuote}
        onClose={() => setSelectedRfqForQuote(null)}
      />

      <QuoteDetailModal
        rfq={selectedRfqForDetail}
        isOpen={!!selectedRfqForDetail}
        onClose={() => setSelectedRfqForDetail(null)}
        onConvertBooking={handleCreateBookingFromQuote}
      />
    </div>
  );
};
