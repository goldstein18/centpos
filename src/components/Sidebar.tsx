import React from 'react';
import { 
  Home, 
  CreditCard, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  User,
  DollarSign,
  ShoppingCart,
  FileText,
  Bell
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory', icon: ShoppingCart },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-soft h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-secondary-900">CentPOS</h1>
            <p className="text-sm text-secondary-500">Fintech Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-secondary-400'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-secondary-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 bg-secondary-200 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-secondary-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-900">Admin User</p>
            <p className="text-xs text-secondary-500">admin@centpos.com</p>
          </div>
          <button className="p-1 text-secondary-400 hover:text-secondary-600">
            <Bell className="h-4 w-4" />
          </button>
        </div>
        
        <button className="w-full flex items-center space-x-3 px-4 py-2 text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 rounded-lg transition-colors duration-200">
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

