import React from 'react';
import { LeadDeal, DealStage } from '../../types';
import { useLogistics } from '../../context/LogisticsContext';
import { FixedWrapTextBox } from '../common/FixedWrapTextBox';
import { UserCheck, Edit, PackagePlus, Eye } from 'lucide-react';

interface CrmTableProps {
  deals: LeadDeal[];
  onSelectDeal: (deal: LeadDeal) => void;
  onEditDeal?: (deal: LeadDeal) => void;
  onConvertBooking: (deal: LeadDeal) => void;
  onSaveCustomer: (deal: LeadDeal) => void;
}

export const CrmTable: React.FC<CrmTableProps> = ({
  deals,
  onSelectDeal,
  onEditDeal,
  onConvertBooking,
  onSaveCustomer,
}) => {
  const { collaborators, role, updateDealStage } = useLogistics();

  const getCtvName = (ctvId: string) => {
    const ctv = collaborators.find((c) => c.id === ctvId);
    return ctv ? ctv.name : 'Vngrow';
  };

  const handleStageChange = (dealId: string, newStage: DealStage) => {
    updateDealStage(dealId, newStage);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Deal ID</th>
              <th className="py-3 px-4">Thông tin</th>
              <th className="py-3 px-4">Khách hàng</th>
              <th className="py-3 px-4">Route / CW</th>
              <th className="py-3 px-4">Trạng thái</th>
              {role === 'nv' && <th className="py-3 px-4">CTV</th>}
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deals.length === 0 ? (
              <tr>
                <td colSpan={role === 'nv' ? 7 : 6} className="py-12 text-center text-slate-400">
                  Không tìm thấy cơ hội kinh doanh nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Deal ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-700">
                    <button
                      onClick={() => onSelectDeal(deal)}
                      className="hover:underline text-left block"
                    >
                      {deal.code}
                    </button>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">{deal.createdAt}</div>
                  </td>

                  {/* Thông tin */}
                  <td className="py-3.5 px-4 align-top w-[230px]">
                    <FixedWrapTextBox
                      text={deal.title}
                      widthClass="w-[220px]"
                      maxLines={2}
                      variant="default"
                    />
                    {deal.cargoType && (
                      <div className="mt-1">
                        <FixedWrapTextBox
                          text={deal.cargoType}
                          widthClass="w-[220px]"
                          maxLines={2}
                          variant="subtle"
                        />
                      </div>
                    )}
                  </td>

                  {/* Khách hàng */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 text-xs">{deal.customerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{deal.customerPhone}</div>
                  </td>

                  {/* Route / CW */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-700 text-xs">{deal.route}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{deal.estimatedWeight} kg CW</div>
                  </td>

                  {/* Trạng thái dropdown: Mới, Đang tư vấn, Đã báo giá, Thành công, Hủy bỏ */}
                  <td className="py-3.5 px-4">
                    <select
                      aria-label="Chọn trạng thái Deal"
                      value={deal.stage}
                      onChange={(e) => handleStageChange(deal.id, e.target.value as DealStage)}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                        deal.stage === 'new'
                          ? 'bg-slate-50 text-slate-700 border-slate-300'
                          : deal.stage === 'contacted'
                          ? 'bg-sky-50 text-sky-700 border-sky-300'
                          : deal.stage === 'quoted'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : deal.stage === 'won'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      <option value="new">Mới</option>
                      <option value="contacted">Đang tư vấn</option>
                      <option value="quoted">Đã báo giá</option>
                      <option value="won">Thành công</option>
                      <option value="lost">Hủy bỏ</option>
                    </select>
                  </td>

                  {/* CTV (NV role) */}
                  {role === 'nv' && (
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                      {getCtvName(deal.collaboratorId)}
                    </td>
                  )}

                  {/* Hành động: Lưu khách hàng, Sửa, Tạo booking */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => onSaveCustomer(deal)}
                        className="px-2.5 py-1 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors flex items-center gap-1 shadow-2xs"
                        title="Lưu vào danh bạ khách hàng"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Lưu KH</span>
                      </button>

                      <button
                        onClick={() => (onEditDeal ? onEditDeal(deal) : onSelectDeal(deal))}
                        className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors flex items-center gap-1 shadow-2xs"
                        title="Chỉnh sửa thông tin Deal"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>

                      <button
                        onClick={() => onConvertBooking(deal)}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors flex items-center gap-1 shadow-2xs"
                        title="Tạo Booking từ Deal này"
                      >
                        <PackagePlus className="w-3.5 h-3.5" />
                        <span>Tạo booking</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
