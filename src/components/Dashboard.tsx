import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TransactionForm from './TransactionForm';
import PagosSection from './PagosSection';
import ReportsSection from './ReportsSection';
import CancelarAbonosSection from './CancelarAbonosSection';
import SegurosSection from './SegurosSection';
import TasasInteresSection from './TasasInteresSection';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('abonos');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'abonos':
        return <TransactionForm />;
      case 'pagos':
        return <PagosSection />;
      case 'cancelar':
        return <CancelarAbonosSection />;
      case 'seguros':
        return <SegurosSection />;
      case 'tasas':
        return <TasasInteresSection />;
      case 'reportes':
        return <ReportsSection />;
      default:
        return <TransactionForm />;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-secondary-50">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={toggleMobileMenu}
      />
      <div className="flex-1 overflow-auto lg:ml-0">
        <div className="p-3 sm:p-4 lg:p-6 pt-16 lg:pt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};



export default Dashboard;
