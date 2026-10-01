import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Settings, User, Bell, Shield, Save, CheckCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { role, activeCollaborator, addToast } = useLogistics();

  const [bankName, setBankName] = useState(activeCollaborator.bankName);
  const [bankAccount, setBankAccount] = useState(activeCollaborator.bankAccount);
  const [bankAccountName, setBankAccountName] = useState(activeCollaborator.bankAccountName);

  const [notifyZalo, setNotifyZalo] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Đã lưu cấu hình tài khoản & thông báo thành công!');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-sky-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              Thông Tin Tài Khoản {role === 'ctv' ? 'Cộng Tác Viên' : 'Quản Trị Viên'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Họ và tên</label>
              <input
                type="text"
                disabled
                value={role === 'ctv' ? activeCollaborator.name : 'Trần Điều Hành'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email đăng nhập</label>
              <input
                type="email"
                disabled
                value={role === 'ctv' ? activeCollaborator.email : 'admin@vngrow.com.vn'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Banking Info (for CTV payout) */}
        {role === 'ctv' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Tài Khoản Ngân Hàng Nhận Hoa Hồng (Đối Soát)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngân hàng</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số tài khoản</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên chủ tài khoản</label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              Tùy Chọn Nhận Thông Báo Đơn Hàng & Hoa Hồng
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyZalo}
                onChange={(e) => setNotifyZalo(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded"
              />
              <span className="font-semibold text-slate-700">
                Nhận thông báo tự động qua Zalo ZNS khi có cập nhật cân đo thực tế hoặc thanh toán hoa hồng
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded"
              />
              <span className="font-semibold text-slate-700">
                Gửi bảng kê đối soát hoa hồng định kỳ hàng tuần vào email
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            Lưu Thay Đổi
          </button>
        </div>
      </form>
    </div>
  );
};
