import React, { useState } from 'react';
import { Download, FileText, Calendar, Building, Filter } from 'lucide-react';
import { getAuthToken, getUserInfo } from '../lib/auth';

const ReportsSection: React.FC = () => {
  const [filters, setFilters] = useState({
    sucursal: 'prueba',
    fechaInicio: '',
    fechaFin: ''
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<'with-phone' | 'without-phone' | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const buildQueryString = () => {
    const params = new URLSearchParams();
    
    // Obtener branch_id del usuario logueado si está disponible
    const userInfo = getUserInfo();
    const branchId = userInfo?.branch_id || filters.sucursal;
    
    // Agregar parámetros opcionales según lo que espera el backend:
    // - sucursal (branchId) - opcional
    // - fechaInicio - opcional
    // - fechaFin - opcional
    if (branchId && branchId !== 'prueba') {
      // El backend espera 'sucursal' pero puede aceptar branchId también
      params.append('sucursal', branchId);
    }
    
    if (filters.fechaInicio) {
      params.append('fechaInicio', filters.fechaInicio);
    }
    
    if (filters.fechaFin) {
      params.append('fechaFin', filters.fechaFin);
    }
    
    return params.toString();
  };

  const downloadReport = async (type: 'with-phone' | 'without-phone') => {
    setIsDownloading(true);
    setDownloadType(type);
    
    try {
      // Usar variable de entorno o el endpoint específico de reportes
      // NOTA: Los reportes usan un servidor diferente (centback) que otros endpoints
      // Host correcto: https://centback-production.up.railway.app
      // Rutas correctas: /pos/reportes/csv y /pos/reportes/csv-sin-telefono
      const reportsBaseUrl = process.env.REACT_APP_REPORTS_API_URL?.replace(/\/$/, '') 
        ?? 'https://centback-production.up.railway.app';
      
      const baseEndpoint = `${reportsBaseUrl}/pos/reportes`;
      const endpoint = type === 'with-phone' 
        ? `${baseEndpoint}/csv`
        : `${baseEndpoint}/csv-sin-telefono`;
      
      const queryString = buildQueryString();
      const url = queryString ? `${endpoint}?${queryString}` : endpoint;
      
      console.log('=== DESCARGANDO REPORTE ===');
      console.log('Tipo:', type === 'with-phone' ? 'Con teléfono' : 'Sin teléfono');
      console.log('Host:', reportsBaseUrl);
      console.log('Ruta base:', baseEndpoint);
      console.log('Endpoint completo:', endpoint);
      console.log('URL final:', url);
      console.log('Query string:', queryString);
      console.log('Filtros:', filters);
      console.log('');
      console.log('NOTA: Si recibes 404, verifica que el backend esté desplegado con los endpoints:');
      console.log('  - GET /pos/reportes/csv');
      console.log('  - GET /pos/reportes/csv-sin-telefono');
      console.log('Prueba con curl:');
      console.log(`  curl -i "${url}"`);
      
      // NOTA: Los endpoints de reportes POS están abiertos (sin guard) y no requieren token.
      // El backend POS no emite token en el login, así que no intentamos usar Authorization.
      // Si en el futuro se protegen con JWT, habrá que agregar el token aquí.
      const headers: HeadersInit = {
        Accept: 'text/csv,application/json'
      };

      // Los endpoints de reportes POS no requieren Authorization actualmente
      // Si en el futuro se protegen, descomentar esto:
      // const token = getAuthToken();
      // if (token) {
      //   headers.Authorization = `Bearer ${token}`;
      // }
      
      console.log('Headers enviados:', headers);
      console.log('Nota: Endpoints de reportes POS no requieren token (están abiertos)');

      let response: Response;
      try {
        response = await fetch(url, {
          method: 'GET',
          headers,
          credentials: 'include'
        });
      } catch (fetchError) {
        console.error('Error en fetch:', fetchError);
        console.error('Error type:', fetchError instanceof Error ? fetchError.constructor.name : typeof fetchError);
        console.error('Error message:', fetchError instanceof Error ? fetchError.message : String(fetchError));
        
        // Detectar específicamente errores de preflight CORS
        if (fetchError instanceof TypeError && (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('Load failed'))) {
          const errorDetails = `\n\n--- Detalles del Error ---
URL: ${url}
Origen: ${window.location.origin}
Método: GET
Headers: ${JSON.stringify(headers, null, 2)}

El servidor está devolviendo 404 en el preflight OPTIONS, lo que indica:
1. El servidor NO tiene configurado CORS para permitir solicitudes desde ${window.location.origin}
2. El endpoint puede no existir o la ruta estar incorrecta
3. El servidor NO está manejando correctamente las peticiones OPTIONS (preflight)

SOLUCIÓN REQUERIDA EN EL BACKEND:
El servidor debe:
- Responder a OPTIONS con status 200/204 (no 404)
- Incluir header: Access-Control-Allow-Origin: ${window.location.origin}
- Incluir header: Access-Control-Allow-Methods: GET, OPTIONS
- Incluir header: Access-Control-Allow-Headers: Authorization, Accept
- Incluir header: Access-Control-Allow-Credentials: true (si usa cookies)`;
          
          throw new Error(`Error de CORS: El servidor no permite solicitudes desde este origen.${errorDetails}`);
        }
        
        throw new Error(`Error de red: ${fetchError instanceof Error ? fetchError.message : 'No se pudo conectar al servidor. Verifica CORS y la conexión.'}`);
      }

      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok,
        type: response.type,
        url: response.url
      });

      // Verificar si es un error de CORS
      if (response.type === 'opaque' || response.type === 'opaqueredirect') {
        throw new Error('Error de CORS: El servidor no permite solicitudes desde este origen. Contacta al administrador.');
      }

      if (response.ok && response.status === 200) {
        // Verificar el Content-Type
        const contentType = response.headers.get('content-type') || '';
        console.log('Content-Type recibido:', contentType);
        
        const blob = await response.blob();
        console.log('Blob recibido:', {
          size: blob.size,
          type: blob.type,
          contentType: contentType
        });
        
        // Leer el contenido del blob para verificar
        const text = await blob.text();
        console.log('=== CONTENIDO DEL CSV ===');
        console.log('Tamaño del texto:', text.length);
        console.log('Primeros 1000 caracteres:', text.substring(0, 1000));
        console.log('¿Está vacío?', !text.trim());
        console.log('Número de líneas:', text.split('\n').length);
        
        // Verificar si el CSV está vacío o solo tiene headers
        const lines = text.split('\n').filter(line => line.trim());
        const hasData = lines.length > 1; // Más de una línea (header + datos)
        
        if (blob.size === 0 || !text.trim()) {
          throw new Error('El servidor respondió con un archivo CSV vacío. No hay datos para el rango de fechas seleccionado.');
        }
        
        if (!hasData) {
          // Solo tiene header, no hay datos
          console.warn('El CSV solo contiene headers, no hay datos');
          alert('El reporte se descargó pero no contiene datos para el rango de fechas seleccionado.\n\nEl archivo solo contiene los encabezados de las columnas.');
        }
        
        // Crear un nuevo blob con el contenido leído
        const newBlob = new Blob([text], { type: 'text/csv;charset=utf-8' });
        
        const downloadUrl = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        const fileName = type === 'with-phone'
          ? `reporte-abonos-con-telefono-${new Date().toISOString().split('T')[0]}.csv`
          : `reporte-abonos-sin-telefono-${new Date().toISOString().split('T')[0]}.csv`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        if (hasData) {
          alert(`Reporte descargado exitosamente: ${fileName}\n\nContiene ${lines.length - 1} registros.`);
        }
      } else {
        // Obtener el mensaje de error del servidor
        let errorText = '';
        let errorData: any = {};
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
            errorText = JSON.stringify(errorData, null, 2);
          } else {
            errorText = await response.text();
            errorData = { message: errorText, raw: errorText };
          }
        } catch (e) {
          errorText = 'No se pudo leer el mensaje de error del servidor';
          errorData = { error: errorText };
        }
        
        console.error('=== ERROR AL DESCARGAR REPORTE ===');
        console.error('Código de estado:', response.status);
        console.error('Status Text:', response.statusText);
        console.error('URL:', response.url);
        console.error('Error response body:', errorText);
        console.error('Error data:', errorData);
        
        // Construir mensaje de error detallado
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        // Agregar mensaje específico del servidor si existe
        if (errorData.message) {
          errorMessage += `\n\nMensaje del servidor: ${errorData.message}`;
        } else if (errorData.error) {
          errorMessage += `\n\nError: ${errorData.error}`;
        } else if (errorText && errorText.trim()) {
          errorMessage += `\n\nRespuesta del servidor: ${errorText}`;
        }
        
        // Mensajes específicos según el código de estado
        if (response.status === 400) {
          errorMessage = `Error de validación (400): ${errorMessage}\n\nVerifica que las fechas estén en formato YYYY-MM-DD y sean válidas.`;
        } else if (response.status === 401) {
          errorMessage = `No autorizado (401): Por favor, inicia sesión nuevamente.\n\n${errorMessage}`;
        } else if (response.status === 403) {
          errorMessage = `Acceso denegado (403): No tienes permisos para descargar este reporte.\n\n${errorMessage}`;
        } else if (response.status === 404) {
          errorMessage = `Endpoint no encontrado (404): El endpoint no existe o la ruta está incorrecta.\n\nURL intentada: ${response.url}\n\n${errorMessage}`;
        } else if (response.status === 500) {
          errorMessage = `Error del servidor (500): El servidor encontró un error interno.\n\n${errorMessage}`;
        } else if (response.status === 0) {
          errorMessage = `Error de CORS o conexión (0): El servidor no está respondiendo.\n\n${errorMessage}`;
        }
        
        // Agregar información de la petición para debugging
        errorMessage += `\n\n--- Información de la petición ---`;
        errorMessage += `\nEndpoint: ${url}`;
        errorMessage += `\nTipo: ${type === 'with-phone' ? 'Con teléfono' : 'Sin teléfono'}`;
        if (queryString) {
          errorMessage += `\nParámetros: ${queryString}`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error al descargar reporte:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al descargar el reporte:\n\n${errorMessage}\n\nRevisa la consola para más detalles.`);
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  const clearFilters = () => {
    setFilters({
      sucursal: 'prueba',
      fechaInicio: '',
      fechaFin: ''
    });
  };

  const hasActiveFilters = filters.fechaInicio !== '' || filters.fechaFin !== '';



  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-3 sm:mb-4">
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-secondary-900">Reportes de Abonos</h2>
            <p className="text-xs sm:text-sm text-secondary-500">Descarga reportes CSV de abonos registrados</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-3 sm:mb-4">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
          <h3 className="text-base sm:text-lg font-medium text-secondary-900">Filtros de Reporte</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 border-t border-secondary-200 space-y-3 sm:space-y-0">
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
            className="btn-secondary text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Download Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Reporte con Teléfono */}
        <div className="card p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-3 sm:mb-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-secondary-900">Reporte con Teléfonos</h3>
              <p className="text-xs sm:text-sm text-secondary-500">Reporte completo con números de teléfono</p>
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
            className="btn-primary w-full flex justify-center items-center text-sm sm:text-base py-2 sm:py-3"
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

        {/* Reporte sin Teléfono */}
        <div className="card p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-3 sm:mb-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-secondary-900">Reporte sin Teléfonos</h3>
              <p className="text-xs sm:text-sm text-secondary-500">Reporte anonimizado sin números de teléfono</p>
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
            className="btn-primary w-full flex justify-center items-center text-sm sm:text-base py-2 sm:py-3"
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
      <div className="card p-4 sm:p-6">
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 sm:p-4">
          <h4 className="text-xs sm:text-sm font-medium text-primary-800 mb-2">💡 Información sobre los Reportes</h4>
          <ul className="text-xs sm:text-sm text-primary-700 space-y-1">
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
