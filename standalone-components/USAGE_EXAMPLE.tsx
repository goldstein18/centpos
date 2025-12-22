// Ejemplo de uso de los componentes standalone
// Este archivo muestra cómo integrar los componentes en tu aplicación

import React from 'react';
import TasasInteresSection from './TasasInteresSection';
import SegurosSection from './SegurosSection';

// Ejemplo 1: Usar solo TasasInteresSection
export const TasasPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <TasasInteresSection />
    </div>
  );
};

// Ejemplo 2: Usar solo SegurosSection
export const SegurosPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <SegurosSection />
    </div>
  );
};

// Ejemplo 3: Usar ambos componentes con navegación
export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'tasas' | 'seguros'>('tasas');

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <button
          onClick={() => setActiveTab('tasas')}
          className={`px-4 py-2 mr-2 ${
            activeTab === 'tasas' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Tasas de Interés
        </button>
        <button
          onClick={() => setActiveTab('seguros')}
          className={`px-4 py-2 ${
            activeTab === 'seguros' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Seguros
        </button>
      </div>

      {activeTab === 'tasas' && <TasasInteresSection />}
      {activeTab === 'seguros' && <SegurosSection />}
    </div>
  );
};

// Ejemplo 4: Con React Router
/*
import { Routes, Route } from 'react-router-dom';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/tasas" element={<TasasInteresSection />} />
      <Route path="/seguros" element={<SegurosSection />} />
    </Routes>
  );
};
*/









