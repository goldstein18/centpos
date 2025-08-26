import React, { useState } from 'react';
import { 
  User, 
  Edit, 
  Mail, 
  Phone, 
  Calendar,
  Save,
  X,
  CheckCircle,
  Clock,
  UserCheck,
  Shield,
  Search
} from 'lucide-react';

interface CustomerData {
  id: string;
  name: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
  investmentTerm: string;
}

const ClientesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'datos' | 'contacto' | 'plazo'>('datos');
  const [searchPhone, setSearchPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [customerFound, setCustomerFound] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    id: '1',
    name: 'Juan',
    lastName: 'Pérez',
    dateOfBirth: '1990-05-15',
    address: 'Av. Principal 123',
    city: 'Ciudad de México',
    state: 'CDMX',
    zipCode: '12345',
    email: 'juan.perez@email.com',
    phone: '5512345678',
    investmentTerm: '12 meses'
  });

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  // Form data for each section
  const [datosForm, setDatosForm] = useState({
    name: customerData.name,
    lastName: customerData.lastName,
    dateOfBirth: customerData.dateOfBirth,
    address: customerData.address,
    city: customerData.city,
    state: customerData.state,
    zipCode: customerData.zipCode
  });

  const [contactoForm, setContactoForm] = useState({
    email: customerData.email,
    phone: customerData.phone
  });

  const [plazoForm, setPlazoForm] = useState({
    investmentTerm: customerData.investmentTerm
  });

  const handleSendOTP = () => {
    setShowOTPModal(true);
    // Simular envío de OTP
    setTimeout(() => {
      setOtpCode('123456'); // En producción esto vendría del backend
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (otpCode === '123456') {
      setOtpVerified(true);
      setShowOTPModal(false);
      setOtpCode('');
      // Permitir edición
      setIsEditing(true);
    } else {
      alert('Código OTP incorrecto. Intenta nuevamente.');
    }
  };

  const handleSaveDatos = () => {
    setCustomerData({
      ...customerData,
      ...datosForm
    });
    setIsEditing(false);
    alert('Datos generales actualizados exitosamente');
  };

  const handleSaveContacto = () => {
    if (!otpVerified) {
      alert('Debes verificar el OTP antes de guardar cambios en contacto');
      return;
    }
    setCustomerData({
      ...customerData,
      ...contactoForm
    });
    setIsEditing(false);
    setOtpVerified(false);
    alert('Información de contacto actualizada exitosamente');
  };

  const handleSavePlazo = () => {
    if (!otpVerified) {
      alert('Debes verificar el OTP antes de guardar cambios en plazo');
      return;
    }
    setCustomerData({
      ...customerData,
      ...plazoForm
    });
    setIsEditing(false);
    setOtpVerified(false);
    alert('Plazo de inversión actualizado exitosamente');
  };

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
        const foundCustomer: CustomerData = {
          id: '1',
          name: 'Juan',
          lastName: 'Pérez',
          dateOfBirth: '1990-05-15',
          address: 'Av. Principal 123',
          city: 'Ciudad de México',
          state: 'CDMX',
          zipCode: '12345',
          email: 'juan.perez@email.com',
          phone: '5512345678',
          investmentTerm: '12 meses'
        };
        
        setCustomerData(foundCustomer);
        setDatosForm({
          name: foundCustomer.name,
          lastName: foundCustomer.lastName,
          dateOfBirth: foundCustomer.dateOfBirth,
          address: foundCustomer.address,
          city: foundCustomer.city,
          state: foundCustomer.state,
          zipCode: foundCustomer.zipCode
        });
        setContactoForm({
          email: foundCustomer.email,
          phone: foundCustomer.phone
        });
        setPlazoForm({
          investmentTerm: foundCustomer.investmentTerm
        });
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

  const tabs = [
    {
      id: 'datos',
      label: 'Datos Parciales',
      icon: User,
      description: 'Editar datos generales del usuario',
      requiresOTP: false
    },
    {
      id: 'contacto',
      label: 'Correo/Telefono',
      icon: Mail,
      description: 'Editar correo electrónico y teléfono',
      requiresOTP: true
    },
    {
      id: 'plazo',
      label: 'Plazo Predeterminado',
      icon: Calendar,
      description: 'Cambiar plazo de inversión',
      requiresOTP: true
    }
  ];

  const renderDatosSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900">Datos Generales del Cliente</h3>
          <p className="text-sm text-secondary-500">Información personal y de dirección</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-primary flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Nombre</label>
          <input
            type="text"
            className="input-field"
            value={datosForm.name}
            onChange={(e) => setDatosForm({ ...datosForm, name: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Apellido</label>
          <input
            type="text"
            className="input-field"
            value={datosForm.lastName}
            onChange={(e) => setDatosForm({ ...datosForm, lastName: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Fecha de Nacimiento</label>
          <input
            type="date"
            className="input-field"
            value={datosForm.dateOfBirth}
            onChange={(e) => setDatosForm({ ...datosForm, dateOfBirth: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Código Postal</label>
          <input
            type="text"
            className="input-field"
            value={datosForm.zipCode}
            onChange={(e) => setDatosForm({ ...datosForm, zipCode: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-700 mb-2">Dirección</label>
          <input
            type="text"
            className="input-field"
            value={datosForm.address}
            onChange={(e) => setDatosForm({ ...datosForm, address: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Ciudad</label>
          <input
            type="text"
            className="input-field"
            value={datosForm.city}
            onChange={(e) => setDatosForm({ ...datosForm, city: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Estado</label>
          <input
            type="text"
            className="input-field"
            value={datosForm.state}
            onChange={(e) => setDatosForm({ ...datosForm, state: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex space-x-3 pt-4">
          <button
            onClick={() => setIsEditing(false)}
            className="btn-secondary flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancelar</span>
          </button>
          <button
            onClick={handleSaveDatos}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderContactoSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900">Información de Contacto</h3>
          <p className="text-sm text-secondary-500">Correo electrónico y teléfono (requiere OTP)</p>
        </div>
        <div className="flex items-center space-x-2">
          {otpVerified && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              OTP Verificado
            </span>
          )}
          <button
            onClick={() => {
              if (!otpVerified) {
                handleSendOTP();
              } else {
                setIsEditing(!isEditing);
              }
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Correo Electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="email"
              className="input-field pl-10"
              value={contactoForm.email}
              onChange={(e) => setContactoForm({ ...contactoForm, email: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Teléfono</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="tel"
              className="input-field pl-10"
              value={contactoForm.phone}
              onChange={(e) => setContactoForm({ ...contactoForm, phone: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex space-x-3 pt-4">
          <button
            onClick={() => {
              setIsEditing(false);
              setOtpVerified(false);
            }}
            className="btn-secondary flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancelar</span>
          </button>
          <button
            onClick={handleSaveContacto}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderPlazoSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900">Plazo de Inversión</h3>
          <p className="text-sm text-secondary-500">Configurar plazo predeterminado (requiere OTP)</p>
        </div>
        <div className="flex items-center space-x-2">
          {otpVerified && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              OTP Verificado
            </span>
          )}
          <button
            onClick={() => {
              if (!otpVerified) {
                handleSendOTP();
              } else {
                setIsEditing(!isEditing);
              }
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">Plazo de Inversión</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
          <select
            className="input-field pl-10"
            value={plazoForm.investmentTerm}
            onChange={(e) => setPlazoForm({ ...plazoForm, investmentTerm: e.target.value })}
            disabled={!isEditing}
          >
            <option value="3 meses">3 meses</option>
            <option value="6 meses">6 meses</option>
            <option value="12 meses">12 meses</option>
            <option value="18 meses">18 meses</option>
            <option value="24 meses">24 meses</option>
            <option value="36 meses">36 meses</option>
          </select>
        </div>
      </div>

      {isEditing && (
        <div className="flex space-x-3 pt-4">
          <button
            onClick={() => {
              setIsEditing(false);
              setOtpVerified(false);
            }}
            className="btn-secondary flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancelar</span>
          </button>
          <button
            onClick={handleSavePlazo}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <UserCheck className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">Gestión de Clientes</h2>
            <p className="text-sm text-secondary-500">Edición parcial de datos de usuarios registrados</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">Buscar Cliente</h3>
            <p className="text-sm text-secondary-500">Ingresa el número de teléfono para buscar y editar datos</p>
          </div>
          {customerFound && (
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
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
              <UserCheck className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Cliente: <strong>{customerData.name} {customerData.lastName}</strong> - {customerData.phone}
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
                {tab.requiresOTP && (
                  <Shield className="h-3 w-3 text-orange-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="card p-6">
        {!customerFound ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No hay cliente seleccionado</h3>
            <p className="text-secondary-600 mb-4">Busca un cliente por número de teléfono para ver y editar su información</p>
            <div className="text-sm text-secondary-500">
              <p>📱 Número de prueba: <strong>5512345678</strong></p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'datos' && renderDatosSection()}
            {activeTab === 'contacto' && renderContactoSection()}
            {activeTab === 'plazo' && renderPlazoSection()}
          </>
        )}
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">Verificación OTP</h3>
                <p className="text-sm text-secondary-500">Ingresa el código de verificación</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Código OTP</label>
                <input
                  type="text"
                  className="input-field text-center text-lg font-mono"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
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

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowOTPModal(false);
                  setOtpCode('');
                }}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleVerifyOTP}
                className="btn-primary flex-1"
              >
                Verificar OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientesSection;
