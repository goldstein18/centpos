import React, { useState } from 'react';
import { Download, FileText, Calendar, Building, User, Filter } from 'lucide-react';

const ReportsSection: React.FC = () => {
  const [filters, setFilters] = useState({
    sucursal: 'prueba',
    usuario: 'prueba',
    fechaInicio: '',
    fechaFin: ''
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<'with-phone' | 'without-phone'>('with-phone');

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const buildQueryString = () => {
    const params = new URLSearchParams();
    
    // Solo agregar parámetros si hay fechas seleccionadas
    if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
    if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
    
    return params.toString();
  };

  const downloadReport = async (type: 'with-phone' | 'without-phone') => {
    setIsDownloading(true);
    setDownloadType(type);
    
    try {
      const endpoint = type === 'with-phone' 
        ? 'https://centback-production.up.railway.app/abonos/reporte/csv'
        : 'https://centback-production.up.railway.app/abonos/reporte/csv-sin-telefono';
      
      const queryString = buildQueryString();
      const url = queryString ? `${endpoint}?${queryString}` : endpoint;
      
      console.log('Descargando reporte:', {
        type: type,
        url: url,
        queryString: queryString,
        filters: filters
      });
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv,application/json',
          'Cache-Control': 'no-cache'
        }
      });

      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok
      });

      if (response.ok) {
        const blob = await response.blob();
        console.log('Blob recibido:', {
          size: blob.size,
          type: blob.type
        });
        
        if (blob.size === 0) {
          throw new Error('El archivo CSV está vacío. No hay datos para descargar.');
        }
        
        // Leer el contenido del blob para debug
        const text = await blob.text();
        console.log('Contenido del CSV:', text.substring(0, 500)); // Primeros 500 caracteres
        
        // Crear un nuevo blob con el contenido leído
        const newBlob = new Blob([text], { type: 'text/csv' });
        
        const downloadUrl = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `reporte-abonos-${type === 'with-phone' ? 'con-telefono' : 'sin-telefono'}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        alert(`Reporte descargado exitosamente: ${link.download}`);
      } else {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error al descargar reporte:', error);
      alert(`Error al descargar el reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      sucursal: 'prueba',
      usuario: 'prueba',
      fechaInicio: '',
      fechaFin: ''
    });
  };

  const hasActiveFilters = filters.fechaInicio !== '' || filters.fechaFin !== '';



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">Reportes de Abonos</h2>
            <p className="text-sm text-secondary-500">Descarga reportes CSV de abonos registrados</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-medium text-secondary-900">Filtros de Reporte</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sucursal Filter */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Building className="h-4 w-4 inline mr-1" />
              Sucursal
            </label>
            <div className="relative">
              <input
                type="text"
                name="sucursal"
                className="input-field bg-secondary-100 cursor-not-allowed"
                value={filters.sucursal}
                disabled
                readOnly
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Fijo</span>
              </div>
            </div>
            <p className="text-xs text-secondary-500 mt-1">Valor fijo para pruebas</p>
          </div>

          {/* Usuario Filter */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Usuario
            </label>
            <div className="relative">
              <input
                type="text"
                name="usuario"
                className="input-field bg-secondary-100 cursor-not-allowed"
                value={filters.usuario}
                disabled
                readOnly
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Fijo</span>
              </div>
            </div>
            <p className="text-xs text-secondary-500 mt-1">Valor fijo para pruebas</p>
          </div>

          {/* Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Fecha Inicio
            </label>
            <input
              type="date"
              name="fechaInicio"
              className="input-field"
              value={filters.fechaInicio}
              onChange={handleFilterChange}
            />
          </div>

          {/* Fecha Fin */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Fecha Fin
            </label>
            <input
              type="date"
              name="fechaFin"
              className="input-field"
              value={filters.fechaFin}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-secondary-200">
          <div className="text-sm text-secondary-600">
            {hasActiveFilters && (
              <span className="flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filtros activos
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-secondary-200">
            <div className="text-sm text-secondary-600">
              {hasActiveFilters && (
                <span className="flex items-center">
                  <Filter className="h-4 w-4 mr-1" />
                  Filtros activos
                </span>
              )}
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report with Phone Numbers */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">Reporte con Teléfonos</h3>
              <p className="text-sm text-secondary-500">Incluye números de teléfono en el reporte</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="text-sm text-secondary-600">
              <p className="font-medium mb-2">Columnas incluidas:</p>
              <ul className="space-y-1 text-xs">
                <li>• Teléfono</li>
                <li>• Monto</li>
                <li>• Tipo</li>
                <li>• Autorización</li>
                <li>• Sucursal</li>
                <li>• Usuario</li>
                <li>• Fecha (México)</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => downloadReport('with-phone')}
            disabled={isDownloading}
            className="btn-primary w-full flex justify-center items-center"
          >
            {isDownloading && downloadType === 'with-phone' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Descargando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Descargar CSV con Teléfonos
              </>
            )}
          </button>
        </div>

        {/* Report without Phone Numbers */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">Reporte sin Teléfonos</h3>
              <p className="text-sm text-secondary-500">Reporte anonimizado sin números de teléfono</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="text-sm text-secondary-600">
              <p className="font-medium mb-2">Columnas incluidas:</p>
              <ul className="space-y-1 text-xs">
                <li>• Monto</li>
                <li>• Tipo</li>
                <li>• Autorización</li>
                <li>• Sucursal</li>
                <li>• Usuario</li>
                <li>• Fecha (México)</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => downloadReport('without-phone')}
            disabled={isDownloading}
            className="btn-primary w-full flex justify-center items-center"
          >
            {isDownloading && downloadType === 'without-phone' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Descargando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Descargar CSV sin Teléfonos
              </>
            )}
          </button>
        </div>
      </div>

      {/* Information Section */}
      <div className="card p-6">
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary-800 mb-2">💡 Información sobre los Reportes</h4>
          <ul className="text-sm text-primary-700 space-y-1">
            <li>• Los reportes se descargan en formato CSV</li>
            <li>• Sucursal y Usuario están fijos en "prueba" para desarrollo</li>
            <li>• Solo las fechas son filtros opcionales</li>
            <li>• Las fechas deben estar en formato YYYY-MM-DD</li>
            <li>• Los archivos se nombran automáticamente con la fecha actual</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;
