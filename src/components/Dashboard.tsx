import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TransactionForm from './TransactionForm';
import { 
  DollarSign, 
  Users, 
  ShoppingCart,
  CreditCard,
  BarChart3
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'transactions':
        return <TransactionForm />;
      case 'customers':
        return <CustomersSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'inventory':
        return <InventorySection />;
      case 'reports':
        return <ReportsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-secondary-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Transactions',
      value: '2,350',
      change: '+180.1%',
      changeType: 'positive',
      icon: CreditCard,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Active Customers',
      value: '1,234',
      change: '+19%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Products Sold',
      value: '12,234',
      change: '+201',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard Overview</h1>
        <p className="text-secondary-600">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-secondary-600 ml-2">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {[
              { name: 'John Doe', amount: '$299.00', status: 'Completed', time: '2 min ago' },
              { name: 'Jane Smith', amount: '$199.00', status: 'Pending', time: '5 min ago' },
              { name: 'Mike Johnson', amount: '$599.00', status: 'Completed', time: '10 min ago' },
              { name: 'Sarah Wilson', amount: '$399.00', status: 'Failed', time: '15 min ago' }
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900">{transaction.name}</p>
                  <p className="text-sm text-secondary-600">{transaction.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-secondary-900">{transaction.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors duration-200">
              <CreditCard className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-primary-700">New Transaction</p>
            </button>
            <button className="p-4 bg-secondary-50 hover:bg-secondary-100 rounded-lg text-center transition-colors duration-200">
              <Users className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-secondary-700">Add Customer</p>
            </button>
            <button className="p-4 bg-secondary-50 hover:bg-secondary-100 rounded-lg text-center transition-colors duration-200">
              <ShoppingCart className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-secondary-700">Manage Inventory</p>
            </button>
            <button className="p-4 bg-secondary-50 hover:bg-secondary-100 rounded-lg text-center transition-colors duration-200">
              <BarChart3 className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-secondary-700">View Analytics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other sections
const CustomersSection: React.FC = () => (
  <div className="card p-6">
    <h2 className="text-xl font-semibold text-secondary-900 mb-4">Customers Management</h2>
    <p className="text-secondary-600">Customer management features coming soon...</p>
  </div>
);

const AnalyticsSection: React.FC = () => (
  <div className="card p-6">
    <h2 className="text-xl font-semibold text-secondary-900 mb-4">Analytics & Reports</h2>
    <p className="text-secondary-600">Analytics dashboard coming soon...</p>
  </div>
);

const InventorySection: React.FC = () => (
  <div className="card p-6">
    <h2 className="text-xl font-semibold text-secondary-900 mb-4">Inventory Management</h2>
    <p className="text-secondary-600">Inventory management features coming soon...</p>
  </div>
);

const ReportsSection: React.FC = () => (
  <div className="card p-6">
    <h2 className="text-xl font-semibold text-secondary-900 mb-4">Reports</h2>
    <p className="text-secondary-600">Reporting features coming soon...</p>
  </div>
);

const SettingsSection: React.FC = () => (
  <div className="card p-6">
    <h2 className="text-xl font-semibold text-secondary-900 mb-4">Settings</h2>
    <p className="text-secondary-600">Settings panel coming soon...</p>
  </div>
);

export default Dashboard;
