import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Invoice } from '../../types';
import { Receipt, Search, Plus, CheckCircle, Send, Image as ImageIcon, FileText } from 'lucide-react';

export const InvoiceList: React.FC = () => {
  const { invoices, markInvoicePaid, addToast } = useLogistics();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.bookingCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative min-w-[240px] max-w-sm flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo Mã Invoice, Tên khách hàng, Mã Booking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all font-mono"
          />
        </div>

        <button
          onClick={() => alert('Chức năng tạo hóa đơn mới')}
          className="px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Invoice Mới</span>
        </button>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Mã Invoice</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Mã Booking (VG)</th>
                <th className="py-3 px-4">Loại Invoice</th>
                <th className="py-3 px-4 text-right">Tổng tiền</th>
                <th className="py-3 px-4">Phương thức & Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-700">
                    {inv.invoiceCode}
                    <div className="text-[11px] text-slate-400 font-sans font-normal">{inv.date}</div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-900 text-xs">
                    {inv.customerName}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-sky-700 text-xs">
                    {inv.bookingCode}
                  </td>

                  <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                    {inv.type}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900 tabular-nums">
                    {inv.amount.toLocaleString('vi-VN')} ₫
                  </td>

                  <td className="py-3.5 px-4">
                    <div>
                      {inv.status === 'paid' ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Đã thanh toán (paid)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Chưa thanh toán (unpaid)
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-medium">{inv.method}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => addToast(`Đã gửi lại Invoice ${inv.invoiceCode} cho khách hàng qua Email/Zalo!`, 'info')}
                        className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded"
                        title="Gửi Invoice"
                      >
                        <Send className="w-4 h-4" />
                      </button>

                      {inv.status === 'unpaid' ? (
                        <button
                          onClick={() => markInvoicePaid(inv.id)}
                          className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-2xs"
                        >
                          Ghi Nhận Thu Tiền
                        </button>
                      ) : (
                        <button
                          onClick={() => alert('Xem ảnh ủy nhiệm chi / hóa đơn thanh toán')}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                          title="Xem ảnh chứng từ chuyển khoản"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
