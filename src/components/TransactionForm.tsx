import React, { useState } from 'react';
import { CreditCard, Phone, DollarSign } from 'lucide-react';
import { getAuthToken, getUserInfo } from '../lib/auth';

const TransactionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    phone1: '',
    phone2: '',
    amount1: '',
    amount2: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const normalizeAmountInput = (value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    const [integerPart, ...decimalParts] = sanitized.split('.');
    const decimalPart = decimalParts.join('').slice(0, 2);

    return sanitized.includes('.') ? `${integerPart}.${decimalPart}` : integerPart;
  };

  const parseAmount = (value: string) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : NaN;
  };

  const formatAmount = (value: string) => {
    const amount = parseAmount(value);
    return Number.isFinite(amount) ? amount.toFixed(2) : '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isAmountField = name === 'amount1' || name === 'amount2';
    if (isAmountField && value.includes(',')) {
      return;
    }

    const cleanValue = isAmountField
      ? normalizeAmountInput(value)
      : value.replace(/[^0-9]/g, '');
    
    setFormData(prev => ({
      ...prev,
      [name]: cleanValue
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAmountBlur = (field: 'amount1' | 'amount2') => {
    setFormData(prev => ({
      ...prev,
      [field]: formatAmount(prev[field])
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    const amount1 = parseAmount(formData.amount1);
    const amount2 = parseAmount(formData.amount2);

    // Validar teléfono
    if (formData.phone1 !== formData.phone2) {
      newErrors.phone2 = 'Los números de teléfono no coinciden';
    }
    if (formData.phone1.length < 10) {
      newErrors.phone1 = 'El número debe tener al menos 10 dígitos';
    }
    if (!/^\d{10}$/.test(formData.phone1)) {
      newErrors.phone1 = 'El número debe tener exactamente 10 dígitos numéricos';
    }

    if (!Number.isFinite(amount1) || amount1 <= 0) {
      newErrors.amount1 = 'El monto debe ser mayor a 0';
    }
    if (!Number.isFinite(amount2) || amount2 <= 0) {
      newErrors.amount2 = 'Confirma un monto mayor a 0';
    }
    if (Number.isFinite(amount1) && Number.isFinite(amount2) && amount1 !== amount2) {
      newErrors.amount2 = 'Los montos no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      const finalAmount = formatAmount(formData.amount1);
      
      // Obtener información del usuario para asociar el abono
      const userInfo = getUserInfo();
      const branch_id = userInfo?.branch_id;
      const user_id = userInfo?.id || userInfo?.user_id;
      
      const requestBody: any = {
        telefono: formData.phone1,
        telefonoConfirmacion: formData.phone2,
        monto: parseFloat(finalAmount),
        montoConfirmacion: parseFloat(finalAmount)
      };
      
      // Agregar branch_id y user_id si están disponibles
      if (branch_id) {
        requestBody.branch_id = branch_id;
      }
      if (user_id) {
        requestBody.user_id = user_id;
        // También intentar con pos_user_id si el backend lo requiere
        requestBody.pos_user_id = user_id;
      }
      
      console.log('User info para asociar abono:', {
        branch_id,
        user_id,
        userInfo
      });
      
      const endpoint = 'https://centdos-backend-production.up.railway.app/pos/abonos';

      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log('Sending request to API:', {
        url: endpoint,
        method: 'POST',
        body: requestBody
      });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        console.log('Success response:', result);
        alert(`¡Abono registrado exitosamente!\n\nTeléfono: ${formData.phone1}\nMonto: $${finalAmount}\nAutorización: ${result.autorizacion || result.autorización || 'N/A'}`);
        
        // Limpiar formulario
        setFormData({
          phone1: '',
          phone2: '',
          amount1: '',
          amount2: ''
        });
        setErrors({});
      } else {
        // Intentar obtener el mensaje de error del servidor
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        let errorData: any = {};
        
        try {
          const responseText = await response.text();
          console.error('Error response text:', responseText);
          
          if (responseText) {
            try {
              errorData = JSON.parse(responseText);
              console.error('Error response JSON:', errorData);
            } catch (e) {
              // Si no es JSON, usar el texto directamente
              errorData = { message: responseText, raw: responseText };
            }
          }
        } catch (e) {
          console.error('Error reading error response:', e);
        }
        
        console.error('API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          requestBody: requestBody
        });
        
        // Construir mensaje de error más descriptivo
        errorMessage = errorData.message 
          || errorData.error 
          || errorData.raw
          || errorData.details
          || `Error ${response.status}: ${response.statusText}`;
        
        // Mensajes específicos según el código de estado
        if (response.status === 500) {
          errorMessage = `Error del servidor (500): ${errorMessage}\n\nEl servidor encontró un error interno. Por favor, verifica:\n- Que los datos enviados sean correctos\n- Que el servidor esté funcionando correctamente\n\nDetalles técnicos: ${JSON.stringify(errorData, null, 2)}`;
        } else if (response.status === 400) {
          errorMessage = `Error de validación (400): ${errorMessage}\n\nPor favor, verifica que todos los campos sean correctos.`;
        } else if (response.status === 401) {
          errorMessage = `No autorizado (401): Por favor, inicia sesión nuevamente.`;
        } else if (response.status === 403) {
          errorMessage = `Acceso denegado (403): No tienes permisos para realizar esta operación.`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error al registrar abono:', error);
      alert(`Error al registrar el abono: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearForm = () => {
    setFormData({
      phone1: '',
      phone2: '',
      amount1: '',
      amount2: ''
    });
    setErrors({});
  };

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-center space-x-3 mb-4 sm:mb-6">
        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-[#f0fdfd] rounded-lg flex items-center justify-center">
          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-[#3bbcc8]" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-secondary-900">Registrar Abono</h2>
          <p className="text-xs sm:text-sm text-secondary-500">Registra un nuevo abono al sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Número de Teléfono */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-medium text-secondary-900 flex items-center space-x-2">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[#3bbcc8]" />
            <span>Número de Teléfono</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Número de Teléfono *
              </label>
              <input
                type="tel"
                name="phone1"
                required
                className={`input-field ${errors.phone1 ? 'border-red-500' : ''}`}
                placeholder="Ej: 5512345678"
                value={formData.phone1}
                onChange={handleChange}
                maxLength={10}
              />
              {errors.phone1 && (
                <p className="text-red-500 text-sm mt-1">{errors.phone1}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Confirmar Número *
              </label>
              <input
                type="tel"
                name="phone2"
                required
                className={`input-field ${errors.phone2 ? 'border-red-500' : ''}`}
                placeholder="Repite el número"
                value={formData.phone2}
                onChange={handleChange}
                maxLength={10}
              />
              {errors.phone2 && (
                <p className="text-red-500 text-sm mt-1">{errors.phone2}</p>
              )}
            </div>
          </div>
        </div>

        {/* Monto a Abonar */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-medium text-secondary-900 flex items-center space-x-2">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-[#3bbcc8]" />
            <span>Monto a Abonar</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Monto ($) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type="text"
                  name="amount1"
                  required
                  className={`input-field pl-10 ${errors.amount1 ? 'border-red-500' : ''}`}
                  placeholder="Ej: 10.00"
                  value={formData.amount1}
                  onChange={handleChange}
                  onBlur={() => handleAmountBlur('amount1')}
                  inputMode="decimal"
                />
              </div>
              {errors.amount1 && (
                <p className="text-red-500 text-sm mt-1">{errors.amount1}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Confirmar Monto *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type="text"
                  name="amount2"
                  required
                  className={`input-field pl-10 ${errors.amount2 ? 'border-red-500' : ''}`}
                  placeholder="Repite el monto"
                  value={formData.amount2}
                  onChange={handleChange}
                  onBlur={() => handleAmountBlur('amount2')}
                  inputMode="decimal"
                />
              </div>
              {errors.amount2 && (
                <p className="text-red-500 text-sm mt-1">{errors.amount2}</p>
              )}
            </div>
          </div>
        </div>

        {/* Información del Sistema */}
        <div className="bg-[#f0fdfd] border border-[#3bbcc8] rounded-lg p-4">
          <h4 className="text-sm font-medium text-[#0d9488] mb-2">💡 Información del Sistema</h4>
          <ul className="text-sm text-[#0d9488] space-y-1">
            <li>• El monto acepta hasta 2 decimales</li>
            <li>• Para abonar $10.00, introduce: 10.00</li>
            <li>• Para abonar $1.50, introduce: 1.50</li>
            <li>• Para abonar $0.50, introduce: 0.50</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
          <button
            type="submit"
            disabled={isProcessing}
            className="btn-primary flex-1 flex justify-center items-center text-sm sm:text-base py-2 sm:py-3"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando...
              </>
            ) : (
              'Registrar Abono'
            )}
          </button>
          
          <button
            type="button"
            className="btn-secondary flex-1 text-sm sm:text-base py-2 sm:py-3"
            onClick={clearForm}
          >
            Limpiar Formulario
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
