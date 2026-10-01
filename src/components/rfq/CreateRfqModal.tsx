import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { CustomerSelectCombobox } from '../common/CustomerSelectCombobox';
import { CountryCombobox } from '../common/CountryCombobox';
import { BookingPackage, BookingPackageItem, Customer } from '../../types';
import {
  X,
  Send,
  Upload,
  FileText,
  Plus,
  Trash2,
  Package,
  CheckCircle,
  Paperclip,
} from 'lucide-react';

interface CreateRfqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRfqModal: React.FC<CreateRfqModalProps> = ({ isOpen, onClose }) => {
  const { addRfq, activeCollaborator } = useLogistics();

  const [customerName, setCustomerName] = useState(activeCollaborator.name);
  const [customerPhone, setCustomerPhone] = useState(activeCollaborator.phone);
  const [customerEmail, setCustomerEmail] = useState(activeCollaborator.email);
  const [customerCompany, setCustomerCompany] = useState('');
  const [originCountry, setOriginCountry] = useState('Việt Nam (VN)');
  const [destCountry, setDestCountry] = useState('Hàn Quốc (KR)');
  const [goodsDescription, setGoodsDescription] = useState('Pin Lithium & Mẫu linh kiện điện tử');
  const [notes, setNotes] = useState('Hàng pin đóng theo tiêu chuẩn UN3480 / Section II, nhiệt độ mát');
  const [msdsFile, setMsdsFile] = useState<string>('MSDS_Lithium_Battery_2026.pdf');

  const [services, setServices] = useState<string[]>([
    'Để Vngrow tự đề xuất (Mặc định)',
  ]);

  // Packages list combining Section 4 of Booking
  const [packages, setPackages] = useState<BookingPackage[]>([
    {
      id: 'pkg-1',
      length: 40,
      width: 30,
      height: 25,
      gw: 8.5,
      items: [
        {
          id: 'item-1',
          name: 'Pin sạc Lithium 18650',
          hsCode: '850760',
          unitPrice: 12,
          currency: 'USD',
          unit: 'viên',
          quantity: 20,
          totalAmount: 240,
        },
      ],
    },
  ]);

  if (!isOpen) return null;

  const totalGw = packages.reduce((sum, p) => sum + (Number(p.gw) || 0), 0);
  const totalVw = packages.reduce(
    (sum, p) => sum + (p.length * p.width * p.height) / 5000,
    0
  );
  const roundedVw = Math.round(totalVw * 10) / 10;
  const totalCw = Math.max(totalGw, roundedVw);

