import React, { useState } from 'react';
import { CreditCard, User, Package, DollarSign, Calendar } from 'lucide-react';

const TransactionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    amount: '',
    paymentMethod: 'card',
    productName: '',
    quantity: '1',
    notes: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('¡Pago procesado exitosamente!');
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        amount: '',
        paymentMethod: 'card',
        productName: '',
        quantity: '1',
        notes: ''
      });
    }, 2000);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-secondary-900">Nuevo Abono</h2>
          <p className="text-sm text-secondary-500">Procesar un nuevo pago</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-secondary-900 flex items-center space-x-2">
            <User className="h-5 w-5 text-primary-600" />
            <span>Información del Cliente</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Nombre del Cliente *
              </label>
              <input
                type="text"
                name="customerName"
                required
                className="input-field"
                                  placeholder="Ingresa el nombre del cliente"
                value={formData.customerName}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="customerEmail"
                className="input-field"
                placeholder="customer@example.com"
                value={formData.customerEmail}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Número de Teléfono
              </label>
              <input
                type="tel"
                name="customerPhone"
                className="input-field"
                placeholder="+1 (555) 123-4567"
                value={formData.customerPhone}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Método de Pago *
              </label>
              <select
                name="paymentMethod"
                required
                className="input-field"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="card">Tarjeta de Crédito/Débito</option>
                <option value="cash">Efectivo</option>
                <option value="mobile">Pago Móvil</option>
                <option value="bank">Transferencia Bancaria</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-secondary-900 flex items-center space-x-2">
            <Package className="h-5 w-5 text-primary-600" />
            <span>Información del Producto</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="productName"
                required
                className="input-field"
                                  placeholder="Ingresa el nombre del producto"
                value={formData.productName}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Cantidad *
              </label>
              <input
                type="number"
                name="quantity"
                required
                min="1"
                className="input-field"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Monto ($) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type="number"
                  name="amount"
                  required
                  step="0.01"
                  min="0"
                  className="input-field pl-10"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-secondary-900 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary-600" />
            <span>Información Adicional</span>
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Notas
            </label>
            <textarea
              name="notes"
              rows={3}
              className="input-field resize-none"
              placeholder="Agrega notas adicionales sobre esta transacción..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
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
                Processing...
              </>
            ) : (
                              'Procesar Pago'
            )}
          </button>
          
          <button
            type="button"
            className="btn-secondary flex-1"
            onClick={() => {
              setFormData({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                amount: '',
                paymentMethod: 'card',
                productName: '',
                quantity: '1',
                notes: ''
              });
            }}
          >
            Limpiar Formulario
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
