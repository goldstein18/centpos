import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TransactionForm from './TransactionForm';
import ReportsSection from './ReportsSection';
import GestionSection from './GestionSection';
import ClientesSection from './ClientesSection';
import AtencionSection from './AtencionSection';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('abonos');

  const renderContent = () => {
    switch (activeSection) {
      case 'abonos':
        return <TransactionForm />;
      case 'reportes':
        return <ReportsSection />;
      case 'gestion':
        return <GestionSection />;
      case 'clientes':
        return <ClientesSection />;
      case 'atencion':
        return <AtencionSection />;
      default:
        return <TransactionForm />;
    }
  };

  return (
    <div className="flex h-screen bg-secondary-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};



export default Dashboard;
