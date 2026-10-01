import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { LeadDeal } from '../../types';
import { CrmTable } from './CrmTable';
import { DealModal } from './DealModal';
import { DealDetailModal } from './DealDetailModal';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  KanbanSquare,
} from 'lucide-react';

interface CrmViewProps {
  onOpenCreateBookingModal?: () => void;
  onOpenCreateQuoteModal?: (deal: LeadDeal) => void;
}

export const CrmView: React.FC<CrmViewProps> = ({
  onOpenCreateBookingModal,
  onOpenCreateQuoteModal,
}) => {
  const {
    role,
    visibleDeals,
    collaborators,
    selectedCtvFilter,
    setSelectedCtvFilter,
    convertDealToBooking,
    convertDealToCustomer,
  } = useLogistics();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<LeadDeal | null>(null);

  // Filter deals by search
  const filteredDeals = visibleDeals.filter((d) => {
    return (
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.customerPhone.includes(searchTerm)
    );
  });

  // Calculate Metrics
  const totalDeals = visibleDeals.length;
  const inProgressDeals = visibleDeals.filter(
    (d) => d.stage === 'contacted' || d.stage === 'quoted'
  ).length;
  const wonDeals = visibleDeals.filter((d) => d.stage === 'won').length;

  return (
    <div className="space-y-5">
      {/* Top Metric Cards - Clean & Concise */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Tổng số Deals</span>
            <KanbanSquare className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{totalDeals}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cơ hội trong hệ thống</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Đang Tư Vấn & Báo Giá</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 tabular-nums">{inProgressDeals}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cần tiếp tục chăm sóc</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Đã Chốt Thành Công</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">{wonDeals}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Đã chuyển sang Booking</div>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo Deal ID, tên khách, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all font-mono"
            />
          </div>

          {/* CTV Filter for NV role */}
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
          <span>Tạo Deal</span>
        </button>
      </div>

      {/* Main Table View */}
      <CrmTable
        deals={filteredDeals}
        onSelectDeal={(d) => setSelectedDeal(d)}
        onEditDeal={(d) => setSelectedDeal(d)}
        onConvertBooking={(d) => convertDealToBooking(d.id)}
        onSaveCustomer={(d) => convertDealToCustomer(d.id)}
      />

      {/* Modals */}
      <DealModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <DealDetailModal
        deal={selectedDeal}
        onClose={() => setSelectedDeal(null)}
        onConvertBooking={(d) => convertDealToBooking(d.id)}
        onOpenCreateQuote={onOpenCreateQuoteModal}
      />
    </div>
  );
};
