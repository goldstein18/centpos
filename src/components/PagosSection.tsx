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
  Clock,
  AlertTriangle
} from 'lucide-react';
import { getUserInfo } from '../lib/auth';

const PagosSection: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'amount' | 'otp' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmAmount, setConfirmAmount] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showAmount, setShowAmount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState('');
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState<any>(null);

  const formatAmount = (value: string) => {
    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue === '') return '';
    
    // Convert to decimal (divide by 10)
    const decimalValue = parseInt(numericValue) / 10;
    
    // Format as currency
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(decimalValue);
  };

  const formatAmountInput = (value: string) => {
    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue === '') return '';
    
    // Convert to decimal (divide by 10)
    const decimalValue = parseInt(numericValue) / 10;
    
    // Format as currency for input display
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(decimalValue);
  };

  const handlePhoneSubmit = () => {
    if (!phoneNumber.trim() || !confirmPhone.trim()) {
      setError('Por favor completa ambos campos de teléfono');
      return;
    }
    
    if (phoneNumber !== confirmPhone) {
      setError('Los números de teléfono no coinciden');
      return;
    }
    
    if (phoneNumber.length !== 10 && phoneNumber.length !== 12) {
      setError('El número de teléfono debe tener 10 o 12 dígitos');
      return;
    }
    
    setError('');
    setStep('amount');
  };

  const handleAmountSubmit = () => {
    if (!amount.trim() || !confirmAmount.trim()) {
      setError('Por favor completa ambos campos de monto');
      return;
    }
    
    if (amount !== confirmAmount) {
      setError('Los montos no coinciden');
      return;
    }
    
    // Check if amount is greater than 0
    const numericAmount = parseFloat(amount.replace(/[^\d.]/g, '')) / 10; // Convert from internal format to decimal
    if (numericAmount <= 0) {
      setError('El monto debe ser mayor a $0.00');
      return;
    }
    
    setError('');
    setStep('otp');
  };

  const handleOtpSubmit = async () => {
    if (!otpCode.trim()) {
      setError('Por favor ingresa el código OTP');
      return;
    }
    
    if (otpCode.length !== 6) {
      setError('El código OTP debe tener 6 dígitos');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      // Obtener información del usuario para asociar el pago
      const userInfo = getUserInfo();
      const branch_id = userInfo?.branch_id;
      const pos_user_id = userInfo?.id || userInfo?.user_id;
      
      // Convertir el monto del formato interno (ej: 100 = $10.00) a decimal
      const numericAmount = parseFloat(amount.replace(/[^\d.]/g, '')) / 10;
      
      // Construir el request body según la documentación
      const requestBody: any = {
        phone_number: phoneNumber,
        phone_confirmation: confirmPhone,
        amount: numericAmount,
        amount_confirmation: numericAmount,
        otp: otpCode
      };
      
      // Agregar campos opcionales si están disponibles
      if (pos_user_id) {
        requestBody.pos_user_id = pos_user_id;
      }
      if (branch_id) {
        requestBody.branch_id = branch_id;
      }
      
      // Usar el mismo base URL que otros endpoints POS
      const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, '') 
        ?? 'https://centdos-backend-production.up.railway.app';
      const endpoint = `${baseUrl}/pos/pagos`;
      
      console.log('Procesando pago:', {
        endpoint,
        requestBody
      });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      
      const responseData = await response.json();
      
      console.log('Respuesta del pago:', {
        status: response.status,
        data: responseData
      });
      
      if (response.ok) {
        // Pago exitoso
        setPaymentData(responseData);
        setTransactionNumber(responseData.reference || responseData.id || 'N/A');
        setStep('success');
      } else {
        // Error del servidor
        const errorMessage = responseData.message || responseData.error || `Error ${response.status}: ${response.statusText}`;
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error al procesar pago:', err);
      setError(err instanceof Error ? err.message : 'Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
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
    setTransactionNumber('');
    setError('');
    setPaymentData(null);
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Número de Teléfono</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="tel"
              className="input-field pl-10"
              placeholder="Ej: 5512345678 o 525551234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
              maxLength={12}
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
              placeholder="Ej: 5512345678 o 525551234567"
              value={confirmPhone}
              onChange={(e) => setConfirmPhone(e.target.value.replace(/\D/g, '').slice(0, 12))}
              maxLength={12}
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
            Ejemplo: Para $10.0 ingresa 100, para $1.5 ingresa 15
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

        {/* Información del Sistema */}
        <div className="bg-[#f0fdfd] border border-[#3bbcc8] rounded-lg p-4">
          <h4 className="text-sm font-medium text-[#0d9488] mb-2">💡 Información del Sistema</h4>
          <ul className="text-sm text-[#0d9488] space-y-1">
            <li>• El monto se formatea automáticamente en el campo</li>
            <li>• Para pagar $10.0, introduce: 100</li>
            <li>• Para pagar $1.5, introduce: 15</li>
            <li>• Para pagar $0.5, introduce: 5</li>
          </ul>
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Código OTP</label>
          <input
            type="text"
            className="input-field text-center text-lg font-mono"
            placeholder="123456"
            value={otpCode}
            onChange={(e) => {
              setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
              setError(''); // Clear error when user types
            }}
            maxLength={6}
            disabled={isProcessing}
          />
          <p className="text-xs text-secondary-500 mt-1">
            Ingresa el código OTP de 6 dígitos que el cliente recibió en su app
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700">
              El código OTP es válido por 2 minutos desde su generación
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
          disabled={!otpCode || isProcessing}
          className="btn-primary flex items-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Verificar OTP</span>
            </>
          )}
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
            <span className="text-secondary-600">Referencia de Pago:</span>
            <span className="font-medium text-primary-600">{paymentData?.reference || paymentData?.id || transactionNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Teléfono:</span>
            <span className="font-medium">{paymentData?.phone_number || phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Monto:</span>
            <span className="font-medium">
              ${paymentData?.amount?.toFixed(2) || formatAmount(amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Estado:</span>
            <span className="font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              {paymentData?.status || 'Completado'}
            </span>
          </div>
          {paymentData?.created_at && (
            <div className="flex justify-between">
              <span className="text-secondary-600">Fecha:</span>
              <span className="font-medium">
                {new Date(paymentData.created_at).toLocaleString('es-MX')}
              </span>
            </div>
          )}
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
