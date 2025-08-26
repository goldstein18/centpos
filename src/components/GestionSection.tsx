import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Tag,
  UserCheck
} from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  alias: string;
  branches: Branch[];
}

interface Branch {
  id: string;
  name: string;
  alias: string;
  address: string;
  brandId: string;
  users: User[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'cajero' | 'administrador_caja' | 'gerente_sucursal' | 'administrador_tienda';
  branchId: string;
}

const GestionSection: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set());
  
  // Form states
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  
  // Form data
  const [brandForm, setBrandForm] = useState({ name: '', alias: '' });
  const [branchForm, setBranchForm] = useState({ name: '', alias: '', address: '', brandId: '' });
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'cajero' as const, branchId: '' });

  // Toggle expansion
  const toggleBrandExpansion = (brandId: string) => {
    const newExpanded = new Set(expandedBrands);
    if (newExpanded.has(brandId)) {
      newExpanded.delete(brandId);
    } else {
      newExpanded.add(brandId);
    }
    setExpandedBrands(newExpanded);
  };

  const toggleBranchExpansion = (branchId: string) => {
    const newExpanded = new Set(expandedBranches);
    if (newExpanded.has(branchId)) {
      newExpanded.delete(branchId);
    } else {
      newExpanded.add(branchId);
    }
    setExpandedBranches(newExpanded);
  };

  // Brand management
  const addBrand = () => {
    if (brandForm.name && brandForm.alias) {
      const newBrand: Brand = {
        id: Date.now().toString(),
        name: brandForm.name,
        alias: brandForm.alias,
        branches: []
      };
      setBrands([...brands, newBrand]);
      setBrandForm({ name: '', alias: '' });
      setShowBrandForm(false);
    }
  };

  const deleteBrand = (brandId: string) => {
    setBrands(brands.filter(brand => brand.id !== brandId));
  };

  // Branch management
  const addBranch = () => {
    if (branchForm.name && branchForm.alias && branchForm.address && branchForm.brandId) {
      const newBranch: Branch = {
        id: Date.now().toString(),
        name: branchForm.name,
        alias: branchForm.alias,
        address: branchForm.address,
        brandId: branchForm.brandId,
        users: []
      };
      
      setBrands(brands.map(brand => 
        brand.id === branchForm.brandId 
          ? { ...brand, branches: [...brand.branches, newBranch] }
          : brand
      ));
      
      setBranchForm({ name: '', alias: '', address: '', brandId: '' });
      setShowBranchForm(false);
    }
  };

  const deleteBranch = (brandId: string, branchId: string) => {
    setBrands(brands.map(brand => 
      brand.id === brandId 
        ? { ...brand, branches: brand.branches.filter(branch => branch.id !== branchId) }
        : brand
    ));
  };

  // User management
  const addUser = () => {
    if (userForm.name && userForm.email && userForm.branchId) {
      const newUser: User = {
        id: Date.now().toString(),
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        branchId: userForm.branchId
      };
      
      setBrands(brands.map(brand => ({
        ...brand,
        branches: brand.branches.map(branch =>
          branch.id === userForm.branchId
            ? { ...branch, users: [...branch.users, newUser] }
            : branch
        )
      })));
      
      setUserForm({ name: '', email: '', role: 'cajero', branchId: '' });
      setShowUserForm(false);
    }
  };

  const deleteUser = (brandId: string, branchId: string, userId: string) => {
    setBrands(brands.map(brand => 
      brand.id === brandId 
        ? {
            ...brand,
            branches: brand.branches.map(branch =>
              branch.id === branchId
                ? { ...branch, users: branch.users.filter(user => user.id !== userId) }
                : branch
            )
          }
        : brand
    ));
  };

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      cajero: 'Cajero',
      administrador_caja: 'Administrador de Caja',
      gerente_sucursal: 'Gerente de Sucursal',
      administrador_tienda: 'Administrador de Tienda'
    };
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">Gestión de Organización</h2>
              <p className="text-sm text-secondary-500">Administra marcas, sucursales y usuarios</p>
            </div>
          </div>
          <button
            onClick={() => setShowBrandForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Marca</span>
          </button>
        </div>
      </div>

      {/* Brands List */}
      <div className="space-y-4">
        {brands.length === 0 ? (
          <div className="card p-8 text-center">
            <Building2 className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No hay marcas registradas</h3>
            <p className="text-secondary-600 mb-4">Comienza agregando tu primera marca para organizar tu negocio</p>
            <button
              onClick={() => setShowBrandForm(true)}
              className="btn-primary"
            >
              Agregar Primera Marca
            </button>
          </div>
        ) : (
          brands.map(brand => (
            <div key={brand.id} className="card">
              {/* Brand Header */}
              <div className="p-4 border-b border-secondary-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleBrandExpansion(brand.id)}
                      className="p-1 hover:bg-secondary-100 rounded"
                    >
                      {expandedBrands.has(brand.id) ? (
                        <ChevronDown className="h-4 w-4 text-secondary-600" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-secondary-600" />
                      )}
                    </button>
                    <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Tag className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900">{brand.name}</h3>
                      <p className="text-sm text-secondary-500">Alias: {brand.alias}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-secondary-500">
                      {brand.branches.length} sucursal{brand.branches.length !== 1 ? 'es' : ''}
                    </span>
                    <button
                      onClick={() => {
                        setBranchForm({ ...branchForm, brandId: brand.id });
                        setShowBranchForm(true);
                      }}
                      className="btn-secondary flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Sucursal</span>
                    </button>
                    <button
                      onClick={() => deleteBrand(brand.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Branches */}
              {expandedBrands.has(brand.id) && (
                <div className="p-4 space-y-3">
                  {brand.branches.length === 0 ? (
                    <div className="text-center py-4 text-secondary-500">
                      No hay sucursales registradas para esta marca
                    </div>
                  ) : (
                    brand.branches.map(branch => (
                      <div key={branch.id} className="border border-secondary-200 rounded-lg">
                        {/* Branch Header */}
                        <div className="p-3 bg-secondary-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => toggleBranchExpansion(branch.id)}
                                className="p-1 hover:bg-secondary-200 rounded"
                              >
                                {expandedBranches.has(branch.id) ? (
                                  <ChevronDown className="h-3 w-3 text-secondary-600" />
                                ) : (
                                  <ChevronRight className="h-3 w-3 text-secondary-600" />
                                )}
                              </button>
                              <div className="h-6 w-6 bg-secondary-200 rounded flex items-center justify-center">
                                <MapPin className="h-3 w-3 text-secondary-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-secondary-900">{branch.name}</h4>
                                <p className="text-xs text-secondary-500">
                                  {branch.alias} • {branch.address}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-secondary-500">
                                {branch.users.length} usuario{branch.users.length !== 1 ? 's' : ''}
                              </span>
                              <button
                                onClick={() => {
                                  setUserForm({ ...userForm, branchId: branch.id });
                                  setShowUserForm(true);
                                }}
                                className="btn-secondary flex items-center space-x-1 text-xs"
                              >
                                <Plus className="h-3 w-3" />
                                <span>Usuario</span>
                              </button>
                              <button
                                onClick={() => deleteBranch(brand.id, branch.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Users */}
                        {expandedBranches.has(branch.id) && (
                          <div className="p-3 space-y-2">
                            {branch.users.length === 0 ? (
                              <div className="text-center py-2 text-secondary-500 text-sm">
                                No hay usuarios asignados a esta sucursal
                              </div>
                            ) : (
                              branch.users.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-2 bg-white border border-secondary-100 rounded">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center">
                                      <UserCheck className="h-3 w-3 text-primary-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-secondary-900">{user.name}</p>
                                      <p className="text-xs text-secondary-500">{user.email}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                                      {getRoleLabel(user.role)}
                                    </span>
                                    <button
                                      onClick={() => deleteUser(brand.id, branch.id, user.id)}
                                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Brand Form Modal */}
      {showBrandForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Agregar Nueva Marca</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Nombre de la Marca</label>
                <input
                  type="text"
                  className="input-field"
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  placeholder="Ej: Walmart"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Alias</label>
                <input
                  type="text"
                  className="input-field"
                  value={brandForm.alias}
                  onChange={(e) => setBrandForm({ ...brandForm, alias: e.target.value })}
                  placeholder="Ej: WMT"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBrandForm(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={addBrand}
                className="btn-primary flex-1"
              >
                Agregar Marca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branch Form Modal */}
      {showBranchForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Agregar Nueva Sucursal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Nombre de la Sucursal</label>
                <input
                  type="text"
                  className="input-field"
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  placeholder="Ej: Sucursal Centro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Alias</label>
                <input
                  type="text"
                  className="input-field"
                  value={branchForm.alias}
                  onChange={(e) => setBranchForm({ ...branchForm, alias: e.target.value })}
                  placeholder="Ej: CENTRO"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Dirección</label>
                <input
                  type="text"
                  className="input-field"
                  value={branchForm.address}
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                  placeholder="Ej: Av. Principal 123, Ciudad"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBranchForm(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={addBranch}
                className="btn-primary flex-1"
              >
                Agregar Sucursal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Agregar Nuevo Usuario</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  className="input-field"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="Ej: juan@empresa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Rol</label>
                <select
                  className="input-field"
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                >
                  <option value="cajero">Cajero</option>
                  <option value="administrador_caja">Administrador de Caja</option>
                  <option value="gerente_sucursal">Gerente de Sucursal</option>
                  <option value="administrador_tienda">Administrador de Tienda</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowUserForm(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={addUser}
                className="btn-primary flex-1"
              >
                Agregar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionSection;
