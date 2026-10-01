import React, { useState, useRef, useEffect } from 'react';
import { Globe2, ChevronDown, Check, X } from 'lucide-react';

interface CountryComboboxProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const POPULAR_COUNTRIES = [
  'Việt Nam (VN)',
  'Hoa Kỳ (US)',
  'Úc (Australia - AU)',
  'Canada (CA)',
  'Nhật Bản (JP)',
  'Hàn Quốc (KR)',
  'Vương Quốc Anh (UK)',
  'Đức (Germany - DE)',
  'Pháp (France - FR)',
  'Singapore (SG)',
  'Đài Loan (TW)',
  'Trung Quốc (CN)',
  'Malaysia (MY)',
  'Thái Lan (TH)',
  'Philippines (PH)',
  'New Zealand (NZ)',
  'Hà Lan (NL)',
  'Ý (Italy - IT)',
  'Tây Ban Nha (ES)',
  'UAE (Dubai)',
];

export const CountryCombobox: React.FC<CountryComboboxProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Chọn hoặc gõ quốc gia...',
  required = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = POPULAR_COUNTRIES.filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleSelect = (country: string) => {
    setSearchTerm(country);
    onChange(country);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onChange(e.target.value);
    setIsOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative w-full space-y-1">
      {label && (
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <Globe2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          required={required}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
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
        <div className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
          {filtered.length === 0 ? (
            <div
              onClick={() => setIsOpen(false)}
              className="p-2.5 text-xs text-sky-700 hover:bg-sky-50 cursor-pointer font-medium"
            >
              Sử dụng &ldquo;{searchTerm}&rdquo;
            </div>
          ) : (
            filtered.map((country) => {
              const isSelected = value === country;
              return (
                <div
                  key={country}
                  onClick={() => handleSelect(country)}
                  className={`p-2 px-3 text-xs hover:bg-sky-50 cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-sky-50 font-bold text-sky-800' : 'text-slate-700'
                  }`}
                >
                  <span>{country}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
