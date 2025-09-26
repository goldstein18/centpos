import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  Save, 
  Edit3, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface InterestRate {
  id: string;
  type: 'PRO' | 'Normal';
  rate: number;
  description: string;
  isActive: boolean;
}

const TasasInteresSection: React.FC = () => {
  const [rates, setRates] = useState<InterestRate[]>([]);
  const [editingRate, setEditingRate] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: number }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleRates: InterestRate[] = [
      {
        id: 'pro-rate',
        type: 'PRO',
        rate: 12.5,
        description: 'Tasa PRO',
        isActive: true
      },
      {
        id: 'normal-rate',
        type: 'Normal',
        rate: 18.75,
        description: 'Tasa Normal',
        isActive: true
      }
    ];
    setRates(sampleRates);
  }, []);

  const handleEdit = (rateId: string, currentRate: number) => {
    setEditingRate(rateId);
    setEditValues({ ...editValues, [rateId]: currentRate });
  };

  const handleCancel = (rateId: string) => {
    setEditingRate(null);
    setEditValues({ ...editValues, [rateId]: rates.find(r => r.id === rateId)?.rate || 0 });
  };

  const handleSave = async (rateId: string) => {
    const newRate = editValues[rateId];
    
    if (newRate < 0 || newRate > 100) {
      setSaveMessage({ type: 'error', message: 'La tasa de interés debe estar entre 0% y 100%' });
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRates(prevRates => 
        prevRates.map(rate => 
          rate.id === rateId 
            ? { 
                ...rate, 
                rate: newRate
              }
            : rate
        )
      );
      
      setEditingRate(null);
      setSaveMessage({ type: 'success', message: 'Tasa de interés actualizada exitosamente' });
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Error al actualizar la tasa de interés' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRateChange = (rateId: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setEditValues({ ...editValues, [rateId]: numericValue });
  };

  const getRateColor = (type: 'PRO' | 'Normal') => {
    return type === 'PRO' ? 'text-green-600' : 'text-blue-600';
  };

  const getRateBgColor = (type: 'PRO' | 'Normal') => {
    return type === 'PRO' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-secondary-900">Tasas de Interés</h2>
            <p className="text-xs sm:text-sm text-secondary-500">Gestiona las tasas de interés para clientes PRO y Normal</p>
          </div>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`card p-4 ${
          saveMessage.type === 'success' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {saveMessage.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {saveMessage.message}
            </span>
          </div>
        </div>
      )}

      {/* Interest Rates Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {rates.map((rate) => (
          <div key={rate.id} className={`card p-6 border-2 ${getRateBgColor(rate.type)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  rate.type === 'PRO' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <TrendingUp className={`h-5 w-5 ${getRateColor(rate.type)}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${getRateColor(rate.type)}`}>
                    Tasa {rate.type}
                  </h3>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                rate.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {rate.isActive ? 'Activa' : 'Inactiva'}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Tasa de Interés Anual
                </label>
                {editingRate === rate.id ? (
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        className="input-field pr-8"
                        value={editValues[rate.id] || ''}
                        onChange={(e) => handleRateChange(rate.id, e.target.value)}
                        placeholder="0.00"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
                        %
                      </span>
                    </div>
                    <button
                      onClick={() => handleSave(rate.id)}
                      disabled={isSaving}
                      className="btn-primary flex items-center space-x-1 px-3 py-2"
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCancel(rate.id)}
                      className="btn-secondary px-3 py-2"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-2xl font-bold ${getRateColor(rate.type)}`}>
                        {rate.rate}%
                      </span>
                      <span className="text-sm text-secondary-500">anual</span>
                    </div>
                    <button
                      onClick={() => handleEdit(rate.id, rate.rate)}
                      className="btn-secondary flex items-center space-x-1 px-3 py-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Editar</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-secondary-600">
                  {rate.description}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Information Section */}
      <div className="card p-4 sm:p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-800 mb-2">Información Importante</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Las tasas de interés se aplican de forma anual</li>
                <li>• Los cambios en las tasas afectan a nuevos créditos únicamente</li>
                <li>• Los créditos existentes mantienen su tasa original</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasasInteresSection;
