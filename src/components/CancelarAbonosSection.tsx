import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Ban
} from 'lucide-react';

const CancelarAbonosSection: React.FC = () => {
  const [operation, setOperation] = useState<'cancel-pago' | 'cancel-abono' | 'status'>('cancel-pago');
  const [step, setStep] = useState<'phone' | 'authorization' | 'result'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [authorizationNumber, setAuthorizationNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handlePhoneSubmit = () => {
    if (!phoneNumber.trim() || !confirmPhone.trim()) {
      alert('Por favor completa ambos campos de teléfono');
      return;
    }
    
    if (phoneNumber !== confirmPhone) {
      alert('Los números de teléfono no coinciden');
      return;
    }
    
    if (phoneNumber.length !== 10) {
      alert('El número de teléfono debe tener 10 dígitos');
      return;
    }
    
    setStep('authorization');
  };

  const handleAuthorizationSubmit = async () => {
    if (!authorizationNumber.trim()) {
      alert('Por favor ingresa el número de autorización');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result based on operation type
      const mockResult = {
        success: Math.random() > 0.3, // 70% success rate for demo
        operation: operation,
        phone: phoneNumber,
        authorization: authorizationNumber,
        amount: '$150.0',
        date: new Date().toLocaleDateString('es-MX'),
        status: operation === 'cancel-pago' ? 'PAGO CANCELADO' : operation === 'cancel-abono' ? 'ABONO CANCELADO' : 'EXITOSO',
        message: operation === 'cancel-pago' 
          ? 'El pago ha sido cancelado exitosamente'
          : operation === 'cancel-abono'
          ? 'El abono ha sido cancelado exitosamente'
          : 'El abono se encuentra en estado exitoso'
      };
      
      setResult(mockResult);
      setStep('result');
    } catch (error) {
      alert('Error al procesar la operación. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStep('phone');
    setPhoneNumber('');
    setConfirmPhone('');
    setAuthorizationNumber('');
    setIsProcessing(false);
    setResult(null);
  };

  const renderPhoneStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="h-16 w-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">Verificación de Teléfono</h3>
        <p className="text-secondary-600">
          Ingresa el número de teléfono al que se hizo el {operation === 'cancel-pago' ? 'pago' : operation === 'cancel-abono' ? 'abono' : 'abono'} dos veces para confirmar
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Número de Teléfono</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="tel"
              className="input-field pl-10"
              placeholder="Ej: 5512345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              maxLength={10}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Confirmar Número de Teléfono</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="tel"
              className="input-field pl-10"
              placeholder="Ej: 5512345678"
              value={confirmPhone}
              onChange={(e) => setConfirmPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              maxLength={10}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handlePhoneSubmit}
          disabled={!phoneNumber || !confirmPhone}
          className="btn-primary flex items-center space-x-2"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Continuar</span>
        </button>
      </div>
    </div>
  );

  const renderAuthorizationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="h-16 w-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">Número de Autorización</h3>
        <p className="text-secondary-600">
          Ingresa el número de autorización de la {operation === 'cancel-pago' ? 'operación de pago' : operation === 'cancel-abono' ? 'operación de abono' : 'operación de abono'}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Número de Autorización</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Ej: AUTH123456"
              value={authorizationNumber}
              onChange={(e) => setAuthorizationNumber(e.target.value)}
            />
          </div>
          <p className="text-xs text-secondary-500 mt-1">
            Este número fue proporcionado al momento de la {operation === 'cancel-pago' ? 'operación de pago' : operation === 'cancel-abono' ? 'operación de abono' : 'operación de abono'}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">Información importante</h4>
              <p className="text-sm text-blue-700">
                {operation === 'cancel-pago' 
                  ? 'Al cancelar un pago, la operación será revertida y el monto será devuelto al cliente.'
                  : operation === 'cancel-abono'
                  ? 'Al cancelar un abono, la operación será revertida y el monto será devuelto al cliente.'
                  : 'El estatus te permitirá verificar si la operación fue procesada correctamente.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep('phone')}
          className="btn-secondary flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Regresar</span>
        </button>
        <button
          onClick={handleAuthorizationSubmit}
          disabled={!authorizationNumber || isProcessing}
          className="btn-primary flex items-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Procesando...</span>
            </>
            ) : (
              <>
                {operation === 'cancel-pago' ? <Ban className="h-4 w-4" /> : operation === 'cancel-abono' ? <Ban className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                <span>{operation === 'cancel-pago' ? 'Cancelar Pago' : operation === 'cancel-abono' ? 'Cancelar Abono' : 'Verificar Estatus'}</span>
              </>
            )}
        </button>
      </div>
    </div>
  );

  const renderResultStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`h-16 w-16 ${result?.success ? 'bg-green-50' : 'bg-red-50'} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {result?.success ? (
            <CheckCircle className="h-8 w-8 text-green-600" />
          ) : (
            <X className="h-8 w-8 text-red-600" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
          {result?.success ? 'Operación Exitosa' : 'Error en la Operación'}
        </h3>
        <p className="text-secondary-600">{result?.message}</p>
      </div>

      <div className="card p-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-secondary-600">Teléfono:</span>
            <span className="font-medium">{result?.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Autorización:</span>
            <span className="font-medium">{result?.authorization}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Monto:</span>
            <span className="font-medium">{result?.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Fecha:</span>
            <span className="font-medium">{result?.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Estatus:</span>
            <span className={`font-medium px-2 py-1 rounded-full text-xs ${
              result?.success 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {result?.status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleReset}
          className="btn-primary flex items-center space-x-2"
        >
          {operation === 'cancel-pago' ? <Ban className="h-4 w-4" /> : operation === 'cancel-abono' ? <Ban className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          <span>Nueva {operation === 'cancel-pago' ? 'Cancelación de Pago' : operation === 'cancel-abono' ? 'Cancelación de Abono' : 'Consulta'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <Ban className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-secondary-900">Cancelar Abonos (Pagos)</h2>
            <p className="text-xs sm:text-sm text-secondary-500">Cancelar pagos y verificar estatus de operaciones</p>
          </div>
        </div>
      </div>

      {/* Operation Selection */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-secondary-900 mb-4">Selecciona una operación</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setOperation('cancel-pago')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              operation === 'cancel-pago'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-secondary-200 bg-white text-secondary-700 hover:border-red-300 hover:bg-red-25'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Ban className="h-6 w-6" />
              <div className="text-left">
                <h4 className="font-semibold">Cancelar Pago</h4>
                <p className="text-sm opacity-75">Cancelar un pago realizado</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setOperation('cancel-abono')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              operation === 'cancel-abono'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-secondary-200 bg-white text-secondary-700 hover:border-red-300 hover:bg-red-25'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Ban className="h-6 w-6" />
              <div className="text-left">
                <h4 className="font-semibold">Cancelar Abono</h4>
                <p className="text-sm opacity-75">Cancelar un abono realizado</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setOperation('status')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              operation === 'status'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-secondary-200 bg-white text-secondary-700 hover:border-blue-300 hover:bg-blue-25'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Search className="h-6 w-6" />
              <div className="text-left">
                <h4 className="font-semibold">Estatus Abono</h4>
                <p className="text-sm opacity-75">Verificar el estatus de una operación</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
          <div className={`flex items-center space-x-2 ${step === 'phone' ? 'text-primary-600' : step === 'authorization' || step === 'result' ? 'text-green-600' : 'text-secondary-400'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'phone' ? 'bg-primary-100' : step === 'authorization' || step === 'result' ? 'bg-green-100' : 'bg-secondary-100'}`}>
              <Phone className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Teléfono</span>
          </div>
          
          <div className={`h-1 w-8 sm:w-16 ${step === 'authorization' || step === 'result' ? 'bg-green-500' : 'bg-secondary-200'}`}></div>
          
          <div className={`flex items-center space-x-2 ${step === 'authorization' ? 'text-primary-600' : step === 'result' ? 'text-green-600' : 'text-secondary-400'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'authorization' ? 'bg-primary-100' : step === 'result' ? 'bg-green-100' : 'bg-secondary-100'}`}>
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Autorización</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="card p-4 sm:p-6">
        {step === 'phone' && renderPhoneStep()}
        {step === 'authorization' && renderAuthorizationStep()}
        {step === 'result' && renderResultStep()}
      </div>
    </div>
  );
};

export default CancelarAbonosSection;
