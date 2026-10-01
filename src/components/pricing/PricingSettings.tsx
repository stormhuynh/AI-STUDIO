import React from 'react';
import {
  Truck,
  DollarSign,
  Boxes,
  Building,
  MapPin,
  Award,
  ChevronRight,
  Settings,
} from 'lucide-react';

export const PricingSettings: React.FC = () => {
  const cards = [
    {
      title: 'Quản lý Dịch vụ & Zone',
      desc: 'Cấu hình hãng DHL, FedEx, UPS, Chuyên tuyến và các Zone quốc tế hỗ trợ.',
      icon: <Truck className="w-5 h-5 text-sky-600" />,
    },
    {
      title: 'Bảng giá (Rate) & Phụ phí',
      desc: 'Cài đặt đơn giá cước theo kg, phụ phí hàng hóa, phụ phí vùng sâu vùng xa (ODA).',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: 'Nhóm hàng & Mapping',
      desc: 'Phân loại hàng thường, hàng hạn chế, hàng nguy hiểm DG. Gắn phụ phí nhóm hàng.',
      icon: <Boxes className="w-5 h-5 text-amber-600" />,
    },
    {
      title: 'Đại lý Cấp 1 & Giá Vốn',
      desc: 'Danh sách đại lý cung cấp line bay, hợp đồng chiết khấu và giá vốn theo tuyến.',
      icon: <Building className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'Khu vực lấy hàng (Pick-up)',
      desc: 'Cấu hình chi phí lấy hàng nội thành TP.HCM, ngoại thành và nhận tại bến xe.',
      icon: <MapPin className="w-5 h-5 text-rose-600" />,
    },
    {
      title: 'Cài đặt Hạng & Hoa hồng CTV',
      desc: 'Cấu hình % hoa hồng bậc Bạc (5%), Vàng (7%), Kim Cương (10%) và KPI thăng hạng.',
      icon: <Award className="w-5 h-5 text-purple-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => alert(`Cấu hình chi tiết: ${card.title}`)}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              {card.icon}
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1.5 flex items-center justify-between">
              <span>{card.title}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
