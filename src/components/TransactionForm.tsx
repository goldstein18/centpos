import React, { useState } from 'react';
import { CreditCard, Phone, DollarSign } from 'lucide-react';

const TransactionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    phone1: '',
    phone2: '',
    amount1: '',
    amount2: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Remover el punto decimal y convertir a número
    const cleanValue = value.replace(/[^0-9]/g, '');
    
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

  const getDisplayValue = (value: string) => {
    if (!value) return '';
    const num = parseInt(value);
    return (num / 10).toFixed(1);
  };

  const formatAmount = (value: string) => {
    if (!value) return '';
    const num = parseInt(value);
    return (num / 10).toFixed(1);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validar teléfono
    if (formData.phone1 !== formData.phone2) {
      newErrors.phone2 = 'Los números de teléfono no coinciden';
    }
    if (formData.phone1.length < 10) {
      newErrors.phone1 = 'El número debe tener al menos 10 dígitos';
    }

    // Validar monto
    if (formData.amount1 !== formData.amount2) {
      newErrors.amount2 = 'Los montos no coinciden';
    }
    if (parseInt(formData.amount1) <= 0) {
      newErrors.amount1 = 'El monto debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    // Simular procesamiento
    setTimeout(() => {
      setIsProcessing(false);
      const finalAmount = formatAmount(formData.amount1);
      alert(`¡Abono registrado exitosamente!\n\nTeléfono: ${formData.phone1}\nMonto: $${finalAmount}`);
      
      // Limpiar formulario
      setFormData({
        phone1: '',
        phone2: '',
        amount1: '',
        amount2: ''
      });
      setErrors({});
    }, 2000);
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
    <div className="card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 bg-[#f0fdfd] rounded-lg flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-[#3bbcc8]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-secondary-900">Registrar Abono</h2>
          <p className="text-sm text-secondary-500">Registra un nuevo abono al sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Número de Teléfono */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-secondary-900 flex items-center space-x-2">
            <Phone className="h-5 w-5 text-[#3bbcc8]" />
            <span>Número de Teléfono</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-secondary-900 flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-[#3bbcc8]" />
            <span>Monto a Abonar</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="Ej: 100 para $10.00"
                  value={getDisplayValue(formData.amount1)}
                  onChange={handleChange}
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
                  value={getDisplayValue(formData.amount2)}
                  onChange={handleChange}
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
            <li>• El monto se formatea automáticamente en el campo</li>
            <li>• Para abonar $10.00, introduce: 100</li>
            <li>• Para abonar $1.50, introduce: 15</li>
            <li>• Para abonar $0.50, introduce: 5</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isProcessing}
            className="btn-primary flex-1 flex justify-center items-center"
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
            className="btn-secondary flex-1"
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
