import React, { useState, useEffect } from 'react';
import {
  Percent,
  Save,
  Edit3,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { getAuthToken } from './lib/auth';

interface InterestRate {
  type: 'PRO' | 'Normal';
  rate: number;
  description: string;
  updatedAt?: string;
}

interface ApiRate {
  type: 'PRO' | 'Normal';
  interest_rate: number;
  updated_at: string;
}

const DEFAULT_RATES: InterestRate[] = [
  { type: 'PRO', rate: 12.5, description: 'Tasa PRO' },
  { type: 'Normal', rate: 18.75, description: 'Tasa Normal' }
];

const TasasInteresSection: React.FC = () => {
  const [rates, setRates] = useState<InterestRate[]>(DEFAULT_RATES);
  const [editingRate, setEditingRate] = useState<'PRO' | 'Normal' | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: number }>({
    PRO: DEFAULT_RATES[0].rate,
    Normal: DEFAULT_RATES[1].rate
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure your API base URL here or use environment variable
  const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, '') ?? 'https://centdos-backend-production.up.railway.app';
  const investmentEndpoint = `${baseUrl}/investment-rates`;

  const getRateColor = (type: 'PRO' | 'Normal') => (type === 'PRO' ? 'text-green-600' : 'text-blue-600');
  const getRateBgColor = (type: 'PRO' | 'Normal') =>
    type === 'PRO' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200';

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        Accept: 'application/json'
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(investmentEndpoint, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('No se pudieron cargar las tasas');
      }

      const data = (await response.json()) as ApiRate[];
      const parsed = data.map(row => ({
        type: row.type,
        rate: row.interest_rate,
        description: row.type === 'PRO' ? 'Tasa PRO' : 'Tasa Normal',
        updatedAt: row.updated_at
      }));
      setRates(parsed);
      setEditValues({
        PRO: parsed.find(r => r.type === 'PRO')?.rate ?? DEFAULT_RATES[0].rate,
        Normal: parsed.find(r => r.type === 'Normal')?.rate ?? DEFAULT_RATES[1].rate
      });
    } catch (error) {
      setSaveMessage({ type: 'error', message: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleEdit = (rateType: 'PRO' | 'Normal', currentRate: number) => {
    setEditingRate(rateType);
    setEditValues({ ...editValues, [rateType]: currentRate });
  };

  const handleCancel = (rateType: 'PRO' | 'Normal') => {
    setEditingRate(null);
    const currentRate = rates.find(rate => rate.type === rateType)?.rate ?? DEFAULT_RATES.find(r => r.type === rateType)!.rate;
    setEditValues({ ...editValues, [rateType]: currentRate });
  };

  const handleSave = async (rateType: 'PRO' | 'Normal') => {
    const newRate = editValues[rateType];

    if (newRate < 0 || newRate > 100) {
      setSaveMessage({ type: 'error', message: 'La tasa de interés debe estar entre 0% y 100%' });
      return;
    }

    setIsSaving(true);

    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(investmentEndpoint, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          type: rateType.toLowerCase(),
          interestRate: newRate
        })
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'No se pudo actualizar la tasa');
      }

      const saved = (await response.json()) as ApiRate;
      const savedType = saved.type.toLowerCase() === 'pro' ? 'PRO' : 'Normal';
      setRates(prev =>
        prev.map(rate =>
          rate.type === savedType
            ? { ...rate, rate: saved.interest_rate, updatedAt: saved.updated_at }
            : rate
        )
      );
      setEditingRate(null);
      setSaveMessage({ type: 'success', message: 'Tasa actualizada correctamente' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', message: (error as Error).message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRateChange = (rateType: 'PRO' | 'Normal', value: string) => {
    const numericValue = parseFloat(value) || 0;
    setEditValues({ ...editValues, [rateType]: numericValue });
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
          <div key={rate.type} className={`card p-6 border-2 ${getRateBgColor(rate.type)}`}>
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
                  {rate.updatedAt && (
                    <p className="text-xs text-secondary-500">
                      Actualizó: {new Date(rate.updatedAt).toLocaleDateString('es-MX')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Tasa de Interés Anual
                </label>
                {editingRate === rate.type ? (
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        className="input-field pr-8"
                        value={editValues[rate.type] || ''}
                        onChange={(e) => handleRateChange(rate.type, e.target.value)}
                        placeholder="0.00"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
                        %
                      </span>
                    </div>
                    <button
                      onClick={() => handleSave(rate.type)}
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
                      onClick={() => handleCancel(rate.type)}
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
                      onClick={() => handleEdit(rate.type, rate.rate)}
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



