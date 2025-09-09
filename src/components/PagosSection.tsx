import React, { useState } from 'react';
import { 
  DollarSign, 
  Phone, 
  Shield, 
  CheckCircle, 
  X, 
  Send,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';

const PagosSection: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'amount' | 'otp' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmAmount, setConfirmAmount] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showAmount, setShowAmount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatAmount = (value: string) => {
    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue === '') return '';
    
    // Convert to decimal (divide by 100)
    const decimalValue = parseInt(numericValue) / 100;
    
    // Format as currency
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(decimalValue);
  };

  const formatAmountInput = (value: string) => {
    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue === '') return '';
    
    // Convert to decimal (divide by 100)
    const decimalValue = parseInt(numericValue) / 100;
    
    // Format as currency for input display
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(decimalValue);
  };

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
    
    setStep('amount');
  };

  const handleAmountSubmit = () => {
    if (!amount.trim() || !confirmAmount.trim()) {
      alert('Por favor completa ambos campos de monto');
      return;
    }
    
    if (amount !== confirmAmount) {
      alert('Los montos no coinciden');
      return;
    }
    
    // Check if amount is greater than 0
    const numericAmount = parseFloat(amount.replace(/[^\d.]/g, ''));
    if (numericAmount <= 0) {
      alert('El monto debe ser mayor a $0.00');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 2000);
  };

  const handleOtpSubmit = () => {
    if (!otpCode.trim()) {
      alert('Por favor ingresa el código OTP');
      return;
    }
    
    if (otpCode.length !== 6) {
      alert('El código OTP debe tener 6 dígitos');
      return;
    }
    
    // Simulate OTP verification
    if (otpCode === '123456') {
      setStep('success');
    } else {
      alert('Código OTP incorrecto. Intenta nuevamente.');
    }
  };

  const handleReset = () => {
    setStep('phone');
    setPhoneNumber('');
    setConfirmPhone('');
    setAmount('');
    setConfirmAmount('');
    setOtpCode('');
    setShowAmount(false);
    setIsProcessing(false);
  };

  const renderPhoneStep = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <div className="h-12 w-12 sm:h-16 sm:w-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-2">Verificación de Teléfono</h3>
        <p className="text-sm sm:text-base text-secondary-600">Ingresa el número de teléfono del cliente dos veces para confirmar</p>
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
          className="btn-primary flex items-center space-x-2 text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Continuar</span>
        </button>
      </div>
    </div>
  );

  const renderAmountStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">Monto a Pagar</h3>
        <p className="text-secondary-600">Ingresa el monto dos veces para confirmar</p>
      </div>


      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Monto</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              className="input-field pl-10 pr-10"
              placeholder="$0.00"
              value={formatAmountInput(amount)}
              onChange={(e) => {
                // Extract numeric value from formatted string
                const numericValue = e.target.value.replace(/[^\d]/g, '');
                setAmount(numericValue);
              }}
            />
            <button
              onClick={() => setShowAmount(!showAmount)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
            >
              {showAmount ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-secondary-500 mt-1">
            Ejemplo: Para $10.00 ingresa 1000, para $1.50 ingresa 150
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Confirmar Monto</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="$0.00"
              value={formatAmountInput(confirmAmount)}
              onChange={(e) => {
                // Extract numeric value from formatted string
                const numericValue = e.target.value.replace(/[^\d]/g, '');
                setConfirmAmount(numericValue);
              }}
            />
          </div>
        </div>

        {amount && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Monto ingresado: <strong>{formatAmount(amount)}</strong>
              </span>
            </div>
          </div>
        )}
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
          onClick={handleAmountSubmit}
          disabled={!amount || !confirmAmount || isProcessing}
          className="btn-primary flex items-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Procesar Pago</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="h-16 w-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">Verificación OTP</h3>
        <p className="text-secondary-600">Se ha enviado un código de verificación al cliente</p>
      </div>

      <div className="card p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Código OTP</label>
            <input
              type="text"
              className="input-field text-center text-lg font-mono"
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Código de prueba: <strong>123456</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep('amount')}
          className="btn-secondary flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Regresar</span>
        </button>
        <button
          onClick={handleOtpSubmit}
          disabled={!otpCode}
          className="btn-primary flex items-center space-x-2"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Verificar OTP</span>
        </button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">¡Pago Exitoso!</h3>
        <p className="text-secondary-600">El pago se ha procesado correctamente</p>
      </div>

      <div className="card p-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-secondary-600">Teléfono:</span>
            <span className="font-medium">{phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Monto:</span>
            <span className="font-medium">{formatAmount(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Fecha:</span>
            <span className="font-medium">{new Date().toLocaleDateString('es-MX')}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleReset}
          className="btn-primary flex items-center space-x-2"
        >
          <DollarSign className="h-4 w-4" />
          <span>Nuevo Pago</span>
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
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-secondary-900">Pagos</h2>
            <p className="text-xs sm:text-sm text-secondary-500">Transferencias y pagos en sucursal</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
          <div className={`flex items-center space-x-2 ${step === 'phone' ? 'text-primary-600' : step === 'amount' || step === 'otp' || step === 'success' ? 'text-green-600' : 'text-secondary-400'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'phone' ? 'bg-primary-100' : step === 'amount' || step === 'otp' || step === 'success' ? 'bg-green-100' : 'bg-secondary-100'}`}>
              <Phone className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Teléfono</span>
          </div>
          
          <div className={`h-1 w-8 sm:w-16 ${step === 'amount' || step === 'otp' || step === 'success' ? 'bg-green-500' : 'bg-secondary-200'}`}></div>
          
          <div className={`flex items-center space-x-2 ${step === 'amount' ? 'text-primary-600' : step === 'otp' || step === 'success' ? 'text-green-600' : 'text-secondary-400'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'amount' ? 'bg-primary-100' : step === 'otp' || step === 'success' ? 'bg-green-100' : 'bg-secondary-100'}`}>
              <DollarSign className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Monto</span>
          </div>
          
          <div className={`h-1 w-8 sm:w-16 ${step === 'otp' || step === 'success' ? 'bg-green-500' : 'bg-secondary-200'}`}></div>
          
          <div className={`flex items-center space-x-2 ${step === 'otp' ? 'text-primary-600' : step === 'success' ? 'text-green-600' : 'text-secondary-400'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'otp' ? 'bg-primary-100' : step === 'success' ? 'bg-green-100' : 'bg-secondary-100'}`}>
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">OTP</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="card p-4 sm:p-6">
        {step === 'phone' && renderPhoneStep()}
        {step === 'amount' && renderAmountStep()}
        {step === 'otp' && renderOtpStep()}
        {step === 'success' && renderSuccessStep()}
      </div>
    </div>
  );
};

export default PagosSection;
