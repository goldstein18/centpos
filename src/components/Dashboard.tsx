import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TransactionForm from './TransactionForm';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('abonos');

  const renderContent = () => {
    switch (activeSection) {
      case 'abonos':
        return <TransactionForm />;
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

const ReportsSection: React.FC = () => (
  <div className="card p-6">
    <h2 className="text-xl font-semibold text-secondary-900 mb-4">Reportes</h2>
    <p className="text-secondary-600">Funciones de reportes próximamente...</p>
  </div>
);

export default Dashboard;
