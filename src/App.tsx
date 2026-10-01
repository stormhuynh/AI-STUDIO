import React from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ToastContainer } from './components/common/Toast';

import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { CrmView } from './components/crm/CrmView';
import { CustomerList } from './components/customers/CustomerList';
import { CollaboratorPerformance } from './components/performance/CollaboratorPerformance';
import { BookingList } from './components/booking/BookingList';
import { WaybillList } from './components/waybill/WaybillList';
import { RfqList } from './components/rfq/RfqList';
import { CommissionManagement } from './components/commission/CommissionManagement';
import { InvoiceList } from './components/invoice/InvoiceList';
import { PricingSettings } from './components/pricing/PricingSettings';
import { AuditLogView } from './components/audit/AuditLogView';
import { SettingsView } from './components/settings/SettingsView';

const MainAppLayout: React.FC = () => {
  const { activePage } = useLogistics();

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'crm':
        return <CrmView />;
      case 'customers':
        return <CustomerList />;
      case 'collaborators':
        return <CollaboratorPerformance />;
      case 'booking':
        return <BookingList />;
      case 'waybill':
        return <WaybillList />;
      case 'rfq':
        return <RfqList />;
      case 'commission':
        return <CommissionManagement />;
      case 'invoice':
        return <InvoiceList />;
      case 'pricing':
        return <PricingSettings />;
      case 'audit':
        return <AuditLogView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Scrollable Viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <LogisticsProvider>
        <MainAppLayout />
      </LogisticsProvider>
    </LanguageProvider>
  );
}
