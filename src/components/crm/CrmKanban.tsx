import React from 'react';
import { LeadDeal, DealStage } from '../../types';
import { useLogistics } from '../../context/LogisticsContext';
import {
  MessageSquare,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  PackagePlus,
  Phone,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface CrmKanbanProps {
  deals: LeadDeal[];
  onSelectDeal: (deal: LeadDeal) => void;
  onOpenCreateQuote?: (deal: LeadDeal) => void;
  onConvertBooking: (deal: LeadDeal) => void;
}

interface ColumnConfig {
  id: DealStage;
  title: string;
  badgeBg: string;
  badgeColor: string;
  borderTop: string;
}

export const CrmKanban: React.FC<CrmKanbanProps> = ({
  deals,
  onSelectDeal,
  onOpenCreateQuote,
  onConvertBooking,
}) => {
  const { updateDealStage, collaborators, role } = useLogistics();

  const columns: ColumnConfig[] = [
    {
      id: 'new',
      title: 'Mới tiếp nhận',
      badgeBg: 'bg-slate-100',
      badgeColor: 'text-slate-700',
      borderTop: 'border-slate-400',
    },
    {
      id: 'contacted',
      title: 'Đang tư vấn / Cân đối',
      badgeBg: 'bg-sky-50',
      badgeColor: 'text-sky-700',
      borderTop: 'border-sky-500',
    },
    {
      id: 'quoted',
      title: 'Đã báo giá',
      badgeBg: 'bg-amber-50',
      badgeColor: 'text-amber-700',
      borderTop: 'border-amber-500',
    },
    {
      id: 'won',
      title: 'Đã chốt (Thành công)',
      badgeBg: 'bg-emerald-50',
      badgeColor: 'text-emerald-700',
      borderTop: 'border-emerald-500',
    },
    {
      id: 'lost',
      title: 'Đã hủy / Mất deal',
      badgeBg: 'bg-rose-50',
      badgeColor: 'text-rose-700',
      borderTop: 'border-rose-400',
    },
  ];

  const getCtvName = (ctvId: string) => {
    const ctv = collaborators.find((c) => c.id === ctvId);
    return ctv ? ctv.name : 'Vngrow Sales';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 h-[calc(100vh-270px)] overflow-x-auto pb-4">
      {columns.map((col) => {
        const columnDeals = deals.filter((d) => d.stage === col.id);
        const columnTotalValue = columnDeals.reduce((sum, d) => sum + (d.estimatedValue || 0), 0);

        return (
          <div
            key={col.id}
            className="flex flex-col bg-slate-100/80 rounded-xl border border-slate-200/80 p-3 h-full overflow-hidden"
          >
            {/* Column Header */}
            <div className={`pt-1 pb-3 px-1 border-t-4 ${col.borderTop} flex flex-col gap-1`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800">{col.title}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeBg} ${col.badgeColor}`}
                >
                  {columnDeals.length}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 tabular-nums">
                Tổng: {columnTotalValue.toLocaleString('vi-VN')} ₫
              </div>
            </div>

            {/* Column Cards List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 mt-1">
              {columnDeals.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-lg p-3 text-center">
                  <span>Chưa có deal ở giai đoạn này</span>
                </div>
              ) : (
                columnDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow group relative"
                  >
                    {/* Top Row: Code & Source */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-extrabold text-sky-700 tracking-tight">{deal.code}</span>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {deal.source}
                      </span>
                    </div>

                    {/* Deal Title */}
                    <button
                      onClick={() => onSelectDeal(deal)}
                      className="text-left font-bold text-sm text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 mb-2 leading-snug"
                    >
                      {deal.title}
                    </button>

                    {/* Customer Info */}
                    <div className="text-xs text-slate-600 mb-2.5 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{deal.customerName}</span>
                      <span className="text-slate-500 tabular-nums">{deal.customerPhone}</span>
                    </div>

                    {/* Route & Cargo Metric */}
                    <div className="bg-slate-50 rounded p-2 text-xs mb-3 space-y-1 border border-slate-100">
                      <div className="flex items-center justify-between font-semibold text-slate-700">
                        <span>Tuyến: {deal.route}</span>
                        <span className="tabular-nums font-bold text-sky-700">{deal.estimatedWeight} kg</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="truncate max-w-[130px]">{deal.cargoType}</span>
                        <span className="font-bold text-slate-900 tabular-nums">
                          {deal.estimatedValue.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>

                    {/* CTV assignment badge if in NV role */}
                    {role === 'nv' && (
                      <div className="text-[11px] text-slate-500 mb-2.5 flex items-center justify-between">
                        <span>CTV:</span>
                        <span className="font-bold text-slate-700">{getCtvName(deal.collaboratorId)}</span>
                      </div>
                    )}

                    {/* Actions and Stage advancement */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                      <button
                        onClick={() => onSelectDeal(deal)}
                        className="text-sky-700 hover:text-sky-900 font-semibold text-[11px] py-1 px-1.5 rounded hover:bg-sky-50 transition-colors"
                      >
                        Chi tiết ({deal.activities.length})
                      </button>

                      <div className="flex items-center gap-1">
                        {deal.stage === 'new' && (
                          <button
                            onClick={() => updateDealStage(deal.id, 'contacted')}
                            className="bg-sky-50 text-sky-700 hover:bg-sky-100 px-2 py-1 rounded text-[11px] font-bold transition-colors"
                            title="Chuyển sang Đang tư vấn"
                          >
                            Tư vấn
                          </button>
                        )}

                        {deal.stage === 'contacted' && (
                          <button
                            onClick={() => updateDealStage(deal.id, 'quoted')}
                            className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-2 py-1 rounded text-[11px] font-bold transition-colors"
                            title="Chuyển sang Đã báo giá"
                          >
                            Báo giá
                          </button>
                        )}

                        {deal.stage === 'quoted' && (
                          <button
                            onClick={() => onConvertBooking(deal)}
                            className="bg-emerald-600 text-white hover:bg-emerald-700 px-2 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1 shadow-xs"
                            title="Chốt deal và lên Booking ngay"
                          >
                            <PackagePlus className="w-3 h-3" />
                            Lên Booking
                          </button>
                        )}

                        {deal.stage === 'won' && (
                          <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Đã chốt
                          </span>
                        )}

                        {deal.stage !== 'won' && deal.stage !== 'lost' && (
                          <button
                            onClick={() => {
                              const reason = prompt('Nhập lý do hủy / mất cơ hội:');
                              if (reason) updateDealStage(deal.id, 'lost', reason);
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                            title="Đánh dấu hủy deal"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
