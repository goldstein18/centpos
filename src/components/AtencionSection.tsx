import React, { useState } from 'react';
import { 
  HeadphonesIcon, 
  User, 
  Phone, 
  Search,
  DollarSign,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Wallet,
  Eye,
  EyeOff,
  Filter
} from 'lucide-react';

interface CustomerInfo {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  registrationDate: string;
}

interface BalanceInfo {
  totalBalance: number;
  availableBalance: number;
  investedBalance: number;
  availableReturns: number;
  totalReturns: number;
}

interface Investment {
  id: string;
  amount: number;
  date: string;
  term: string;
  status: 'active' | 'completed';
  returns: number;
}

interface Deposit {
  id: string;
  amount: number;
  date: string;
  reference: string;
  status: 'completed' | 'pending';
}

interface Purchase {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'available_balance' | 'returns';
}

const AtencionSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'abonos' | 'inversiones' | 'saldo'>('general');
  const [searchPhone, setSearchPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [customerFound, setCustomerFound] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  // Date ranges for filters
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Mock data
  const [customerInfo] = useState<CustomerInfo>({
    id: '1',
    name: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@email.com',
    phone: '5512345678',
    dateOfBirth: '1990-05-15',
    address: 'Av. Principal 123',
    city: 'Ciudad de México',
    state: 'CDMX',
    zipCode: '12345',
    registrationDate: '2024-01-15'
  });

  const [balanceInfo] = useState<BalanceInfo>({
    totalBalance: 25000.00,
    availableBalance: 15000.00,
    investedBalance: 10000.00,
    availableReturns: 2500.00,
    totalReturns: 3500.00
  });

  const [investments] = useState<Investment[]>([
    {
      id: '1',
      amount: 5000.00,
      date: '2024-01-20',
      term: '12 meses',
      status: 'active',
      returns: 1200.00
    },
    {
      id: '2',
      amount: 3000.00,
      date: '2024-02-15',
      term: '6 meses',
      status: 'active',
      returns: 800.00
    },
    {
      id: '3',
      amount: 2000.00,
      date: '2024-03-01',
      term: '3 meses',
      status: 'active',
      returns: 500.00
    }
  ]);

  const [deposits] = useState<Deposit[]>([
    {
      id: '1',
      amount: 10000.00,
      date: '2024-01-15',
      reference: 'REF001',
      status: 'completed'
    },
    {
      id: '2',
      amount: 8000.00,
      date: '2024-02-10',
      reference: 'REF002',
      status: 'completed'
    },
    {
      id: '3',
      amount: 7000.00,
      date: '2024-03-05',
      reference: 'REF003',
      status: 'completed'
    }
  ]);

  const [purchases] = useState<Purchase[]>([
    {
      id: '1',
      amount: 2500.00,
      date: '2024-02-20',
      description: 'Compra con saldo disponible',
      type: 'available_balance'
    },
    {
      id: '2',
      amount: 1000.00,
      date: '2024-03-10',
      description: 'Compra con rendimientos',
      type: 'returns'
    }
  ]);

  const handleSearchCustomer = async () => {
    if (!searchPhone.trim()) {
      alert('Por favor ingresa un número de teléfono para buscar');
      return;
    }

    setIsSearching(true);
    
    try {
      // Simular búsqueda en API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular datos encontrados (en producción esto vendría de la API)
      if (searchPhone === '5512345678') {
        setCustomerFound(true);
        alert('Cliente encontrado exitosamente');
      } else {
        setCustomerFound(false);
        alert('No se encontró ningún cliente con ese número de teléfono');
      }
    } catch (error) {
      alert('Error al buscar cliente. Intenta nuevamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  const tabs = [
    {
      id: 'general',
      label: 'Información General',
      icon: User,
      description: 'Datos del cliente y balance general'
    },
    {
      id: 'abonos',
      label: 'Abonos',
      icon: CreditCard,
      description: 'Historial de abonos por fecha'
    },
    {
      id: 'inversiones',
      label: 'Inversiones',
      icon: TrendingUp,
      description: 'Inversiones activas y completadas'
    },
    {
      id: 'saldo',
      label: 'Saldo Disponible',
      icon: Wallet,
      description: 'Saldo y rendimientos disponibles'
    }
  ];

  const renderGeneralSection = () => (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Balance Total</p>
              <p className="text-xl font-bold text-secondary-900">
                {showBalance ? formatCurrency(balanceInfo.totalBalance) : '••••••'}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Saldo Disponible</p>
              <p className="text-xl font-bold text-green-600">
                {showBalance ? formatCurrency(balanceInfo.availableBalance) : '••••••'}
              </p>
            </div>
            <Wallet className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Invertido</p>
              <p className="text-xl font-bold text-blue-600">
                {showBalance ? formatCurrency(balanceInfo.investedBalance) : '••••••'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Rendimientos</p>
              <p className="text-xl font-bold text-orange-600">
                {showBalance ? formatCurrency(balanceInfo.availableReturns) : '••••••'}
              </p>
            </div>
            <PiggyBank className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Show/Hide Balance Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="btn-secondary flex items-center space-x-2"
        >
          {showBalance ? (
            <>
              <EyeOff className="h-4 w-4" />
              <span>Ocultar Saldos</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>Mostrar Saldos</span>
            </>
          )}
        </button>
      </div>

      {/* Customer Information */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Información del Cliente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Nombre Completo</label>
            <input
              type="text"
              className="input-field bg-secondary-50"
              value={`${customerInfo.name} ${customerInfo.lastName}`}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Teléfono</label>
            <input
              type="tel"
              className="input-field bg-secondary-50"
              value={customerInfo.phone}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              className="input-field bg-secondary-50"
              value={customerInfo.email}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Fecha de Registro</label>
            <input
              type="text"
              className="input-field bg-secondary-50"
              value={formatDate(customerInfo.registrationDate)}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Fecha de Nacimiento</label>
            <input
              type="text"
              className="input-field bg-secondary-50"
              value={formatDate(customerInfo.dateOfBirth)}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Código Postal</label>
            <input
              type="text"
              className="input-field bg-secondary-50"
              value={customerInfo.zipCode}
              disabled
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 mb-2">Dirección</label>
            <input
              type="text"
              className="input-field bg-secondary-50"
              value={customerInfo.address}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Ciudad</label>
            <input
              type="text"
              className="input-field bg-secondary-50"
              value={customerInfo.city}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Estado</label>
            <input
              type="text"
              className="input-field bg-secondary-50"
              value={customerInfo.state}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAbonosSection = () => (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Filtro por Fechas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Fecha Inicio</label>
            <input
              type="date"
              className="input-field"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Fecha Fin</label>
            <input
              type="date"
              className="input-field"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <button className="btn-primary flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtrar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deposits List */}
      <div className="card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Historial de Abonos</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Fecha</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Referencia</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Monto</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => (
                <tr key={deposit.id} className="border-b border-secondary-100">
                  <td className="py-3 px-4 text-sm text-secondary-900">{formatDate(deposit.date)}</td>
                  <td className="py-3 px-4 text-sm text-secondary-900">{deposit.reference}</td>
                  <td className="py-3 px-4 text-sm font-medium text-green-600">{formatCurrency(deposit.amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      deposit.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {deposit.status === 'completed' ? 'Completado' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-secondary-700">Total de Abonos:</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(deposits.reduce((sum, deposit) => sum + deposit.amount, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInversionesSection = () => (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Filtro por Fechas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Fecha Inicio</label>
            <input
              type="date"
              className="input-field"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Fecha Fin</label>
            <input
              type="date"
              className="input-field"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <button className="btn-primary flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtrar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Investments List */}
      <div className="card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Inversiones Activas</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Fecha</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Monto</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Plazo</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Rendimientos</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((investment) => (
                <tr key={investment.id} className="border-b border-secondary-100">
                  <td className="py-3 px-4 text-sm text-secondary-900">{formatDate(investment.date)}</td>
                  <td className="py-3 px-4 text-sm font-medium text-blue-600">{formatCurrency(investment.amount)}</td>
                  <td className="py-3 px-4 text-sm text-secondary-900">{investment.term}</td>
                  <td className="py-3 px-4 text-sm font-medium text-orange-600">{formatCurrency(investment.returns)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      investment.status === 'active' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {investment.status === 'active' ? 'Activa' : 'Completada'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-secondary-700">Total Invertido:</span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(investments.reduce((sum, inv) => sum + inv.amount, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-secondary-700">Total Rendimientos:</span>
              <span className="text-lg font-bold text-orange-600">
                {formatCurrency(investments.reduce((sum, inv) => sum + inv.returns, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSaldoSection = () => (
    <div className="space-y-6">
      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Saldo Disponible</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Saldo Principal:</span>
              <span className="text-lg font-bold text-green-600">
                {showBalance ? formatCurrency(balanceInfo.availableBalance) : '••••••'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Rendimientos Disponibles:</span>
              <span className="text-lg font-bold text-orange-600">
                {showBalance ? formatCurrency(balanceInfo.availableReturns) : '••••••'}
              </span>
            </div>
            <div className="border-t border-secondary-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-secondary-700">Total Disponible:</span>
                <span className="text-xl font-bold text-primary-600">
                  {showBalance ? formatCurrency(balanceInfo.availableBalance + balanceInfo.availableReturns) : '••••••'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Resumen de Compras</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Con Saldo Disponible:</span>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(purchases.filter(p => p.type === 'available_balance').reduce((sum, p) => sum + p.amount, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Con Rendimientos:</span>
              <span className="text-sm font-medium text-orange-600">
                {formatCurrency(purchases.filter(p => p.type === 'returns').reduce((sum, p) => sum + p.amount, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Purchases List */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Historial de Compras</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Fecha</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Descripción</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Monto</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="border-b border-secondary-100">
                  <td className="py-3 px-4 text-sm text-secondary-900">{formatDate(purchase.date)}</td>
                  <td className="py-3 px-4 text-sm text-secondary-900">{purchase.description}</td>
                  <td className="py-3 px-4 text-sm font-medium text-red-600">{formatCurrency(purchase.amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      purchase.type === 'available_balance' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {purchase.type === 'available_balance' ? 'Saldo Disponible' : 'Rendimientos'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <HeadphonesIcon className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">Atención a Clientes</h2>
            <p className="text-sm text-secondary-500">Consulta información general, abonos, inversiones y saldos</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">Buscar Cliente</h3>
            <p className="text-sm text-secondary-500">Ingresa el número de teléfono para consultar información</p>
          </div>
          {customerFound && (
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center">
              <User className="h-3 w-3 mr-1" />
              Cliente Encontrado
            </span>
          )}
        </div>
        
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="tel"
              className="input-field pl-10"
              placeholder="Ej: 5512345678"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              maxLength={10}
            />
          </div>
          <button
            onClick={handleSearchCustomer}
            disabled={isSearching || !searchPhone.trim()}
            className="btn-primary flex items-center space-x-2 px-6"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Buscando...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Buscar</span>
              </>
            )}
          </button>
        </div>
        
        {customerFound && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Cliente: <strong>{customerInfo.name} {customerInfo.lastName}</strong> - {customerInfo.phone}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="card p-6">
        <div className="flex space-x-1 bg-secondary-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="card p-6">
        {!customerFound ? (
          <div className="text-center py-12">
            <HeadphonesIcon className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No hay cliente seleccionado</h3>
            <p className="text-secondary-600 mb-4">Busca un cliente por número de teléfono para consultar su información</p>
            <div className="text-sm text-secondary-500">
              <p>📱 Número de prueba: <strong>5512345678</strong></p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'general' && renderGeneralSection()}
            {activeTab === 'abonos' && renderAbonosSection()}
            {activeTab === 'inversiones' && renderInversionesSection()}
            {activeTab === 'saldo' && renderSaldoSection()}
          </>
        )}
      </div>
    </div>
  );
};

export default AtencionSection;
