import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { X, UserPlus, Building, Phone, Mail, MapPin, FileText } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose }) => {
  const { addCustomer, activeCollaborator, role, collaborators } = useLogistics();

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<'b2b' | 'individual'>('b2b');
  const [notes, setNotes] = useState('');
  const [selectedCtv, setSelectedCtv] = useState<string>(activeCollaborator.id);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Vui lòng nhập họ tên khách hàng và số điện thoại liên hệ!');
      return;
    }

    addCustomer({
      name,
      companyName: companyName || (type === 'b2b' ? 'Công ty TNHH' : 'Cá nhân'),
      taxCode,
      email,
      phone,
      address: address || 'Việt Nam',
      country: 'Việt Nam',
      collaboratorId: role === 'ctv' ? activeCollaborator.id : selectedCtv,
      type,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Thêm Khách Hàng Mới</h2>
            <p className="text-xs text-slate-500">Lưu thông tin khách hàng vào danh bạ và liên kết với CTV phụ trách</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* Customer Type */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 text-xs">
              Phân loại khách hàng
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  type === 'b2b'
                    ? 'border-sky-500 bg-sky-50/50 text-sky-900 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="custType"
                  className="hidden"
                  checked={type === 'b2b'}
                  onChange={() => setType('b2b')}
                />
                <Building className="w-4 h-4 text-sky-600" />
                <span className="text-xs">Doanh nghiệp / Tổ chức (B2B)</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  type === 'individual'
                    ? 'border-sky-500 bg-sky-50/50 text-sky-900 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="custType"
                  className="hidden"
                  checked={type === 'individual'}
                  onChange={() => setType('individual')}
                />
                <UserPlus className="w-4 h-4 text-sky-600" />
                <span className="text-xs">Khách hàng Cá nhân</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">
                Tên công ty / Đơn vị {type === 'b2b' && '*'}
              </label>
              <input
                type="text"
                placeholder={type === 'b2b' ? 'VD: Công ty TNHH VinaTech' : 'Cá nhân'}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">
                Mã số thuế (MST)
              </label>
              <input
                type="text"
                placeholder="VD: 0102030405"
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">
                Họ và tên người đại diện / Người gửi *
              </label>
              <input
                type="text"
                required
                placeholder="VD: Nguyễn Văn B"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">
                Số điện thoại liên hệ *
              </label>
              <input
                type="text"
                required
                placeholder="VD: 0988 123 456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Địa chỉ Email
            </label>
            <input
              type="email"
              placeholder="VD: contact@vinatech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Địa chỉ lấy hàng / Giao dịch thường xuyên
            </label>
            <input
              type="text"
              placeholder="VD: 123 Đường Nguyễn Trãi, Phường 2, Quận 5, TP.HCM"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
            />
          </div>

          {/* CTV Assignment if in NV role */}
          {role === 'nv' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">
                Cộng Tác Viên trực tiếp quản lý khách này
              </label>
              <select
                aria-label="Cộng tác viên quản lý khách hàng"
                value={selectedCtv}
                onChange={(e) => setSelectedCtv(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm font-semibold"
              >
                {collaborators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name} ({c.tier.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Ghi chú đặc thù hàng hóa & Yêu cầu vận chuyển
            </label>
            <textarea
              rows={2}
              placeholder="VD: Hàng xuất khẩu may mặc, hay gửi đi Mỹ và Canada, yêu cầu đóng thùng 5 lớp..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              Lưu Khách Hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