  const toggleService = (srv: string) => {
    setServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleSelectCustomer = (cust: Customer) => {
    setCustomerName(cust.name);
    setCustomerPhone(cust.phone);
    if (cust.email) setCustomerEmail(cust.email);
    if (cust.companyName) setCustomerCompany(cust.companyName);
  };

  const addPackage = () => {
    const newPkg: BookingPackage = {
      id: 'pkg-' + Date.now(),
      length: 30,
      width: 25,
      height: 20,
      gw: 3.0,
      items: [
        {
          id: 'item-' + Date.now(),
          name: 'Hàng mẫu đính kèm',
          hsCode: '',
          unitPrice: 10,
          currency: 'USD',
          unit: 'cái',
          quantity: 1,
          totalAmount: 10,
        },
      ],
    };
    setPackages([...packages, newPkg]);
  };

  const removePackage = (pkgId: string) => {
    if (packages.length <= 1) return;
    setPackages(packages.filter((p) => p.id !== pkgId));
  };

  const addItemToPackage = (pkgId: string) => {
    setPackages(
      packages.map((pkg) => {
        if (pkg.id !== pkgId) return pkg;
        const newItem: BookingPackageItem = {
          id: 'item-' + Date.now(),
          name: '',
          hsCode: '',
          unitPrice: 0,
          currency: 'USD',
          unit: 'cái',
          quantity: 1,
          totalAmount: 0,
        };
        return { ...pkg, items: [...pkg.items, newItem] };
      })
    );
  };

  const removeItemFromPackage = (pkgId: string, itemId: string) => {
    setPackages(
      packages.map((pkg) => {
        if (pkg.id !== pkgId) return pkg;
        if (pkg.items.length <= 1) return pkg;
        return { ...pkg, items: pkg.items.filter((it) => it.id !== itemId) };
      })
    );
  };

  const updateItemField = (
    pkgId: string,
    itemId: string,
    field: keyof BookingPackageItem,
    val: any
  ) => {
    setPackages(
      packages.map((pkg) => {
        if (pkg.id !== pkgId) return pkg;
        const newItems = pkg.items.map((it) => {
          if (it.id !== itemId) return it;
          const updated = { ...it, [field]: val };
          if (field === 'unitPrice' || field === 'quantity') {
            updated.totalAmount =
              (Number(updated.unitPrice) || 0) * (Number(updated.quantity) || 0);
          }
          return updated;
        });
        return { ...pkg, items: newItems };
      })
    );
  };

  const handleCreate = (targetStatus: 'draft' | 'sent') => {
    if (!customerName || !goodsDescription) {
      alert('Vui lòng điền đủ tên khách hàng và mô tả hàng hóa!');
      return;
    }

    addRfq({
      collaboratorId: activeCollaborator.id,
      customerName,
      customerPhone,
      customerEmail,
      customerCompany,
      originCountry,
      destCountry,
      desiredServices: services,
      goodsDescription,
      estimatedWeight: totalCw || 1,
      storageRequirement: notes,
      msdsFile: msdsFile || 'MSDS_tailieu_dinhkem.pdf',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tạo Yêu Cầu Báo Giá</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate('sent');
          }}
          className="p-6 overflow-y-auto space-y-5 text-xs"
        >
          {/* Section 1: Customer picker & Route */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wide border-b border-sky-100 pb-1.5">
              1. Khách hàng & Tuyến
            </h3>

            {/* Quick customer selection */}
            <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 space-y-1">
              <label className="block text-xs font-bold text-sky-950">
                Chọn khách hàng từ danh bạ (Nhập Tên, SĐT, hoặc Mã KH):
              </label>
              <CustomerSelectCombobox onSelectCustomer={handleSelectCustomer} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên khách hàng *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Công ty / Cơ quan</label>
                <input
                  type="text"
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Origin & Destination Comboboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CountryCombobox
                label="Quốc gia gửi"
                required
                value={originCountry}
                onChange={setOriginCountry}
              />
              <CountryCombobox
                label="Quốc gia nhận"
                required
                value={destCountry}
                onChange={setDestCountry}
              />
            </div>
          </div>

          {/* Section 2: Services */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wide border-b border-sky-100 pb-1.5">
              2. Dịch vụ mong muốn
            </h3>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              {[
                'Để Vngrow tự đề xuất (Mặc định)',
                'DHL Express',
                'FedEx Priority',
                'UPS Saver',
                'Chuyên Tuyến Vngrow',
              ].map((srv) => (
                <label
                  key={srv}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                    services.includes(srv)
                      ? 'border-sky-500 bg-sky-50 text-sky-800'
                      : 'border-slate-300 bg-white text-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={services.includes(srv)}
                    onChange={() => toggleService(srv)}
                    className="hidden"
                  />
                  <span>{srv}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Detailed Packages & Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-sky-100 pb-1.5">
              <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wide">
                3. Kiện hàng ({packages.length} kiện)
              </h3>
              <button
                type="button"
                onClick={addPackage}
                className="px-2.5 py-1 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Kiện</span>
              </button>
            </div>

            <div className="space-y-3">
              {packages.map((pkg, idx) => (
                <div
                  key={pkg.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-sky-600" /> Kiện số {idx + 1}
                    </span>
                    {packages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePackage(pkg.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-500 font-bold block mb-0.5">
                        Dài (cm)
                      </label>
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
                      <label className="text-[11px] text-slate-500 font-bold block mb-0.5">
                        Rộng (cm)
                      </label>
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
                      <label className="text-[11px] text-slate-500 font-bold block mb-0.5">
                        Cao (cm)
                      </label>
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
                      <label className="text-[11px] text-slate-500 font-bold block mb-0.5">
                        GW Cân (kg)
                      </label>
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

                  {/* Items list inside package */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
                      <span>Mặt hàng trong kiện {idx + 1}:</span>
                      <button
                        type="button"
                        onClick={() => addItemToPackage(pkg.id)}
                        className="text-sky-700 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Plus className="w-3 h-3" /> Thêm item
                      </button>
                    </div>

                    {pkg.items.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <input
                            type="text"
                            placeholder="Tên hàng (VD: Pin Lithium, Mẫu hóa chất...)"
                            value={item.name}
                            onChange={(e) =>
                              updateItemField(pkg.id, item.id, 'name', e.target.value)
                            }
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Mã HS"
                            value={item.hsCode || ''}
                            onChange={(e) =>
                              updateItemField(pkg.id, item.id, 'hsCode', e.target.value)
                            }
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs text-center"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="SL"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItemField(pkg.id, item.id, 'quantity', Number(e.target.value))
                            }
                            className="w-full px-2 py-1 border border-slate-300 rounded text-center text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Đơn giá $"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItemField(pkg.id, item.id, 'unitPrice', Number(e.target.value))
                            }
                            className="w-full px-2 py-1 border border-slate-300 rounded text-center text-xs"
                          />
                        </div>
                        <div className="col-span-1 text-center">
                          {pkg.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItemFromPackage(pkg.id, item.id)}
                              className="text-slate-400 hover:text-rose-600 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculated Weight Summary */}
            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 font-semibold">Tổng GW: </span>
                <strong className="font-mono text-slate-800">{totalGw} kg</strong>
                <span className="text-slate-400 mx-2">|</span>
                <span className="text-slate-500 font-semibold">Thể tích VW: </span>
                <strong className="font-mono text-slate-800">{roundedVw} kg</strong>
              </div>
              <div>
                <span className="text-sky-800 font-bold uppercase mr-1.5">Trọng lượng tính (CW):</span>
                <span className="font-mono font-extrabold text-sm text-rose-600">{totalCw} kg</span>
              </div>
            </div>
          </div>

          {/* Section 4: Special Cargo Details & File Upload */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wide border-b border-sky-100 pb-1.5">
              4. Hàng đặc biệt & Tài liệu
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên hàng hóa & Mô tả chi tiết *
              </label>
              <input
                type="text"
                required
                placeholder="VD: Hóa chất lỏng, Pin Lithium, Mẫu thí nghiệm..."
                value={goodsDescription}
                onChange={(e) => setGoodsDescription(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            {/* Ghi chú (đổi từ Yêu cầu bảo quản / Quy cách đóng gói) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ghi chú
              </label>
              <textarea
                rows={2}
                placeholder="Yêu cầu bảo quản, nhiệt độ, đóng gói UN, ghi chú hải quan..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            {/* File Upload Dropzone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tài liệu đính kèm (MSDS / Giấy phân tích thành phần / Ảnh hàng / Packing List)
              </label>
              <div
                onClick={() => {
                  const sampleFiles = [
                    'MSDS_Lithium_Battery_2026.pdf',
                    'Packing_List_Detailed.xlsx',
                    'Certificate_Of_Analysis_CoA.pdf',
                    'Cargo_Packaging_Photos.zip',
                  ];
                  const chosen = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
                  setMsdsFile(chosen);
                  alert(`Đã đính kèm file: ${chosen}`);
                }}
                className="p-3.5 border-2 border-dashed border-sky-300 rounded-xl text-center bg-sky-50/40 hover:bg-sky-50 transition-colors cursor-pointer"
              >
                <Upload className="w-5 h-5 text-sky-600 mx-auto mb-1" />
                <span className="text-xs font-semibold text-sky-900 block">
                  {msdsFile ? (
                    <span className="flex items-center justify-center gap-1.5 text-emerald-700 font-bold">
                      <Paperclip className="w-3.5 h-3.5" /> {msdsFile} (Đã tải lên)
                    </span>
                  ) : (
                    'Bấm để tải lên file MSDS / Packing List / Ảnh hàng'
                  )}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Định dạng hỗ trợ: PDF, XLSX, DOCX, JPG, PNG (Tối đa 25MB)
                </span>
              </div>
            </div>
          </div>

          {/* Footer Controls: Lưu nháp & Gửi */}
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
                <Send className="w-3.5 h-3.5" />
                <span>Gửi</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
