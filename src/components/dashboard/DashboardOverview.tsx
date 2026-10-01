import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import {
  Package,
  FileSpreadsheet,
  Wallet,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
  KanbanSquare,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Send,
  ShieldCheck,
  History,
} from 'lucide-react';

interface DashboardOverviewProps {
  onOpenCreateDeal?: () => void;
  onOpenCreateBooking?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenCreateDeal,
  onOpenCreateBooking,
}) => {
  const {
    role,
    activeCollaborator,
    visibleBookings,
    visibleDeals,
    visibleCustomers,
    visibleRfqs,
    collaborators,
    auditLogs,
    setActivePage,
  } = useLogistics();

  // Booking lifecycle counters
  const draftBookings = visibleBookings.filter((b) => b.status === 'draft');
  const sentBookings = visibleBookings.filter((b) => b.status === 'sent');
  const rejectBookings = visibleBookings.filter((b) => b.status === 'reject');
  const inTransitBookings = visibleBookings.filter(
    (b) =>
      b.status === 'booking_confirmed' ||
      b.status === 'awaiting_pickup' ||
      b.status === 'picked_up' ||
      b.status === 'measuring' ||
      b.status === 'ctv_confirmed' ||
      b.status === 'creating_bill' ||
      b.status === 'bill_created' ||
      b.status === 'shipping'
  );
  const deliveredBookings = visibleBookings.filter((b) => b.status === 'delivered');

  const ctvRfqsCount = visibleRfqs.filter((r) => r.status === 'reviewing' || r.status === 'sent').length;
  const ctvCommissionSum = activeCollaborator.totalCommission;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-700">
            {role === 'ctv' ? 'DASHBOARD CỘNG TÁC VIÊN' : 'TRUNG TÂM ĐIỀU HÀNH VNGROW EXPRESS'}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Xin chào, {role === 'ctv' ? activeCollaborator.name : 'Trần Điều Hành'}!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {role === 'ctv'
              ? `Mã đối tác: ${activeCollaborator.code} · ${activeCollaborator.phone}. Hiện có ${sentBookings.length} đơn đang chờ tiếp nhận và ${rejectBookings.length} đơn cần sửa lại.`
              : `Toàn hệ thống đang có ${sentBookings.length} đơn mới cần tiếp nhận, ${inTransitBookings.length} lô hàng đang luân chuyển.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActivePage('crm')}
            className="px-3.5 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors flex items-center gap-1.5 border border-sky-200"
          >
            <KanbanSquare className="w-4 h-4" />
            <span>Phễu CRM</span>
          </button>

          <button
            onClick={() => setActivePage('booking')}
            className="px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Package className="w-4 h-4" />
            <span>Quản Lý Booking</span>
          </button>
        </div>
      </div>

      {/* Critical Alert if there are rejected bookings */}
      {role === 'ctv' && rejectBookings.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-xs text-rose-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-extrabold text-rose-800">Cần xử lý:</span> Bạn có{' '}
              <strong className="font-mono">{rejectBookings.length} đơn booking bị từ chối</strong>{' '}
              do thiếu thông tin. Vui lòng bấm vào đơn để sửa và gửi lại!
            </div>
          </div>
          <button
            onClick={() => setActivePage('booking')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition-colors shrink-0 shadow-xs"
          >
            Xem và sửa ngay
          </button>
        </div>
      )}

      {/* Booking Status Metric Grid (Draft, Sent, Reject, Active, Delivered) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Draft */}
        <div
          onClick={() => setActivePage('booking')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-slate-400 transition-colors"
        >
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Bản Nháp (Draft)</span>
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 tabular-nums">
            {draftBookings.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Chưa gửi duyệt</div>
        </div>

        {/* Sent (Awaiting) */}
        <div
          onClick={() => setActivePage('booking')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-sky-300 transition-colors"
        >
          <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Đã Gửi (Sent)</span>
            <Send className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-sky-700 tabular-nums">
            {sentBookings.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {role === 'ctv' ? 'Chờ Vngrow tiếp nhận' : 'Cần nhân viên duyệt'}
          </div>
        </div>

        {/* Reject */}
        <div
          onClick={() => setActivePage('booking')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-rose-300 transition-colors"
        >
          <div className="text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Bị Từ Chối (Reject)</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 tabular-nums">
            {rejectBookings.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cần sửa và gửi lại</div>
        </div>

        {/* In Transit / Delivered */}
        <div
          onClick={() => setActivePage('booking')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-emerald-300 transition-colors"
        >
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Đã Giao / Vận Chuyển</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">
            {inTransitBookings.length + deliveredBookings.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Đang bay & hoàn tất</div>
        </div>
      </div>

      {/* Two Column Grid: Recent CRM Deals & Live Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent CRM Deals */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <KanbanSquare className="w-4 h-4 text-sky-600" />
              Cơ Hội / Deals Gần Đây Trong Phễu CRM
            </h3>
            <button
              onClick={() => setActivePage('crm')}
              className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {visibleDeals.slice(0, 4).map((deal) => (
              <div
                key={deal.id}
                onClick={() => setActivePage('crm')}
                className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-700">{deal.code}</span>
                    <span className="font-bold text-slate-900">{deal.customerName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{deal.route}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{deal.title}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-slate-900 tabular-nums">
                    {deal.estimatedValue.toLocaleString('vi-VN')} ₫
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 capitalize">
                    {deal.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Audit Trail Preview (Requested: Khi có thay đổi đều cập nhật lên Audit log và hiển thị ở Dashboard) */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-sky-600" />
              Nhật Ký Thao Tác Hệ Thống (Audit Log Trực Tuyến)
            </h3>
            <button
              onClick={() => setActivePage('audit')}
              className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
            >
              Xem toàn bộ <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                onClick={() => setActivePage('audit')}
                className="p-3 hover:bg-slate-50/80 transition-colors flex items-start gap-2.5 text-xs cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 border border-sky-100">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-0.5">
                    <span className="font-bold text-slate-700 truncate">{log.actor}</span>
                    <span className="tabular-nums font-mono shrink-0">{log.time}</span>
                  </div>
                  <div className="font-bold text-sky-800 truncate">{log.action}</div>
                  <div className="text-slate-600 text-[11px] truncate font-medium">{log.target}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
