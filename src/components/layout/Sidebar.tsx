import React from 'react';
import { useLogistics, PageId } from '../../context/LogisticsContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Award,
  Package,
  Truck,
  FileSpreadsheet,
  Wallet,
  Receipt,
  Tags,
  ClipboardList,
  Settings,
  Boxes,
} from 'lucide-react';

interface MenuItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  roles?: ('ctv' | 'nv')[];
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { role, activePage, setActivePage, visibleDeals, visibleRfqs, bookings } = useLogistics();
  const { t } = useLanguage();

  const newDealsCount = visibleDeals.filter((d) => d.stage === 'new').length;
  const pendingRfqsCount = visibleRfqs.filter((r) => r.status === 'reviewing' || r.status === 'sent').length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'sent' || b.status === 'measuring').length;

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: t('navDashboard'),
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'crm',
      label: t('navCrm'),
      icon: <KanbanSquare className="w-5 h-5" />,
      badge: newDealsCount > 0 ? newDealsCount : undefined,
    },
    {
      id: 'customers',
      label: t('navCustomers'),
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'collaborators',
      label: 'Hiệu suất CTV & KPI',
      icon: <Award className="w-5 h-5" />,
      roles: ['nv'],
    },
    {
      id: 'booking',
      label: t('navBookings'),
      icon: <Package className="w-5 h-5" />,
      badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined,
    },
    {
      id: 'waybill',
      label: t('navWaybills'),
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: 'rfq',
      label: t('navRfqs'),
      icon: <FileSpreadsheet className="w-5 h-5" />,
      badge: pendingRfqsCount > 0 ? pendingRfqsCount : undefined,
    },
    {
      id: 'commission',
      label: t('navCommission'),
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      id: 'invoice',
      label: 'Quản lý Invoice',
      icon: <Receipt className="w-5 h-5" />,
      roles: ['nv'],
    },
    {
      id: 'pricing',
      label: 'Cài đặt Bảng giá',
      icon: <Tags className="w-5 h-5" />,
      roles: ['nv'],
    },
    {
      id: 'audit',
      label: 'Yêu cầu & Audit Log',
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: t('navSettings'),
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-18 px-6 flex items-center gap-3 border-b border-slate-200">
        <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-sm shadow-sky-200">
          <Boxes className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <div className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
            <span className="text-sky-600">VN</span>GROW
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 ml-1">PORTAL</span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">Express & Freight CRM</span>
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {menuItems
          .filter((item) => !item.roles || item.roles.includes(role))
          .map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                  isActive
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-sky-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
      </div>

      {/* Footer Role Notice */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70">
        <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
          <span>Chế độ xem:</span>
          <span className="font-bold text-sky-700 uppercase">
            {role === 'ctv' ? 'Cộng Tác Viên' : 'Điều Hành / Admin'}
          </span>
        </div>
      </div>
    </aside>
  );
};
