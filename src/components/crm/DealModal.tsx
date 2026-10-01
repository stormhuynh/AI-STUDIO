import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { CustomerSelectCombobox } from '../common/CustomerSelectCombobox';
import { CountryCombobox } from '../common/CountryCombobox';
import { Customer } from '../../types';
import { X, Plus } from 'lucide-react';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DealModal: React.FC<DealModalProps> = ({ isOpen, onClose }) => {
  const { addDeal, activeCollaborator, role, collaborators } = useLogistics();

  const [title, setTitle] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [originCountry, setOriginCountry] = useState('Việt Nam (VN)');
  const [destCountry, setDestCountry] = useState('Hoa Kỳ (US)');
  const [cargoType, setCargoType] = useState('');
  const [estimatedWeight, setEstimatedWeight] = useState<number>(10);
  const [estimatedValue, setEstimatedValue] = useState<number>(4000000);
  const [notes, setNotes] = useState('');
  const [selectedCtv, setSelectedCtv] = useState<string>(activeCollaborator.id);

  if (!isOpen) return null;

  const handleSelectCustomer = (cust: Customer) => {
    setCustomerName(cust.name);
    setCustomerPhone(cust.phone);
    if (cust.email) setCustomerEmail(cust.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !customerName || !customerPhone) {
      alert('Vui lòng nhập đầy đủ tiêu đề deal, tên khách hàng và số điện thoại!');
      return;
    }

    const routeStr = `${originCountry.split('(')[0].trim()} -> ${destCountry.split('(')[0].trim()}`;

    addDeal({
      title,
      customerName,
      customerPhone,
      customerEmail,
      collaboratorId: role === 'ctv' ? activeCollaborator.id : selectedCtv,
      source: 'Direct',
      stage: 'new',
      route: routeStr,
      cargoType: cargoType || 'Hàng tổng hợp',
      estimatedWeight: Number(estimatedWeight) || 1,
      estimatedValue: Number(estimatedValue) || 1000000,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tạo Deal</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Quick select existing customer */}
          <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100">
            <CustomerSelectCombobox
              onSelectCustomer={handleSelectCustomer}
              placeholder="Chọn khách hàng từ danh bạ (Tên, SĐT, Mã KH)..."
            />
          </div>

          {/* Deal Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Tiêu đề Deal *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Gửi 15kg mỹ phẩm & quần áo sang Sydney (Úc)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs font-medium"
            />
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">
                Tên khách hàng / Người liên hệ *
              </label>
              <input
                type="text"
                required
                placeholder="VD: Nguyễn Văn B"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs font-semibold"
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
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Email khách hàng (nếu có)
            </label>
            <input
              type="email"
              placeholder="VD: b.nguyen@email.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs"
            />
          </div>

          {/* Tách Tuyến Vận Chuyển: Quốc gia gửi & Quốc gia nhận dạng Combobox */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CountryCombobox
              label="Quốc gia gửi (Origin)"
              required
              value={originCountry}
              onChange={setOriginCountry}
            />
            <CountryCombobox
              label="Quốc gia nhận (Destination)"
              required
              value={destCountry}
              onChange={setDestCountry}
            />
          </div>

          {/* Weight & Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">
                Trọng lượng dự kiến (kg)
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={estimatedWeight}
                onChange={(e) => setEstimatedWeight(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs font-bold text-sky-700 tabular-nums"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">
                Giá trị deal ước tính (VND)
              </label>
              <input
                type="number"
                step="50000"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs tabular-nums font-bold text-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Mô tả loại hàng & Đặc thù đóng gói
            </label>
            <input
              type="text"
              placeholder="VD: Quần áo, Khăn tắm, Thực phẩm khô có nhãn, Hàng dễ vỡ..."
              value={cargoType}
              onChange={(e) => setCargoType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs"
            />
          </div>

          {/* CTV assignment for NV role */}
          {role === 'nv' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">
                Phân công Cộng Tác Viên phụ trách
              </label>
              <select
                aria-label="Phân công Cộng Tác Viên phụ trách"
                value={selectedCtv}
                onChange={(e) => setSelectedCtv(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs font-semibold"
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
              Ghi chú thêm về yêu cầu khách hàng
            </label>
            <textarea
              rows={2}
              placeholder="Ghi chú thời gian khách cần gửi, yêu cầu pick-up tận nhà..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs"
            />
          </div>

          {/* Footer Controls: Nút "+ Tạo Deal" */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Deal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
