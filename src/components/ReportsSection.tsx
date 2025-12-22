import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Building, Filter, AlertCircle } from 'lucide-react';
import { getAuthToken, getUserInfo } from '../lib/auth';

const ReportsSection: React.FC = () => {
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: ''
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<'with-phone' | 'without-phone' | null>(null);
  const [userBranchId, setUserBranchId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    // Obtener branch_id del usuario logueado
    const userInfo = getUserInfo();
    if (userInfo?.branch_id) {
      setUserBranchId(userInfo.branch_id);
    }
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error de validación cuando el usuario modifica los filtros
    if (validationError) {
      setValidationError('');
    }
  };

  const validateFilters = (): string | null => {
    // Validar que se tenga branch_id del usuario
    if (!userBranchId) {
      return 'No se pudo obtener la información de sucursal del usuario. Por favor, inicia sesión nuevamente.';
    }

    // Validar que las fechas sean requeridas
    if (!filters.fechaInicio) {
      return 'La fecha de inicio es requerida.';
    }

    if (!filters.fechaFin) {
      return 'La fecha de fin es requerida.';
    }

    // Validar formato de fecha (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(filters.fechaInicio)) {
      return 'La fecha de inicio debe estar en formato YYYY-MM-DD.';
    }

    if (!dateRegex.test(filters.fechaFin)) {
      return 'La fecha de fin debe estar en formato YYYY-MM-DD.';
    }

    // Validar que fechaInicio no sea posterior a fechaFin
    const startDate = new Date(filters.fechaInicio);
    const endDate = new Date(filters.fechaFin);
    if (startDate > endDate) {
      return 'La fecha de inicio no puede ser posterior a la fecha de fin.';
    }

    return null;
  };

  const buildQueryString = (): string => {
    const params = new URLSearchParams();
    
    // sucursal es requerido (branch_id del usuario)
    if (userBranchId) {
      params.append('sucursal', userBranchId);
    }
    
    // fechaInicio es requerido
    params.append('fechaInicio', filters.fechaInicio);
    
    // fechaFin es requerido
    params.append('fechaFin', filters.fechaFin);
    
    return params.toString();
  };

  const downloadReport = async (type: 'with-phone' | 'without-phone') => {
    // Validar filtros antes de descargar
    const validationError = validateFilters();
    if (validationError) {
      setValidationError(validationError);
      alert(`Error de validación:\n\n${validationError}`);
      return;
    }

    setValidationError('');
    setIsDownloading(true);
    setDownloadType(type);
    
    try {
      // Usar variable de entorno o el endpoint específico de reportes
      // NOTA: Los reportes pueden usar un servidor diferente (centback) o el mismo (centdos-backend)
      // Intentar primero con REACT_APP_REPORTS_API_URL, luego con centback, luego con el API_URL principal
      const reportsBaseUrl = process.env.REACT_APP_REPORTS_API_URL?.replace(/\/$/, '') 
        ?? process.env.REACT_APP_API_URL?.replace(/\/$/, '')
        ?? 'https://centback-production.up.railway.app';
      
      const baseEndpoint = `${reportsBaseUrl}/pos/reportes`;
      const endpoint = type === 'with-phone' 
        ? `${baseEndpoint}/csv`
        : `${baseEndpoint}/csv-sin-telefono`;
      
      const queryString = buildQueryString();
      const url = `${endpoint}?${queryString}`;
      
      console.log('=== DESCARGANDO REPORTE ===');
      console.log('Tipo:', type === 'with-phone' ? 'Con teléfono' : 'Sin teléfono');
      console.log('Base URL usado:', reportsBaseUrl);
      console.log('  - REACT_APP_REPORTS_API_URL:', process.env.REACT_APP_REPORTS_API_URL || 'no definido');
      console.log('  - REACT_APP_API_URL:', process.env.REACT_APP_API_URL || 'no definido');
      console.log('Ruta base:', baseEndpoint);
      console.log('Endpoint completo:', endpoint);
      console.log('URL final:', url);
      console.log('Query string:', queryString);
      console.log('Parámetros:', {
        sucursal: userBranchId,
        fechaInicio: filters.fechaInicio,
        fechaFin: filters.fechaFin
      });
      console.log('');
      console.log('NOTA: Si recibes 404 o CORS, verifica que:');
      console.log('  1. El backend esté desplegado con los endpoints:');
      console.log('     - GET /pos/reportes/csv');
      console.log('     - GET /pos/reportes/csv-sin-telefono');
      console.log('  2. El servidor tenga CORS configurado para:', window.location.origin);
      console.log('  3. Prueba con curl:');
      console.log(`     curl -X GET "${url}" -H "Accept: text/csv" -v`);
      console.log(`     curl -X OPTIONS "${url}" -H "Origin: ${window.location.origin}" -H "Access-Control-Request-Method: GET" -v`);
      
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
        // NOTA: No usamos credentials: 'include' porque puede causar problemas de CORS
        // si el servidor no está configurado correctamente con Access-Control-Allow-Credentials
        response = await fetch(url, {
          method: 'GET',
          headers,
          // credentials: 'include' - Removido para evitar problemas de CORS
        });
      } catch (fetchError) {
        console.error('Error en fetch:', fetchError);
        console.error('Error type:', fetchError instanceof Error ? fetchError.constructor.name : typeof fetchError);
        console.error('Error message:', fetchError instanceof Error ? fetchError.message : String(fetchError));
        
        // Detectar específicamente errores de preflight CORS
        if (fetchError instanceof TypeError && (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('Load failed'))) {
          const curlCommand = `curl -X OPTIONS "${url}" -H "Origin: ${window.location.origin}" -H "Access-Control-Request-Method: GET" -v`;
          const curlCommandGet = `curl -X GET "${url}" -H "Accept: text/csv" -v`;
          
          const errorDetails = `\n\n--- Detalles del Error ---
URL: ${url}
Origen: ${window.location.origin}
Método: GET
Headers: ${JSON.stringify(headers, null, 2)}

El servidor está devolviendo 404 en el preflight OPTIONS, lo que indica:
1. El servidor NO tiene configurado CORS para permitir solicitudes desde ${window.location.origin}
2. El endpoint puede no existir o la ruta estar incorrecta
3. El servidor NO está manejando correctamente las peticiones OPTIONS (preflight)

--- Verificación del Endpoint ---
Para verificar si el endpoint existe, ejecuta en tu terminal:
${curlCommandGet}

Si el endpoint existe pero falla CORS, ejecuta:
${curlCommand}

SOLUCIÓN REQUERIDA EN EL BACKEND:
El servidor debe:
- Responder a OPTIONS con status 200/204 (no 404)
- Incluir header: Access-Control-Allow-Origin: ${window.location.origin} (o *)
- Incluir header: Access-Control-Allow-Methods: GET, OPTIONS
- Incluir header: Access-Control-Allow-Headers: Authorization, Accept, Content-Type
- Si el endpoint no existe, debe estar desplegado en el servidor`;
          
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
        
        // Intentar obtener el nombre del archivo del header Content-Disposition
        let fileName = '';
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
          if (fileNameMatch) {
            fileName = fileNameMatch[1];
          }
        }
        
        // Si no hay nombre en el header, generar uno
        if (!fileName) {
          const endDate = filters.fechaFin || new Date().toISOString().split('T')[0];
          fileName = type === 'with-phone'
            ? `reporte-pos-con-telefono-${endDate}.csv`
            : `reporte-pos-sin-telefono-${endDate}.csv`;
        }

        const downloadUrl = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
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
          errorMessage = `Error de validación (400): ${errorMessage}\n\nVerifica que:\n- Se proporcione sucursal o marca\n- Las fechas estén en formato YYYY-MM-DD\n- La fecha de inicio no sea posterior a la fecha de fin\n- La sucursal o marca existan en el sistema`;
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
      
      // Determinar si es un error de CORS
      const isCorsError = errorMessage.includes('CORS') || errorMessage.includes('Failed to fetch') || errorMessage.includes('Load failed');
      
      if (isCorsError) {
        alert(`Error de CORS al descargar el reporte:\n\n${errorMessage}\n\nEste es un problema de configuración del servidor. El backend debe:\n1. Permitir solicitudes desde ${window.location.origin}\n2. Responder correctamente a las peticiones OPTIONS (preflight)\n3. Incluir los headers CORS necesarios\n\nRevisa la consola para más detalles y comandos curl para verificar.`);
      } else {
        alert(`Error al descargar el reporte:\n\n${errorMessage}\n\nRevisa la consola para más detalles.`);
      }
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  const clearFilters = () => {
    setFilters({
      fechaInicio: '',
      fechaFin: ''
    });
    setValidationError('');
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
            <h2 className="text-lg sm:text-xl font-semibold text-secondary-900">Reportes de Transacciones POS</h2>
            <p className="text-xs sm:text-sm text-secondary-500">Descarga reportes CSV de transacciones (abonos y pagos)</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-3 sm:mb-4">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
          <h3 className="text-base sm:text-lg font-medium text-secondary-900">Filtros de Reporte</h3>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{validationError}</p>
          </div>
        )}

        {/* Sucursal Info */}
        <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Building className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-800">Sucursal</span>
          </div>
          <p className="text-sm text-primary-700">
            {userBranchId ? (
              <>ID: <span className="font-mono text-xs">{userBranchId}</span></>
            ) : (
              <span className="text-red-600">No disponible. Por favor, inicia sesión nuevamente.</span>
            )}
          </p>
          <p className="text-xs text-primary-600 mt-1">
            El reporte incluirá todas las transacciones de tu sucursal y su marca.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

          {/* Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Fecha Inicio <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="fechaInicio"
              className="input-field"
              value={filters.fechaInicio}
              onChange={handleFilterChange}
              required
            />
            <p className="text-xs text-secondary-500 mt-1">Formato: YYYY-MM-DD</p>
          </div>

          {/* Fecha Fin */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Fecha Fin <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="fechaFin"
              className="input-field"
              value={filters.fechaFin}
              onChange={handleFilterChange}
              required
            />
            <p className="text-xs text-secondary-500 mt-1">Formato: YYYY-MM-DD</p>
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
                <li>• Tipo (Abono, Pago, etc.)</li>
                <li>• Referencia</li>
                <li>• Sucursal</li>
                <li>• Fecha (DD/MM/YYYY)</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => downloadReport('with-phone')}
            disabled={isDownloading || !userBranchId || !filters.fechaInicio || !filters.fechaFin}
            className="btn-primary w-full flex justify-center items-center text-sm sm:text-base py-2 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <li>• Tipo (Abono, Pago, etc.)</li>
                <li>• Referencia</li>
                <li>• Sucursal</li>
                <li>• Fecha (DD/MM/YYYY)</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => downloadReport('without-phone')}
            disabled={isDownloading || !userBranchId || !filters.fechaInicio || !filters.fechaFin}
            className="btn-primary w-full flex justify-center items-center text-sm sm:text-base py-2 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <li>• Los reportes se descargan en formato CSV compatible con Excel (UTF-8 con BOM)</li>
            <li>• La sucursal se obtiene automáticamente de tu sesión</li>
            <li>• El reporte incluye todas las transacciones de tu sucursal y su marca</li>
            <li>• Las fechas de inicio y fin son requeridas (formato YYYY-MM-DD)</li>
            <li>• Ambos rangos de fecha son inclusivos (incluyen el día inicial y final)</li>
            <li>• Los reportes incluyen: Abonos (depósitos) y Pagos (transacciones de tipo payment)</li>
            <li>• Los archivos se nombran automáticamente con la fecha de descarga</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;
