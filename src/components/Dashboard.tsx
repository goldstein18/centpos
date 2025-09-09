import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TransactionForm from './TransactionForm';
import PagosSection from './PagosSection';
import ReportsSection from './ReportsSection';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('abonos');

  const renderContent = () => {
    switch (activeSection) {
      case 'abonos':
        return <TransactionForm />;
      case 'pagos':
        return <PagosSection />;
      case 'reportes':
        return <ReportsSection />;
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
