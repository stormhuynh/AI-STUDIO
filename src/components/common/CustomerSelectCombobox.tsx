import React, { useState, useRef, useEffect } from 'react';
import { Customer } from '../../types';
import { useLogistics } from '../../context/LogisticsContext';
import { Search, User, Building, X, ChevronDown, Check } from 'lucide-react';

interface CustomerSelectComboboxProps {
  onSelectCustomer: (customer: Customer) => void;
  selectedCustomerCode?: string;
  placeholder?: string;
}

export const CustomerSelectCombobox: React.FC<CustomerSelectComboboxProps> = ({
  onSelectCustomer,
  selectedCustomerCode,
  placeholder = 'Tìm tên, SĐT hoặc mã KH (VD: KH-1020, Nguyễn Văn B, 0988...)...',
}) => {
  const { visibleCustomers } = useLogistics();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCustomerCode) {
      const match = visibleCustomers.find((c) => c.code === selectedCustomerCode);
      if (match) {
        setSelectedCustomer(match);
        setSearchTerm(`${match.code} - ${match.name} (${match.phone})`);
      }
    }
  }, [selectedCustomerCode, visibleCustomers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = visibleCustomers.filter((c) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.companyName && c.companyName.toLowerCase().includes(q))
    );
  });

  const handleSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchTerm(`${customer.code} - ${customer.name} (${customer.phone})`);
    setIsOpen(false);
    onSelectCustomer(customer);
  };

  const handleClear = () => {
    setSelectedCustomer(null);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (selectedCustomer && e.target.value !== `${selectedCustomer.code} - ${selectedCustomer.name} (${selectedCustomer.phone})`) {
              setSelectedCustomer(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-14 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white focus:border-sky-500 transition-all"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
          {filtered.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400">
              Không tìm thấy khách hàng nào khớp với từ khóa.
            </div>
          ) : (
            filtered.map((cust) => {
              const isSelected = selectedCustomer?.id === cust.id;
              return (
                <div
                  key={cust.id}
                  onClick={() => handleSelect(cust)}
                  className={`p-2.5 text-xs hover:bg-sky-50/80 cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-sky-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        cust.type === 'b2b'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {cust.type === 'b2b' ? (
                        <Building className="w-3.5 h-3.5" />
                      ) : (
                        <User className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="font-mono text-sky-700">{cust.code}</span>
                        <span>·</span>
                        <span>{cust.name}</span>
                        {cust.companyName && (
                          <span className="text-[11px] font-normal text-slate-500 truncate max-w-[140px]">
                            ({cust.companyName})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                        <span>{cust.phone}</span>
                        {cust.email && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[160px]">{cust.email}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        cust.type === 'b2b'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {cust.type === 'b2b' ? 'B2B' : 'Cá nhân'}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
