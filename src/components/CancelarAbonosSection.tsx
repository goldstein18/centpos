import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Ban,
  Clock,
  DollarSign,
  ArrowLeft
} from 'lucide-react';
import { getUserInfo } from '../lib/auth';

interface Transaction {
  id: string;
  type: 'deposit' | 'payment';
  amount: number;
  reference: string;
  description: string;
  status: string;
  created_at: string;
  pos_user_id?: string | null;
  branch_id?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
}

interface TransactionsResponse {
  phone_number: string;
  user_id: string;
  transactions: Transaction[];
  total: number;
}

interface ErrorResponse {
  statusCode?: number;
  message?: string;
  error?: string;
}

interface CancelResponse {
  success: boolean;
  cancelled_transaction: {
    id: string;
    type: string;
    amount: number;
    reference: string;
  };
  cancel_reference: string;
  message: string;
}

const CancelarAbonosSection: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'transactions' | 'otp' | 'result'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CancelResponse | null>(null);

  const handlePhoneSubmit = async () => {
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
    
    setIsProcessing(true);
    setError('');
    
    try {
      const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, '') 
        ?? 'https://centdos-backend-production.up.railway.app';
      const endpoint = `${baseUrl}/pos/cancelaciones/transacciones`;
      
      console.log('Buscando transacciones recientes:', {
        endpoint,
        phone_number: phoneNumber
      });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          phone_number: phoneNumber,
          phone_confirmation: confirmPhone
        })
      });
      
      const responseData: TransactionsResponse | ErrorResponse = await response.json();
      
      console.log('Respuesta de transacciones:', {
        status: response.status,
        data: responseData
      });
      
      if (response.ok) {
        const successData = responseData as TransactionsResponse;
        if (successData.transactions && successData.transactions.length > 0) {
          setTransactions(successData.transactions);
          setStep('transactions');
        } else {
          setError('No se encontraron transacciones recientes (últimos 30 minutos) para este número de teléfono');
        }
      } else {
        const errorData = responseData as ErrorResponse;
        const errorMessage = errorData.message || errorData.error || `Error ${response.status}: ${response.statusText}`;
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error al buscar transacciones:', err);
      setError(err instanceof Error ? err.message : 'Error al buscar transacciones. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransactionSelect = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
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
    
    if (!selectedTransaction) {
      setError('No se ha seleccionado una transacción');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const userInfo = getUserInfo();
      const branch_id = userInfo?.branch_id;
      const pos_user_id = userInfo?.id || userInfo?.user_id;
      
      const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, '') 
        ?? 'https://centdos-backend-production.up.railway.app';
      const endpoint = `${baseUrl}/pos/cancelaciones/cancelar`;
      
      const requestBody: any = {
        phone_number: phoneNumber,
        phone_confirmation: confirmPhone,
        transaction_id: selectedTransaction.id,
        transaction_type: selectedTransaction.type,
        otp: otpCode
      };
      
      if (pos_user_id) {
        requestBody.pos_user_id = pos_user_id;
      }
      if (branch_id) {
        requestBody.branch_id = branch_id;
      }
      
      console.log('Cancelando transacción:', {
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
      
      const responseData: CancelResponse | ErrorResponse = await response.json();
      
      console.log('Respuesta de cancelación:', {
        status: response.status,
        data: responseData
      });
      
      if (response.ok) {
        const successData = responseData as CancelResponse;
        setResult(successData);
        setStep('result');
      } else {
        const errorData = responseData as ErrorResponse;
        const errorMessage = errorData.message || errorData.error || `Error ${response.status}: ${response.statusText}`;
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error al cancelar transacción:', err);
      setError(err instanceof Error ? err.message : 'Error al cancelar la transacción. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStep('phone');
    setPhoneNumber('');
    setConfirmPhone('');
    setOtpCode('');
    setSelectedTransaction(null);
    setTransactions([]);
    setIsProcessing(false);
    setError('');
    setResult(null);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPhoneStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="h-16 w-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">Verificación de Teléfono</h3>
        <p className="text-secondary-600">
          Ingresa el número de teléfono dos veces para buscar transacciones recientes que puedas cancelar
        </p>
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
              onChange={(e) => {
                setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 12));
                setError('');
              }}
              maxLength={12}
              disabled={isProcessing}
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
              onChange={(e) => {
                setConfirmPhone(e.target.value.replace(/\D/g, '').slice(0, 12));
                setError('');
              }}
              maxLength={12}
              disabled={isProcessing}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handlePhoneSubmit}
          disabled={!phoneNumber || !confirmPhone || isProcessing}
          className="btn-primary flex items-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Buscando...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Buscar Transacciones</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderTransactionsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">Transacciones Recientes</h3>
        <p className="text-secondary-600">
          Se encontraron {transactions.length} transacción(es) en los últimos 30 minutos. Selecciona la que deseas cancelar.
        </p>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <button
            key={transaction.id}
            onClick={() => handleTransactionSelect(transaction)}
            className="w-full p-4 border-2 border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'deposit' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {transaction.type === 'deposit' ? (
                    <DollarSign className={`h-5 w-5 ${transaction.type === 'deposit' ? 'text-green-600' : 'text-blue-600'}`} />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-secondary-900">
                      {transaction.type === 'deposit' ? 'Abono' : 'Pago'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-600">{transaction.reference}</p>
                  <p className="text-xs text-secondary-500">{formatDate(transaction.created_at)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-secondary-900">{formatAmount(transaction.amount)}</p>
                <p className="text-xs text-secondary-500">{transaction.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">Información importante</h4>
            <p className="text-sm text-blue-700">
              Solo se muestran transacciones de los últimos 30 minutos. Al cancelar una transacción, se revertirá el saldo del cliente.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep('phone')}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Regresar</span>
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
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">Código OTP</h3>
        <p className="text-secondary-600">
          Ingresa el código OTP de 6 dígitos que el cliente recibió en su app para confirmar la cancelación
        </p>
      </div>

      {selectedTransaction && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-secondary-600">Tipo:</span>
              <span className="font-medium">{selectedTransaction.type === 'deposit' ? 'Abono' : 'Pago'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Referencia:</span>
              <span className="font-medium">{selectedTransaction.reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Monto:</span>
              <span className="font-medium">{formatAmount(selectedTransaction.amount)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Código OTP</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              className="input-field pl-10 text-center text-lg font-mono"
              placeholder="123456"
              value={otpCode}
              onChange={(e) => {
                setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              maxLength={6}
              disabled={isProcessing}
            />
          </div>
          <p className="text-xs text-secondary-500 mt-1">
            El código OTP es válido por 2 minutos desde su generación
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700">
              El cliente debe generar el código OTP en su app (mismo sistema que para pagos)
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep('transactions')}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Regresar</span>
        </button>
        <button
          onClick={handleOtpSubmit}
          disabled={!otpCode || otpCode.length !== 6 || isProcessing}
          className="btn-primary flex items-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Cancelando...</span>
            </>
          ) : (
            <>
              <Ban className="h-4 w-4" />
              <span>Cancelar Transacción</span>
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
          {result?.success ? 'Cancelación Exitosa' : 'Error en la Cancelación'}
        </h3>
        <p className="text-secondary-600">{result?.message || 'La transacción ha sido cancelada exitosamente'}</p>
      </div>

      {result?.success && result.cancelled_transaction && (
        <div className="card p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-secondary-600">Referencia de Cancelación:</span>
              <span className="font-medium text-primary-600">{result.cancel_reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Tipo de Transacción:</span>
              <span className="font-medium">
                {result.cancelled_transaction.type === 'deposit' ? 'Abono' : 'Pago'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Referencia Original:</span>
              <span className="font-medium">{result.cancelled_transaction.reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Monto Cancelado:</span>
              <span className="font-medium">{formatAmount(result.cancelled_transaction.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Teléfono:</span>
              <span className="font-medium">{phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Estado:</span>
              <span className="font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Cancelado
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-green-800 mb-1">Cancelación completada</h4>
            <p className="text-sm text-green-700">
              {selectedTransaction?.type === 'deposit' 
                ? 'El abono ha sido revertido y el monto ha sido deducido del saldo del cliente.'
                : 'El pago ha sido revertido y el monto ha sido devuelto al saldo del cliente.'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleReset}
          className="btn-primary flex items-center space-x-2"
        >
          <Ban className="h-4 w-4" />
          <span>Nueva Cancelación</span>
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
            <h2 className="text-lg sm:text-xl font-semibold text-secondary-900">Cancelar Transacciones</h2>
            <p className="text-xs sm:text-sm text-secondary-500">Cancelar abonos y pagos realizados en los últimos 30 minutos</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 overflow-x-auto">
          <div className={`flex items-center space-x-2 ${step === 'phone' ? 'text-primary-600' : ['transactions', 'otp', 'result'].includes(step) ? 'text-green-600' : 'text-secondary-400'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'phone' ? 'bg-primary-100' : ['transactions', 'otp', 'result'].includes(step) ? 'bg-green-100' : 'bg-secondary-100'}`}>
              <Phone className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium whitespace-nowrap">Teléfono</span>
          </div>
          
          <div className={`h-1 w-8 sm:w-16 ${['transactions', 'otp', 'result'].includes(step) ? 'bg-green-500' : 'bg-secondary-200'}`}></div>
          
          <div className={`flex items-center space-x-2 ${step === 'transactions' ? 'text-primary-600' : ['otp', 'result'].includes(step) ? 'text-green-600' : 'text-secondary-400'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'transactions' ? 'bg-primary-100' : ['otp', 'result'].includes(step) ? 'bg-green-100' : 'bg-secondary-100'}`}>
              <Search className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium whitespace-nowrap">Transacciones</span>
          </div>
          
          <div className={`h-1 w-8 sm:w-16 ${['otp', 'result'].includes(step) ? 'bg-green-500' : 'bg-secondary-200'}`}></div>
          
          <div className={`flex items-center space-x-2 ${step === 'otp' ? 'text-primary-600' : step === 'result' ? 'text-green-600' : 'text-secondary-400'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'otp' ? 'bg-primary-100' : step === 'result' ? 'bg-green-100' : 'bg-secondary-100'}`}>
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium whitespace-nowrap">OTP</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="card p-4 sm:p-6">
        {step === 'phone' && renderPhoneStep()}
        {step === 'transactions' && renderTransactionsStep()}
        {step === 'otp' && renderOtpStep()}
        {step === 'result' && renderResultStep()}
      </div>
    </div>
  );
};

export default CancelarAbonosSection;
