import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  LogOut, 
  User,
  FileText,
  Bell,
  DollarSign,
  Menu,
  X,
  Ban,
  Shield,
  Percent
} from 'lucide-react';
import { getUserInfo, fetchCurrentUser, clearAuthToken, UserInfo } from '../lib/auth';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, isMobileMenuOpen, onMobileMenuToggle }) => {
  const [userInfo, setUserInfoState] = useState<UserInfo | null>(null);

  useEffect(() => {
    // Obtener información del usuario al cargar
    const loadUserInfo = async () => {
      const cached = getUserInfo();
      if (cached && (cached.name || cached.email)) {
        setUserInfoState(cached);
      } else {
        // Si no hay información en cache, intentar obtenerla del servidor
        const fetched = await fetchCurrentUser();
        if (fetched) {
          setUserInfoState(fetched);
        }
      }
    };

    loadUserInfo();
  }, []);

  const navigationItems = [
    { id: 'abonos', label: 'Abonos', icon: CreditCard },
    { id: 'pagos', label: 'Pagos', icon: DollarSign },
    { id: 'cancelar', label: 'Cancelar Abonos', icon: Ban },
    { id: 'seguros', label: 'Seguros', icon: Shield, hidden: true },
    { id: 'tasas', label: 'Tasas de Interés', icon: Percent, hidden: true },
    { id: 'reportes', label: 'Reportes', icon: FileText },
  ].filter(item => !item.hidden);

  const handleLogout = () => {
    clearAuthToken();
    window.location.href = '/login';
  };

  const handleSectionChange = (sectionId: string) => {
    onSectionChange(sectionId);
    // Close mobile menu when a section is selected
    if (isMobileMenuOpen) {
      onMobileMenuToggle();
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-secondary-200"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-secondary-600" />
        ) : (
          <Menu className="h-6 w-6 text-secondary-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onMobileMenuToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white shadow-soft h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-secondary-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 lg:h-10 lg:w-10">
              <img src="/logo.png" alt="CENTPOS Logo" className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-secondary-900">CENTPOS</h1>
              <p className="text-xs lg:text-sm text-secondary-500">Sistema de Abonos</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors duration-200 ${
                  isActive
                    ? 'bg-[#f0fdfd] text-[#0d9488] border-r-2 border-[#3bbcc8]'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                }`}
              >
                <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${isActive ? 'text-[#3bbcc8]' : 'text-secondary-400'}`} />
                <span className="text-sm lg:text-base font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-3 lg:p-4 border-t border-secondary-200">
          <div className="flex items-center space-x-3 mb-3 lg:mb-4">
            <div className="h-8 w-8 lg:h-10 lg:w-10 bg-secondary-200 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 lg:h-5 lg:w-5 text-secondary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm font-medium text-secondary-900 truncate">
                {userInfo?.name || userInfo?.nombre || 'Usuario'}
              </p>
              <p className="text-xs text-secondary-500 truncate">
                {userInfo?.email || userInfo?.correo || 'usuario@centpos.com'}
              </p>
            </div>
            <button className="p-1 text-secondary-400 hover:text-secondary-600">
              <Bell className="h-3 w-3 lg:h-4 lg:w-4" />
            </button>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 lg:px-4 py-2 text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 rounded-lg transition-colors duration-200"
          >
            <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="text-xs lg:text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

