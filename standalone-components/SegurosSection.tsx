import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Calendar,
  Phone,
  Mail,
  User,
  FileText,
  RefreshCw
} from 'lucide-react';

interface SeguroRequest {
  id: string;
  fechaContratacion: string;
  telefono: string;
  email: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  rfc: string;
  curp: string;
  sexo: 'M' | 'F';
  status: 'Pendiente' | 'Aprobado' | 'Rechazado' | 'En Proceso';
}

const SegurosSection: React.FC = () => {
  const [requests, setRequests] = useState<SeguroRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<SeguroRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof SeguroRequest>('fechaContratacion');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Mock data for demonstration
  // TODO: Replace with actual API call
  useEffect(() => {
    const mockData: SeguroRequest[] = [
      {
        id: '1',
        fechaContratacion: '2024-01-15',
        telefono: '5512345678',
        email: 'juan.perez@email.com',
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'García',
        fechaNacimiento: '1985-03-15',
        rfc: 'PEGJ850315ABC',
        curp: 'PEGJ850315HDFRRN01',
        sexo: 'M',
        status: 'Aprobado'
      },
      {
        id: '2',
        fechaContratacion: '2024-01-16',
        telefono: '5598765432',
        email: 'maria.lopez@email.com',
        nombre: 'María',
        apellidoPaterno: 'López',
        apellidoMaterno: 'Martínez',
        fechaNacimiento: '1990-07-22',
        rfc: 'LOMR900722XYZ',
        curp: 'LOMR900722MDFRRN02',
        sexo: 'F',
        status: 'En Proceso'
      },
      {
        id: '3',
        fechaContratacion: '2024-01-17',
        telefono: '5555123456',
        email: 'carlos.rodriguez@email.com',
        nombre: 'Carlos',
        apellidoPaterno: 'Rodríguez',
        apellidoMaterno: 'Hernández',
        fechaNacimiento: '1988-11-08',
        rfc: 'ROHC881108DEF',
        curp: 'ROHC881108HDFRRN03',
        sexo: 'M',
        status: 'Pendiente'
      },
      {
        id: '4',
        fechaContratacion: '2024-01-18',
        telefono: '5567890123',
        email: 'ana.gonzalez@email.com',
        nombre: 'Ana',
        apellidoPaterno: 'González',
        apellidoMaterno: 'Sánchez',
        fechaNacimiento: '1992-05-12',
        rfc: 'GOSA920512GHI',
        curp: 'GOSA920512MDFRRN04',
        sexo: 'F',
        status: 'Rechazado'
      },
      {
        id: '5',
        fechaContratacion: '2024-01-19',
        telefono: '5543210987',
        email: 'luis.morales@email.com',
        nombre: 'Luis',
        apellidoPaterno: 'Morales',
        apellidoMaterno: 'Jiménez',
        fechaNacimiento: '1987-09-30',
        rfc: 'MOJL870930JKL',
        curp: 'MOJL870930HDFRRN05',
        sexo: 'M',
        status: 'Aprobado'
      }
    ];

    setTimeout(() => {
      setRequests(mockData);
      setFilteredRequests(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = requests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.apellidoPaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.apellidoMaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.telefono.includes(searchTerm) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.curp.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter]);

  // Sort functionality
  const handleSort = (field: keyof SeguroRequest) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprobado':
        return 'bg-green-100 text-green-800';
      case 'Rechazado':
        return 'bg-red-100 text-red-800';
      case 'En Proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-secondary-900">Solicitudes de Seguros</h2>
            <p className="text-xs sm:text-sm text-secondary-500">Consulta y gestiona las solicitudes de compras de seguros</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono, email, RFC, CURP..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <select
                className="input-field pl-10"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-secondary-900">
              {isLoading ? 'Cargando...' : `${filteredRequests.length} solicitudes encontradas`}
            </h3>
            {searchTerm && (
              <p className="text-sm text-secondary-500 mt-1">
                Resultados para: "{searchTerm}"
              </p>
            )}
          </div>
          <div className="text-sm text-secondary-500">
            {statusFilter !== 'todos' && `Filtrado por: ${statusFilter}`}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-secondary-600">Cargando solicitudes...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer hover:bg-secondary-100"
                    onClick={() => handleSort('fechaContratacion')}
                  >
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Fecha Contratación</span>
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer hover:bg-secondary-100"
                    onClick={() => handleSort('telefono')}
                  >
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>Teléfono</span>
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer hover:bg-secondary-100"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer hover:bg-secondary-100"
                    onClick={() => handleSort('nombre')}
                  >
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Nombre Completo</span>
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer hover:bg-secondary-100"
                    onClick={() => handleSort('fechaNacimiento')}
                  >
                    Fecha Nacimiento
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer hover:bg-secondary-100"
                    onClick={() => handleSort('rfc')}
                  >
                    RFC
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer hover:bg-secondary-100"
                    onClick={() => handleSort('curp')}
                  >
                    CURP
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer hover:bg-secondary-100"
                    onClick={() => handleSort('sexo')}
                  >
                    Sexo
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer hover:bg-secondary-100"
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {sortedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {new Date(request.fechaContratacion).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {request.telefono}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {request.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">
                      <div>
                        <div className="font-medium">{request.nombre} {request.apellidoPaterno} {request.apellidoMaterno}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {new Date(request.fechaNacimiento).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900 font-mono">
                      {request.rfc}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900 font-mono">
                      {request.curp}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {request.sexo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* No Results */}
      {!isLoading && filteredRequests.length === 0 && (
        <div className="card p-8 text-center">
          <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No se encontraron solicitudes</h3>
          <p className="text-secondary-500">
            {searchTerm 
              ? `No hay resultados para "${searchTerm}"`
              : 'No hay solicitudes de seguros registradas'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default SegurosSection;










