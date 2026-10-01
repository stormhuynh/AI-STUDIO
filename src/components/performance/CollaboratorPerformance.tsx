import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Collaborator, CollaboratorTier } from '../../types';
import {
  Award,
  TrendingUp,
  Users,
  Wallet,
  CheckCircle,
  Building,
  CreditCard,
  Target,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  DollarSign,
  Package,
} from 'lucide-react';

export const CollaboratorPerformance: React.FC = () => {
  const {
    role,
    collaborators,
    activeCollaborator,
    customers,
    bookings,
    payAllCtvCommission,
    setActivePage,
    setSelectedCtvFilter,
  } = useLogistics();

  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');

  const filteredCtvs = collaborators.filter((c) => {
    return selectedTierFilter === 'all' || c.tier === selectedTierFilter;
  });

  // Systemwide Metrics
  const totalCollaborators = collaborators.length;
  const totalSystemRevenue = collaborators.reduce((sum, c) => sum + c.totalRevenue, 0);
  const totalPendingCommissions = collaborators.reduce((sum, c) => sum + c.pendingCommission, 0);
  const avgWinRate = Math.round(
    collaborators.reduce((sum, c) => sum + c.winRate, 0) / (collaborators.length || 1)
  );

  const getTierBadge = (tier: CollaboratorTier) => {
    switch (tier) {
      case 'diamond':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1 w-max">
            <Award className="w-3 h-3 text-purple-600" />
            KIM CƯƠNG (10%)
          </span>
        );
      case 'gold':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-max">
            <Award className="w-3 h-3 text-amber-600" />
            VÀNG (7%)
          </span>
        );
      case 'silver':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1 w-max">
            <Award className="w-3 h-3 text-slate-500" />
            BẠC (5%)
          </span>
        );
    }
  };

  const handleAuditPayout = (ctv: Collaborator) => {
    if (ctv.pendingCommission <= 0) {
      alert(`CTV ${ctv.name} đã được thanh toán đầy đủ, không còn số dư chờ chi.`);
      return;
    }
    const confirmPay = window.confirm(
      `Xác nhận phê duyệt chi trả ${ctv.pendingCommission.toLocaleString('vi-VN')} VND hoa hồng cho CTV ${ctv.name} (${ctv.bankName} - ${ctv.bankAccount})?`
    );
    if (confirmPay) {
      payAllCtvCommission(ctv.id);
    }
  };

  const handleViewCtvCustomers = (ctvId: string) => {
    setSelectedCtvFilter(ctvId);
    setActivePage('customers');
  };

  return (
    <div className="space-y-6">
      {/* ================= IF IN CTV ROLE: PERSONAL PERFORMANCE DASHBOARD ================= */}
      {role === 'ctv' && (
        <div className="bg-gradient-to-r from-sky-800 to-sky-950 rounded-2xl p-6 text-white shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-extrabold text-2xl text-white">
                {activeCollaborator.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold">{activeCollaborator.name}</h2>
                  <span className="text-xs bg-amber-400 text-amber-950 font-extrabold px-2 py-0.5 rounded uppercase">
                    Hạng {activeCollaborator.tier} ({activeCollaborator.commissionRate}% hoa hồng)
                  </span>
                </div>
                <p className="text-xs text-sky-200 mt-1">
                  Mã đối tác: {activeCollaborator.code} · {activeCollaborator.phone} · {activeCollaborator.email}
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-xs text-right">
              <div className="text-sky-200">Tài khoản thanh toán:</div>
              <div className="font-bold text-white mt-0.5">
                {activeCollaborator.bankName} - {activeCollaborator.bankAccount}
              </div>
              <div className="text-[11px] text-sky-300">{activeCollaborator.bankAccountName}</div>
            </div>
          </div>

          {/* CTV Metric Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-white/10">
            <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
              <div className="text-xs text-sky-200 font-medium">Doanh Số Mang Lại</div>
              <div className="text-xl font-extrabold font-mono mt-1 tabular-nums">
                {activeCollaborator.totalRevenue.toLocaleString('vi-VN')} ₫
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
              <div className="text-xs text-sky-200 font-medium">Lô Hàng Đã Gửi</div>
              <div className="text-xl font-extrabold mt-1 tabular-nums">
                {activeCollaborator.totalBookings} đơn
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
              <div className="text-xs text-sky-200 font-medium">Tỷ Lệ Chốt Deal</div>
              <div className="text-xl font-extrabold mt-1 tabular-nums text-emerald-300">
                {activeCollaborator.winRate}%
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
              <div className="text-xs text-sky-200 font-medium">Hoa Hồng Chờ Đối Soát</div>
              <div className="text-xl font-extrabold font-mono mt-1 text-amber-300 tabular-nums">
                {activeCollaborator.pendingCommission.toLocaleString('vi-VN')} ₫
              </div>
            </div>
          </div>

          {/* Level progression bar */}
          <div className="bg-white/10 rounded-xl p-4 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-sky-200">
                <Target className="w-4 h-4 text-amber-400" />
                Tiến độ thăng hạng cấp bậc tiếp theo (Hạng Vàng 7%):
              </span>
              <span className="font-bold text-white tabular-nums">145M / 200M VND (72.5%)</span>
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: '72.5%' }}></div>
            </div>
            <div className="text-[11px] text-sky-300 flex justify-between">
              <span>Hạng Bạc (5%)</span>
              <span>Đạt thêm 55,000,000 ₫ để nâng mức hoa hồng lên 7%!</span>
              <span>Hạng Vàng (7%)</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= PERFORMANCE OVERVIEW CARDS (FOR ALL) ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Tổng CTV Hoạt Động</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{totalCollaborators}</div>
          <div className="text-xs text-slate-400 mt-1">Đội ngũ bán hàng tự do</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Tổng Doanh Số Kênh CTV</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl font-extrabold text-sky-700 font-mono tabular-nums">
            {totalSystemRevenue.toLocaleString('vi-VN')} ₫
          </div>
          <div className="text-xs text-slate-400 mt-1">Doanh thu cước phát sinh</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Tỷ Lệ Chốt Deal (TB)</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">{avgWinRate}%</div>
          <div className="text-xs text-slate-400 mt-1">Hiệu quả chuyển đổi phễu</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Hoa Hồng Chờ Duyệt Chi</span>
            <Wallet className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-600 font-mono tabular-nums">
            {totalPendingCommissions.toLocaleString('vi-VN')} ₫
          </div>
          <div className="text-xs text-slate-400 mt-1">Chờ kế toán xác nhận</div>
        </div>
      </div>

      {/* ================= LEADERBOARD & PERFORMANCE TABLE ================= */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Bảng Xếp Hạng & Đánh Giá Hiệu Suất Cộng Tác Viên
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo dõi chi tiết doanh số, số đơn hàng chốt, cấp bậc và phê duyệt thanh toán đối soát
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Cấp bậc:</span>
            <select
              aria-label="Lọc theo cấp bậc CTV"
              value={selectedTierFilter}
              onChange={(e) => setSelectedTierFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">Tất cả cấp bậc</option>
              <option value="diamond">Kim Cương (10%)</option>
              <option value="gold">Vàng (7%)</option>
              <option value="silver">Bạc (5%)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Cộng Tác Viên</th>
                <th className="py-3 px-4">Cấp bậc</th>
                <th className="py-3 px-4 text-center">Khách quản lý</th>
                <th className="py-3 px-4 text-center">Booking hoàn thành</th>
                <th className="py-3 px-4 text-right">Tổng doanh số</th>
                <th className="py-3 px-4">Tỷ lệ chốt</th>
                <th className="py-3 px-4 text-right">Hoa hồng tích lũy</th>
                <th className="py-3 px-4 text-right">Chưa thanh toán</th>
                {role === 'nv' && <th className="py-3 px-4 text-center">Hành động Kế toán</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCtvs.map((ctv, idx) => (
                <tr key={ctv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {ctv.name}
                          <span className="text-[11px] font-mono text-slate-400">({ctv.code})</span>
                        </div>
                        <div className="text-xs text-slate-500 tabular-nums">{ctv.phone}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">{getTierBadge(ctv.tier)}</td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleViewCtvCustomers(ctv.id)}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 hover:underline tabular-nums"
                      title="Xem danh sách khách hàng của CTV này"
                    >
                      {ctv.activeCustomers} khách
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold tabular-nums text-slate-800">
                    {ctv.totalBookings} đơn
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {ctv.totalRevenue.toLocaleString('vi-VN')} ₫
                  </td>

                  <td className="py-3.5 px-4 min-w-[120px]">
                    <div className="flex items-center justify-between text-xs mb-1 font-bold">
                      <span className="text-emerald-700">{ctv.winRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${ctv.winRate}%` }}
                      ></div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                    {ctv.totalCommission.toLocaleString('vi-VN')} ₫
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    {ctv.pendingCommission > 0 ? (
                      <span className="font-extrabold text-amber-600">
                        {ctv.pendingCommission.toLocaleString('vi-VN')} ₫
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Đã thanh toán đủ</span>
                    )}
                  </td>

                  {role === 'nv' && (
                    <td className="py-3.5 px-4 text-center">
                      {ctv.pendingCommission > 0 ? (
                        <button
                          onClick={() => handleAuditPayout(ctv)}
                          className="px-2.5 py-1 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors shadow-2xs"
                          title={`Duyệt chi ${ctv.pendingCommission.toLocaleString()} VND qua ${ctv.bankName}`}
                        >
                          Duyệt chi ({Math.round(ctv.pendingCommission / 1000000 * 10) / 10}M)
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Hoàn tất
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
