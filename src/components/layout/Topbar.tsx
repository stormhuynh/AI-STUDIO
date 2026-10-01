import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, Bell, ChevronDown, Plus, Sparkles, Globe } from 'lucide-react';

interface TopbarProps {
  onOpenCreateDeal?: () => void;
  onOpenCreateBooking?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenCreateDeal, onOpenCreateBooking }) => {
  const {
    role,
    setRole,
    activeCollaborator,
    setActiveCollaborator,
    collaborators,
    activePage,
  } = useLogistics();

  const { language, setLanguage, t } = useLanguage();

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return t('titleDashboard');
      case 'crm':
        return t('titleCrm');
      case 'customers':
        return t('titleCustomers');
      case 'collaborators':
        return role === 'ctv' ? 'Cấp bậc & Bảng thành tích CTV' : 'Theo dõi Hiệu suất & KPI Cộng Tác Viên';
      case 'booking':
        return t('titleBookings');
      case 'waybill':
        return t('titleWaybills');
      case 'rfq':
        return t('titleRfqs');
      case 'commission':
        return 'Bảng kê Đối soát & Hoa hồng CTV';
      case 'invoice':
        return 'Quản lý Phiếu thu & Hóa đơn (Invoices)';
      case 'pricing':
        return 'Cài đặt Bảng giá & Dịch vụ Vngrow';
      case 'audit':
        return 'Nhật ký Thao tác & Kiểm toán (Audit Log)';
      case 'settings':
        return 'Cài đặt Tài khoản & Hệ thống';
      default:
        return 'Vngrow Express Portal';
    }
  };

  return (
    <header className="h-18 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-10 shrink-0">
      {/* Left: Page Title & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">{getPageTitle()}</h1>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
            <span>Vngrow Express</span>
            <span>/</span>
            <span className="capitalize">{activePage}</span>
            {role === 'ctv' && (
              <>
                <span>/</span>
                <span className="text-sky-700 font-semibold">{activeCollaborator.name}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-bold">
                  {activeCollaborator.code}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Controls: Role Switcher & User Profile */}
      <div className="flex items-center gap-3">
        {/* Language Switcher VN / EN */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setLanguage('vi')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
              language === 'vi'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Chuyển sang Tiếng Việt"
          >
            <span>🇻🇳</span>
            <span>VN</span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
              language === 'en'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Switch to English"
          >
            <span>🇬🇧</span>
            <span>EN</span>
          </button>
        </div>

        {/* Role Switcher */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setRole('ctv')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              role === 'ctv'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('roleCtv')}
          </button>
          <button
            onClick={() => setRole('nv')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              role === 'nv'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('roleNv')}
          </button>
        </div>

        {/* CTV Selector (when in CTV role, allows testing with different CTV profiles) */}
        {role === 'ctv' && (
          <div className="relative group">
            <select
              aria-label="Chọn tài khoản Cộng tác viên để thử nghiệm"
              value={activeCollaborator.id}
              onChange={(e) => {
                const found = collaborators.find((c) => c.id === e.target.value);
                if (found) setActiveCollaborator(found);
              }}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              {collaborators.map((c) => (
                <option key={c.id} value={c.id}>
                  CTV: {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Notification Bell */}
        <button
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Thông báo hệ thống"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500"></span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="text-right">
            <div className="text-sm font-bold text-slate-900">
              {role === 'ctv' ? activeCollaborator.name : 'Trần Điều Hành'}
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              {role === 'ctv' ? 'Cộng Tác Viên Vngrow' : 'Quản Trị / Điều Hành'}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {role === 'ctv' ? activeCollaborator.name.charAt(0) : 'NV'}
          </div>
        </div>
      </div>
    </header>
  );
};
