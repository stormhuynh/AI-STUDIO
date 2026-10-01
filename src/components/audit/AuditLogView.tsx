import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { ClipboardList, Clock, ShieldCheck, UserCheck } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useLogistics();

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Nhật Ký Thao Tác Hệ Thống (Audit Trail)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ghi nhận minh bạch mọi thao tác đổi trạng thái Deal, cân đo booking và đối soát hoa hồng
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-sky-50 text-sky-700 border border-sky-200">
            {auditLogs.length} sự kiện
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="font-bold text-slate-800">{log.actor}</span>
                  <span className="tabular-nums font-mono text-[11px] text-slate-400">{log.time}</span>
                </div>
                <div className="font-bold text-sky-800 mb-0.5">{log.action}</div>
                <div className="text-slate-600 font-medium">{log.target}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
