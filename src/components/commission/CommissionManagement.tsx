import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import {
  Wallet,
  Download,
  CheckCircle,
  Clock,
  ArrowUpRight,
  CreditCard,
  Building,
} from 'lucide-react';

export const CommissionManagement: React.FC = () => {
  const {
    role,
    activeCollaborator,
    visibleCommissions,
    collaborators,
    approveCommissionPayment,
    payAllCtvCommission,
  } = useLogistics();

  // Metrics for CTV
  const ctvTotalCommission = visibleCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const ctvPendingCommission = visibleCommissions
    .filter((c) => c.status === 'pending_audit')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  const ctvPaidCommission = visibleCommissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  // Metrics for NV
  const nvTotalSystemCommission = collaborators.reduce((sum, c) => sum + c.totalCommission, 0);
  const nvTotalPendingCommission = collaborators.reduce((sum, c) => sum + c.pendingCommission, 0);
  const nvTotalPaidCommission = collaborators.reduce((sum, c) => sum + c.paidCommission, 0);

  const exportExcel = () => {
    const headers = 'Mã Booking,Ngày,Khách hàng,Lộ trình,CW (kg),Đã cân đo,Giá bán khách,Hoa hồng CTV,Trạng thái\n';
    const rows = visibleCommissions
      .map(
        (c) =>
          `"${c.bookingCode}","${c.date}","${c.customerName}","${c.route}",${c.cw},"${c.isMeasured ? 'Có' : 'Không'}",${c.salePrice},${c.commissionAmount},"${c.status === 'paid' ? 'Đã thanh toán' : 'Chờ đối soát'}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vngrow_Commission_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* ================= CTV VIEW ================= */}
      {role === 'ctv' && (
        <>
          {/* CTV Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Tổng Hoa Hồng Lũy Kế
              </div>
              <div className="text-2xl font-extrabold text-sky-700 font-mono tabular-nums">
                {ctvTotalCommission.toLocaleString('vi-VN')}{' '}
                <span className="text-sm font-sans font-normal text-slate-500">₫</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Từ tất cả các đơn hàng</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                Chưa Đối Soát (Tạm Tính)
              </div>
              <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
                {ctvPendingCommission.toLocaleString('vi-VN')}{' '}
                <span className="text-sm font-sans font-normal text-slate-500">₫</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Đang chờ kế toán xác nhận</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                Đã Thanh Toán Thành Công
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
                {ctvPaidCommission.toLocaleString('vi-VN')}{' '}
                <span className="text-sm font-sans font-normal text-slate-500">₫</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Đã giải ngân qua tài khoản ngân hàng</div>
            </div>
          </div>

          {/* CTV Commission Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-sm text-slate-900">
                Chi Tiết Bảng Kê Từng Lô Hàng Của CTV
              </h3>
              <button
                onClick={exportExcel}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" /> Xuất Báo Cáo Excel
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Mã Booking / Ngày</th>
                    <th className="py-3 px-4">Khách hàng & Tuyến</th>
                    <th className="py-3 px-4">Trọng lượng (CW)</th>
                    <th className="py-3 px-4 text-right">Cước thu khách</th>
                    <th className="py-3 px-4 text-right">Hoa hồng thực nhận</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleCommissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Chưa có dữ liệu hoa hồng.
                      </td>
                    </tr>
                  ) : (
                    visibleCommissions.map((comm) => (
                      <tr key={comm.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-sky-700">
                          {comm.bookingCode}
                          <div className="text-[11px] text-slate-400 font-sans font-normal">
                            {comm.date}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800 text-xs">{comm.customerName}</div>
                          <div className="text-[11px] text-slate-500 font-semibold">{comm.route}</div>
                        </td>

                        <td className="py-3.5 px-4 text-xs font-bold tabular-nums">
                          {comm.cw} kg
                          {comm.isMeasured && (
                            <span className="text-[10px] text-emerald-600 block font-normal">
                              (Đã đo thực tế)
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {comm.salePrice.toLocaleString('vi-VN')} ₫
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-600 tabular-nums">
                          +{comm.commissionAmount.toLocaleString('vi-VN')} ₫
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {comm.status === 'paid' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Đã thanh toán
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Chờ đối soát
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ================= NV / ADMIN AUDIT VIEW ================= */}
      {role === 'nv' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Tổng Hoa Hồng Toàn Mạng Lưới CTV
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {nvTotalSystemCommission.toLocaleString('vi-VN')}{' '}
                <span className="text-sm font-sans font-normal text-slate-500">₫</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Lũy kế các đơn hàng chốt</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                Hoa Hồng Cần Duyệt Chi
              </div>
              <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
                {nvTotalPendingCommission.toLocaleString('vi-VN')}{' '}
                <span className="text-sm font-sans font-normal text-slate-500">₫</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Chờ kế toán xác nhận ủy nhiệm chi</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                Đã Giải Ngân Cho CTV
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
                {nvTotalPaidCommission.toLocaleString('vi-VN')}{' '}
                <span className="text-sm font-sans font-normal text-slate-500">₫</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Đã chuyển khoản thành công</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Duyệt Chi Trả Hoa Hồng Cho Từng Cộng Tác Viên
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Xác nhận ủy nhiệm chi cho tài khoản ngân hàng của CTV
                </p>
              </div>
              <button
                onClick={exportExcel}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" /> Tải Báo Cáo Kế Toán
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Cộng Tác Viên</th>
                    <th className="py-3 px-4 text-right">Tổng Hoa Hồng (Tháng)</th>
                    <th className="py-3 px-4 text-right">Số tiền chưa thanh toán</th>
                    <th className="py-3 px-4">Thông tin chuyển khoản ngân hàng</th>
                    <th className="py-3 px-4 text-center">Hành động Phê duyệt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {collaborators.map((ctv) => (
                    <tr key={ctv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{ctv.name}</div>
                        <div className="text-xs text-slate-500">
                          {ctv.code} · Hạng {ctv.tier.toUpperCase()} ({ctv.commissionRate}%)
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {ctv.totalCommission.toLocaleString('vi-VN')} ₫
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        {ctv.pendingCommission > 0 ? (
                          <span className="font-extrabold text-amber-600">
                            {ctv.pendingCommission.toLocaleString('vi-VN')} ₫
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">0 ₫</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-mono font-bold text-slate-800">
                          {ctv.bankAccount} - {ctv.bankName}
                        </div>
                        <div className="text-slate-500 font-semibold">{ctv.bankAccountName}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {ctv.pendingCommission > 0 ? (
                          <button
                            onClick={() => payAllCtvCommission(ctv.id)}
                            className="px-3 py-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors shadow-2xs"
                          >
                            Duyệt chi ({(ctv.pendingCommission / 1000000).toFixed(1)}M)
                          </button>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Đã thanh toán đủ
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
