import React, { useState, useEffect } from 'react';
import { Booking, BookingPackage, BookingPackageItem } from '../../types';
import { useLogistics } from '../../context/LogisticsContext';
import { X, Send, Save, AlertTriangle, Package, Trash2, Plus, CheckCircle2 } from 'lucide-react';

interface EditBookingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditBookingModal: React.FC<EditBookingModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { updateBookingContent } = useLogistics();

  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [senderCountry, setSenderCountry] = useState('Việt Nam (VN)');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverCountry, setReceiverCountry] = useState('');
  const [service, setService] = useState('');
  const [pickupMethod, setPickupMethod] = useState('');
  const [description, setDescription] = useState('');
  const [packages, setPackages] = useState<BookingPackage[]>([]);

  useEffect(() => {
    if (booking) {
      setSenderName(booking.senderName || '');
      setSenderPhone(booking.senderPhone || '');
      setSenderAddress(booking.senderAddress || '');
      setSenderCountry(booking.senderCountry || 'Việt Nam (VN)');
      setReceiverName(booking.receiverName || '');
      setReceiverPhone(booking.receiverPhone || '');
      setReceiverAddress(booking.receiverAddress || '');
      setReceiverCountry(booking.receiverCountry || '');
      setService(booking.service || 'Vngrow đề xuất (Tối ưu nhất)');
      setPickupMethod(booking.pickupMethod || 'Lấy tận nơi (Pick-up)');
      setDescription(booking.description || '');
      setPackages(
        booking.packages && booking.packages.length > 0
          ? JSON.parse(JSON.stringify(booking.packages))
          : [
              {
                id: 'pkg-1',
                length: 30,
                width: 25,
                height: 20,
                gw: 3.5,
                items: [
                  {
                    id: 'it-1',
                    name: booking.description || 'Hàng hóa mẫu',
                    unitPrice: 15,
                    currency: 'USD',
                    unit: 'cái',
                    quantity: 2,
                    totalAmount: 30,
                  },
                ],
              },
            ]
      );
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const totalGw = packages.reduce((sum, p) => sum + (Number(p.gw) || 0), 0);
  const totalVw = packages.reduce((sum, p) => sum + (p.length * p.width * p.height) / 5000, 0);
  const roundedVw = Math.round(totalVw * 10) / 10;
  const totalCw = Math.max(totalGw, roundedVw);

  const addPackage = () => {
    const newPkg: BookingPackage = {
      id: 'pkg-' + Date.now(),
      length: 30,
      width: 20,
      height: 15,
      gw: 2,
      items: [
        {
          id: 'item-' + Date.now(),
          name: 'Hàng hóa mẫu',
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

  const handleSave = (targetStatus: 'draft' | 'sent') => {
    updateBookingContent(
      booking.id,
      {
        senderName,
        senderPhone,
        senderAddress,
        senderCountry,
        receiverName,
        receiverPhone,
        receiverAddress,
        receiverCountry,
        service,
        pickupMethod,
        description,
        packages,
        totalGw,
        totalVw: roundedVw,
        totalCw,
        status: targetStatus,
      },
      targetStatus === 'sent' // resend if sent
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-sky-700 text-base">
                {booking.code}
              </span>
              <span className="text-slate-300">|</span>
              <h2 className="text-base font-bold text-slate-900">
                Sửa Booking
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Rejection notice if previously rejected */}
          {booking.status === 'reject' && booking.rejectReason && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs text-rose-900">
              <div className="font-bold flex items-center gap-1.5 text-rose-700">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Lý do Vngrow từ chối:
              </div>
              <p className="leading-relaxed pl-5 font-medium text-rose-800">
                {booking.rejectReason}
              </p>
            </div>
          )}

          {/* Section 1: Sender */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wide border-b border-sky-100 pb-1.5">
              1. Người gửi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ tên người gửi</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ người gửi</label>
              <input
                type="text"
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Section 2: Receiver */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wide border-b border-sky-100 pb-1.5">
              2. Người nhận
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ tên người nhận *</label>
                <input
                  type="text"
                  required
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại nhận *</label>
                <input
                  type="text"
                  required
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quốc gia nhận</label>
                <input
                  type="text"
                  value={receiverCountry}
                  onChange={(e) => setReceiverCountry(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Địa chỉ chi tiết người nhận + Mã ZIP Code *
              </label>
              <input
                type="text"
                required
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Section 3: Cargo & Packages Detail */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-sky-100 pb-1.5">
              <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wide">
                3. Kiện hàng & Dịch vụ
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên hàng khai báo</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dịch vụ vận chuyển</label>
                <select
                  aria-label="Dịch vụ vận chuyển"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option>Vngrow đề xuất (Tối ưu nhất)</option>
                  <option>DHL Express</option>
                  <option>FedEx Priority</option>
                  <option>UPS Express Saver</option>
                  <option>Chuyên Tuyến Vngrow Express</option>
                </select>
              </div>
            </div>

            {/* List of packages */}
            <div className="space-y-3 mt-3">
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
                      <label className="text-[11px] text-slate-500 font-bold block mb-0.5">Dài (cm)</label>
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
                      <label className="text-[11px] text-slate-500 font-bold block mb-0.5">Rộng (cm)</label>
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
                      <label className="text-[11px] text-slate-500 font-bold block mb-0.5">Cao (cm)</label>
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
                      <label className="text-[11px] text-slate-500 font-bold block mb-0.5">GW Cân (kg)</label>
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
                            placeholder="Tên hàng (VD: Áo sơ mi...)"
                            value={item.name}
                            onChange={(e) =>
                              updateItemField(pkg.id, item.id, 'name', e.target.value)
                            }
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
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
                        <div className="col-span-2 font-mono font-bold text-slate-700 text-xs text-right">
                          ${item.totalAmount}
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

            {/* CW summary */}
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
                <span className="font-mono font-extrabold text-base text-rose-600">{totalCw} kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions: Lưu nháp (Draft) and Gửi (Sent) */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/70">
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
              onClick={() => handleSave('draft')}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu nháp</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('sent')}
              className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
