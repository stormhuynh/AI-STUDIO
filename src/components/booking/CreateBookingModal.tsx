import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { CustomerSelectCombobox } from '../common/CustomerSelectCombobox';
import { CountryCombobox } from '../common/CountryCombobox';
import { Customer, BookingPackage, BookingPackageItem } from '../../types';
import {
  X,
  Plus,
  Trash2,
  MapPin,
  AlertTriangle,
  Package,
  Boxes,
  DollarSign,
  CheckCircle,
} from 'lucide-react';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBookingModal: React.FC<CreateBookingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addBooking, activeCollaborator, customers, role, collaborators } = useLogistics();

  // Sender State
  const [senderCustCode, setSenderCustCode] = useState('');
  const [senderName, setSenderName] = useState('Nguyễn Thị B');
  const [senderCompany, setSenderCompany] = useState('Công ty TNHH VinaTech');
  const [senderPhone, setSenderPhone] = useState('0988 123 456');
  const [senderEmail, setSenderEmail] = useState('b.nguyen@vinatech.com');
  const [senderCountry, setSenderCountry] = useState('Việt Nam (VN)');
  const [senderAddress, setSenderAddress] = useState('123 Đường Nguyễn Trãi, Q5, TP.HCM');
  const [senderOdaAlert, setSenderOdaAlert] = useState(false);

  // Receiver State
  const [receiverCustCode, setReceiverCustCode] = useState('');
  const [receiverName, setReceiverName] = useState('John Doe');
  const [receiverCompany, setReceiverCompany] = useState('Apex International');
  const [receiverPhone, setReceiverPhone] = useState('+1 202 555 0123');
  const [receiverEmail, setReceiverEmail] = useState('johndoe@apex.com');
  const [receiverCountry, setReceiverCountry] = useState('Hoa Kỳ (US)');
  const [receiverAddress, setReceiverAddress] = useState('742 Evergreen Terrace, Springfield, OR 97477');
  const [receiverOdaAlert, setReceiverOdaAlert] = useState(false);

  // Service & Delivery
  const [service, setService] = useState('Vngrow đề xuất (Tối ưu nhất)');
  const [pickupMethod, setPickupMethod] = useState('Lấy tận nơi (Pick-up)');
  const [description, setDescription] = useState('Đồ dùng cá nhân & Mẫu thời trang (Personal Effects)');

  // Selected CTV for NV role
  const [selectedCtv, setSelectedCtv] = useState<string>(activeCollaborator.id);

  // Packages list
  const [packages, setPackages] = useState<BookingPackage[]>([
    {
      id: 'pkg-1',
      length: 60,
      width: 50,
      height: 40,
      gw: 22,
      items: [
        {
          id: 'item-1',
          name: 'Quần kaki cho nam',
          hsCode: '620342',
          unitPrice: 15,
          currency: 'USD',
          unit: 'cái',
          quantity: 10,
          totalAmount: 150,
        },
        {
          id: 'item-2',
          name: 'Áo sơ mi nam',
          hsCode: '620520',
          unitPrice: 10,
          currency: 'USD',
          unit: 'cái',
          quantity: 10,
          totalAmount: 100,
        },
      ],
    },
    {
      id: 'pkg-2',
      length: 50,
      width: 40,
      height: 30,
      gw: 12,
      items: [
        {
          id: 'item-3',
          name: 'Khăn tắm bằng cotton',
          hsCode: '630260',
          unitPrice: 20,
          currency: 'USD',
          unit: 'cái',
          quantity: 5,
          totalAmount: 100,
        },
        {
          id: 'item-4',
          name: 'Giày nam bằng da',
          hsCode: '640359',
          unitPrice: 150,
          currency: 'USD',
          unit: 'đôi',
          quantity: 3,
          totalAmount: 450,
        },
      ],
    },
  ]);

  if (!isOpen) return null;

  // Calculation logic
  const totalGw = packages.reduce((sum, p) => sum + (Number(p.gw) || 0), 0);
  const totalVw = packages.reduce(
    (sum, p) => sum + ((p.length * p.width * p.height) / 5000),
    0
  );
  const roundedVw = Math.round(totalVw * 10) / 10;
  const totalCw = Math.max(totalGw, roundedVw);

  const totalDeclaredUsd = packages.reduce(
    (sum, p) => sum + p.items.reduce((iSum, item) => iSum + item.totalAmount, 0),
    0
  );

  const estimatedPriceVnd = Math.round(totalCw * 280000);
  const estimatedCostVnd = Math.round(totalCw * 210000);
  const ctvRate = role === 'ctv' ? activeCollaborator.commissionRate : 5;
  const estimatedCommissionVnd = Math.round(estimatedPriceVnd * (ctvRate / 100));

  const handleAutofillSender = (code: string) => {
    setSenderCustCode(code);
    const found = customers.find((c) => c.code.toLowerCase() === code.toLowerCase());
    if (found) {
      setSenderName(found.name);
      setSenderCompany(found.companyName);
      setSenderPhone(found.phone);
      setSenderEmail(found.email);
      setSenderAddress(found.address);
    }
  };

  const handleAddPackage = () => {
    setPackages((prev) => [
      ...prev,
      {
        id: 'pkg-' + Date.now(),
        length: 40,
        width: 30,
        height: 25,
        gw: 5,
        items: [
          {
            id: 'item-' + Date.now(),
            name: 'Mặt hàng mới',
            unitPrice: 10,
            currency: 'USD',
            unit: 'cái',
            quantity: 1,
            totalAmount: 10,
          },
        ],
      },
    ]);
  };

  const handleRemovePackage = (pkgId: string) => {
    if (packages.length <= 1) {
      alert('Đơn booking phải có ít nhất 1 kiện hàng!');
      return;
    }
    setPackages((prev) => prev.filter((p) => p.id !== pkgId));
  };

  const handleAddItem = (pkgId: string) => {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === pkgId
          ? {
              ...pkg,
              items: [
                ...pkg.items,
                {
                  id: 'item-' + Date.now(),
                  name: '',
                  unitPrice: 10,
                  currency: 'USD',
                  unit: 'cái',
                  quantity: 1,
                  totalAmount: 10,
                },
              ],
            }
          : pkg
      )
    );
  };

  const handleUpdateItem = (
    pkgId: string,
    itemId: string,
    field: keyof BookingPackageItem,
    val: any
  ) => {
    setPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.id !== pkgId) return pkg;
        const newItems = pkg.items.map((item) => {
          if (item.id !== itemId) return item;
          const updated = { ...item, [field]: val };
          if (field === 'unitPrice' || field === 'quantity') {
            updated.totalAmount = (Number(updated.unitPrice) || 0) * (Number(updated.quantity) || 0);
          }
          return updated;
        });
        return { ...pkg, items: newItems };
      })
    );
  };

  const handleCreate = (statusToSet: 'draft' | 'sent') => {
    if (!senderName || !senderPhone || !receiverName || !receiverPhone) {
      alert('Vui lòng điền đủ thông tin người gửi và người nhận!');
      return;
    }

    addBooking({
      senderName,
      senderPhone,
      senderCompany,
      senderEmail,
      senderAddress,
      senderCountry,
      receiverName,
      receiverPhone,
      receiverCompany,
      receiverEmail,
      receiverAddress,
      receiverCountry,
      service,
      pickupMethod,
      description,
      packages,
      totalGw,
      totalVw: roundedVw,
      totalCw,
      declaredValue: totalDeclaredUsd,
      actualMeasured: false,
      price: estimatedPriceVnd,
      cost: estimatedCostVnd,
      commission: estimatedCommissionVnd,
      collaboratorId: role === 'ctv' ? activeCollaborator.id : selectedCtv,
      status: statusToSet,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tạo Booking</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={(e) => { e.preventDefault(); handleCreate('sent'); }} className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Section 1: Sender */}
          <div className="space-y-3">
            <div className="border-b border-sky-100 pb-2 space-y-2">
              <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wide">
                1. Người gửi
              </h3>
              <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100">
                <CustomerSelectCombobox
                  onSelectCustomer={(cust) => {
                    setSenderCustCode(cust.code);
                    setSenderName(cust.name);
                    setSenderPhone(cust.phone);
                    if (cust.email) setSenderEmail(cust.email);
                    if (cust.companyName) setSenderCompany(cust.companyName);
                    if (cust.address) setSenderAddress(cust.address);
                    if (cust.country) setSenderCountry(cust.country);
                  }}
                  selectedCustomerCode={senderCustCode}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Công ty (nếu có)</label>
                <input
                  type="text"
                  value={senderCompany}
                  onChange={(e) => setSenderCompany(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="text"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ chi tiết người gửi
                </label>
                <input
                  type="text"
                  value={senderAddress}
                  onChange={(e) => setSenderAddress(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Receiver */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-sky-100 pb-2">
              <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wide">
                2. Người nhận
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên người nhận *</label>
                <input
                  type="text"
                  required
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Công ty / Cơ quan</label>
                <input
                  type="text"
                  value={receiverCompany}
                  onChange={(e) => setReceiverCompany(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mã vùng + Số ĐT nhận *</label>
                <input
                  type="text"
                  required
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <CountryCombobox
                label="Quốc gia nhận"
                required
                value={receiverCountry}
                onChange={setReceiverCountry}
              />
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Địa chỉ nhận hàng chi tiết + ZIP Code</span>
                  <button
                    type="button"
                    onClick={() => {
                      setReceiverOdaAlert(!receiverOdaAlert);
                      alert(
                        receiverOdaAlert
                          ? 'Mã ZIP thông thường, không phát sinh ODA.'
                          : 'Hệ thống kiểm tra tự động: ZIP Code 97477 Oregon thuộc vùng ODA DHL/FedEx (+15% cước).'
                      );
                    }}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border transition-colors ${
                      receiverOdaAlert
                        ? 'border-amber-400 bg-amber-50 text-amber-800'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {receiverOdaAlert ? 'Phát sinh phụ phí ODA' : 'Kiểm tra ODA'}
                  </button>
                </label>
                <input
                  type="text"
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Service */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wide border-b border-sky-100 pb-2">
              3. Dịch vụ vận chuyển
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hãng vận chuyển</label>
                <select
                  aria-label="Hãng vận chuyển"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option>Vngrow đề xuất (Tối ưu nhất)</option>
                  <option>DHL Express</option>
                  <option>FedEx Priority</option>
                  <option>UPS Express Saver</option>
                  <option>Chuyên Tuyến Vngrow Express</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hình thức giao hàng cho Vngrow
                </label>
                <select
                  aria-label="Hình thức giao hàng"
                  value={pickupMethod}
                  onChange={(e) => setPickupMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option>Lấy tận nơi (Pick-up nội thành HCM)</option>
                  <option>Mang đến văn phòng Vngrow HCM</option>
                  <option>Gửi bến xe (Vngrow ra bến xe nhận)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên hàng trên Bill (Khai báo Hải quan)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Section 4: Packages & Items */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-sky-100 pb-2">
              <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wide">
                4. Chi tiết kiện hàng ({packages.length} kiện)
              </h3>
              <button
                type="button"
                onClick={handleAddPackage}
                className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm kiện hàng
              </button>
            </div>

            {packages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-extrabold text-sky-800">
                  <span>📦 KIỆN SỐ {idx + 1}</span>
                  {packages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePackage(pkg.id)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                      title="Xóa kiện"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-500 font-bold">Dài (cm)</label>
                    <input
                      type="number"
                      value={pkg.length}
                      onChange={(e) =>
                        setPackages((prev) =>
                          prev.map((p) =>
                            p.id === pkg.id ? { ...p, length: Number(e.target.value) } : p
                          )
                        )
                      }
                      className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-bold">Rộng (cm)</label>
                    <input
                      type="number"
                      value={pkg.width}
                      onChange={(e) =>
                        setPackages((prev) =>
                          prev.map((p) =>
                            p.id === pkg.id ? { ...p, width: Number(e.target.value) } : p
                          )
                        )
                      }
                      className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-bold">Cao (cm)</label>
                    <input
                      type="number"
                      value={pkg.height}
                      onChange={(e) =>
                        setPackages((prev) =>
                          prev.map((p) =>
                            p.id === pkg.id ? { ...p, height: Number(e.target.value) } : p
                          )
                        )
                      }
                      className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-bold">GW Cân Nặng (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={pkg.gw}
                      onChange={(e) =>
                        setPackages((prev) =>
                          prev.map((p) =>
                            p.id === pkg.id ? { ...p, gw: Number(e.target.value) } : p
                          )
                        )
                      }
                      className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold text-sky-700"
                    />
                  </div>
                </div>

                {/* Items in Package */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
                    <span>Mặt hàng trong kiện {idx + 1}:</span>
                    <button
                      type="button"
                      onClick={() => handleAddItem(pkg.id)}
                      className="text-sky-700 hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" /> Thêm mặt hàng
                    </button>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                          <th className="py-2 px-3">Tên mặt hàng (EN/VN)</th>
                          <th className="py-2 px-3 w-20">HS Code</th>
                          <th className="py-2 px-3 w-16 text-right">Đơn giá</th>
                          <th className="py-2 px-3 w-16 text-center">Tiền tệ</th>
                          <th className="py-2 px-3 w-16 text-center">ĐVT</th>
                          <th className="py-2 px-3 w-16 text-center">SL</th>
                          <th className="py-2 px-3 w-20 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pkg.items.map((it) => (
                          <tr key={it.id}>
                            <td className="p-2">
                              <input
                                type="text"
                                value={it.name}
                                onChange={(e) =>
                                  handleUpdateItem(pkg.id, it.id, 'name', e.target.value)
                                }
                                placeholder="Tên hàng..."
                                className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={it.hsCode || ''}
                                onChange={(e) =>
                                  handleUpdateItem(pkg.id, it.id, 'hsCode', e.target.value)
                                }
                                placeholder="HS..."
                                className="w-full px-2 py-1 border border-slate-200 rounded text-xs font-mono"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={it.unitPrice}
                                onChange={(e) =>
                                  handleUpdateItem(pkg.id, it.id, 'unitPrice', e.target.value)
                                }
                                className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-right font-bold"
                              />
                            </td>
                            <td className="p-2 text-center font-bold text-slate-600">USD</td>
                            <td className="p-2 text-center text-slate-600">{it.unit}</td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={it.quantity}
                                onChange={(e) =>
                                  handleUpdateItem(pkg.id, it.id, 'quantity', e.target.value)
                                }
                                className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-center font-bold"
                              />
                            </td>
                            <td className="p-2 text-right font-bold text-sky-700 font-mono">
                              {it.totalAmount} $
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-3">
            <div className="font-bold text-amber-900 uppercase tracking-wider flex items-center justify-between border-b border-amber-200 pb-2">
              <span>Tổng kết lô hàng</span>
              <span>Tổng khai báo: {totalDeclaredUsd} USD</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-500 font-semibold">Tổng GW:</span>
                <div className="font-mono font-bold text-base text-slate-900 mt-0.5">{totalGw} kg</div>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Thể tích VW:</span>
                <div className="font-mono font-bold text-base text-slate-900 mt-0.5">{roundedVw} kg</div>
              </div>
              <div>
                <span className="text-sky-800 font-bold">Trọng lượng tính (CW):</span>
                <div className="font-mono font-extrabold text-lg text-rose-600 mt-0.5">{totalCw} kg</div>
              </div>
              <div>
                <span className="text-emerald-800 font-bold">Hoa hồng CTV:</span>
                <div className="font-mono font-extrabold text-lg text-emerald-700 mt-0.5">
                  +{estimatedCommissionVnd.toLocaleString('vi-VN')} ₫
                </div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCreate('draft')}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
              >
                Lưu nháp
              </button>
              <button
                type="button"
                onClick={() => handleCreate('sent')}
                className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Gửi</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
