import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { setAuthToken, clearAuthToken, setUserInfo, fetchCurrentUser, UserInfo } from '../lib/auth';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      clearAuthToken();

      const overrideUrl = process.env.REACT_APP_POS_LOGIN_URL;
      const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, '');
      const endpoint = overrideUrl
        ? overrideUrl.replace(/\/$/, '')
        : baseUrl
        ? `${baseUrl}/pos/login`
        : 'https://centdos-backend-production.up.railway.app/pos/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.username,
          password: formData.password
        })
      });

      const responseBody = await response.json().catch(() => ({}));

      // Log para debugging - respuesta completa
      // eslint-disable-next-line no-console
      console.log('=== LOGIN RESPONSE DEBUG ===');
      // eslint-disable-next-line no-console
      console.log('Status:', response.status);
      // eslint-disable-next-line no-console
      console.log('Response OK:', response.ok);
      // eslint-disable-next-line no-console
      console.log('Full response body:', JSON.stringify(responseBody, null, 2));
      // eslint-disable-next-line no-console
      console.log('Response keys:', Object.keys(responseBody));
      
      // Buscar información del usuario en diferentes ubicaciones
      const possibleUserFields = [
        'user', 'userInfo', 'usuario', 'data', 'profile', 'perfil',
        'name', 'nombre', 'email', 'correo', 'fullName', 'full_name'
      ];
      
      // eslint-disable-next-line no-console
      console.log('=== BUSCANDO INFORMACIÓN DEL USUARIO ===');
      possibleUserFields.forEach(field => {
        if (responseBody[field]) {
          // eslint-disable-next-line no-console
          console.log(`Campo "${field}":`, responseBody[field]);
        }
      });
      
      // Buscar en objetos anidados
      if (responseBody.user) {
        // eslint-disable-next-line no-console
        console.log('responseBody.user:', responseBody.user);
        // eslint-disable-next-line no-console
        console.log('responseBody.user keys:', Object.keys(responseBody.user));
      }
      if (responseBody.data) {
        // eslint-disable-next-line no-console
        console.log('responseBody.data:', responseBody.data);
        // eslint-disable-next-line no-console
        console.log('responseBody.data keys:', Object.keys(responseBody.data));
      }

      if (!response.ok) {
        const message =
          (responseBody && (responseBody.message || responseBody.error)) ||
          'Credenciales inválidas. Verifica tu usuario y contraseña.';
        setError(message);
        return;
      }

      // Buscar token en diferentes ubicaciones posibles
      let token =
        responseBody?.token ??
        responseBody?.access_token ??
        responseBody?.accessToken ??
        responseBody?.admin_access_token ??
        responseBody?.pos_token ??
        responseBody?.posToken ??
        responseBody?.data?.token ??
        responseBody?.data?.access_token ??
        null;

      // También buscar en headers de respuesta (algunos backends envían el token en headers)
      const authHeader = response.headers.get('Authorization');
      if (!token && authHeader) {
        // Extraer token de "Bearer <token>" o solo el token
        token = authHeader.replace(/^Bearer\s+/i, '') || authHeader;
        // eslint-disable-next-line no-console
        console.log('Token encontrado en header Authorization:', token ? 'Sí' : 'No');
      }

      // Buscar en otros headers comunes
      const tokenHeader = response.headers.get('X-Auth-Token') || 
                          response.headers.get('X-Token') || 
                          response.headers.get('Token');
      if (!token && tokenHeader) {
        token = tokenHeader;
        // eslint-disable-next-line no-console
        console.log('Token encontrado en header personalizado');
      }

      // Log de todos los headers para debugging
      // eslint-disable-next-line no-console
      console.log('=== HEADERS DE RESPUESTA ===');
      // eslint-disable-next-line no-console
      console.log('Todos los headers:', Object.fromEntries(response.headers.entries()));
      // eslint-disable-next-line no-console
      console.log('Authorization header:', response.headers.get('Authorization'));
      // eslint-disable-next-line no-console
      console.log('Set-Cookie header:', response.headers.get('Set-Cookie'));

      // eslint-disable-next-line no-console
      console.log('Token encontrado:', token ? 'Sí' : 'No', token ? `(${token.substring(0, 20)}...)` : '');
      // eslint-disable-next-line no-console
      console.log('Estructura completa de respuesta:', responseBody);

      // Intentar extraer información del usuario de la respuesta
      const userInfo: UserInfo = {
        name: responseBody?.full_name || responseBody?.fullName || responseBody?.name || responseBody?.nombre || responseBody?.user?.name || responseBody?.user?.nombre || responseBody?.user?.full_name || responseBody?.user?.fullName || responseBody?.data?.name || responseBody?.data?.nombre || responseBody?.data?.full_name || responseBody?.data?.fullName,
        email: responseBody?.email || responseBody?.correo || responseBody?.user?.email || responseBody?.user?.correo || responseBody?.data?.email || responseBody?.data?.correo,
        nombre: responseBody?.full_name || responseBody?.fullName || responseBody?.name || responseBody?.nombre || responseBody?.user?.name || responseBody?.user?.nombre || responseBody?.user?.full_name || responseBody?.user?.fullName,
        correo: responseBody?.email || responseBody?.correo || responseBody?.user?.email || responseBody?.user?.correo,
        // Guardar IDs necesarios para asociar abonos
        id: responseBody?.id || responseBody?.user_id || responseBody?.user?.id || responseBody?.data?.id,
        branch_id: responseBody?.branch_id || responseBody?.branchId || responseBody?.user?.branch_id || responseBody?.data?.branch_id,
        user_id: responseBody?.id || responseBody?.user_id || responseBody?.user?.id || responseBody?.data?.id
      };

      // eslint-disable-next-line no-console
      console.log('=== INFORMACIÓN DEL USUARIO EXTRAÍDA ===');
      // eslint-disable-next-line no-console
      console.log('UserInfo extraído:', userInfo);
      // eslint-disable-next-line no-console
      console.log('¿Tiene nombre?', !!(userInfo.name || userInfo.nombre));
      // eslint-disable-next-line no-console
      console.log('¿Tiene email?', !!(userInfo.email || userInfo.correo));

      // Si hay información del usuario, guardarla
      if (userInfo.name || userInfo.email || userInfo.nombre || userInfo.correo) {
        // eslint-disable-next-line no-console
        console.log('✅ Guardando información del usuario en localStorage');
        setUserInfo(userInfo);
      } else {
        // eslint-disable-next-line no-console
        console.log('⚠️ No se encontró información del usuario en la respuesta. Intentando obtener del endpoint /me...');
        // Si no viene en la respuesta, intentar obtenerla del endpoint /me
        if (token) {
          // Hacer la llamada de forma asíncrona sin bloquear el login
          fetchCurrentUser().then(fetchedUser => {
            if (fetchedUser) {
              // eslint-disable-next-line no-console
              console.log('✅ Información del usuario obtenida del endpoint /me:', fetchedUser);
            } else {
              // eslint-disable-next-line no-console
              console.log('❌ No se pudo obtener información del usuario del endpoint /me');
            }
          }).catch(() => {
            // eslint-disable-next-line no-console
            console.log('❌ Error al obtener información del usuario del endpoint /me');
          });
        }
      }

      if (typeof token === 'string' && token.length > 0) {
        setAuthToken(token);
        onLogin(true);
      } else {
        // Si no hay token pero la respuesta fue exitosa, podría ser autenticación por cookies
        // En este caso, marcamos como autenticado pero sin token
        // eslint-disable-next-line no-console
        console.warn('Inicio de sesión exitoso pero no se recibió token. Se confiará en las cookies del backend.');
        // Aún así marcamos como autenticado si la respuesta fue exitosa
        onLogin(true);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error iniciando sesión:', err);
      setError(
        err instanceof Error
          ? `No se pudo iniciar sesión: ${err.message}`
          : 'No se pudo iniciar sesión. Intenta de nuevo más tarde.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 p-3 sm:p-4 lg:p-6 relative">
      {/* Maintenance Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-[2px]">
        <div className="bg-white rounded-2xl p-8 sm:p-10 max-w-md mx-4 text-center shadow-2xl border-2 border-blue-100">
          <div className="mb-6">
            <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="h-10 w-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">We're Making Improvements!</h2>
            <p className="text-lg text-gray-600 mb-2">We're currently updating the system to serve you better.</p>
            <p className="text-base text-gray-500">Please check back in a little while. Thank you for your patience!</p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-400">We'll be back soon!</p>
          </div>
        </div>
      </div>

      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 mb-4">
            <img src="/logo.png" alt="CENTPOS Logo" className="h-16 w-16 rounded-full" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">
            
            CENTPOS Dashboard
          </h2>
          <p className="text-sm sm:text-base text-secondary-600">
            Inicia sesión en tu sistema de punto de venta
          </p>
        </div>

        <div className="card p-4 sm:p-6 lg:p-8">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-secondary-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="email"
                  required
                  className="input-field pl-10"
                  placeholder="Ingresa tu email"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pl-10 pr-10"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary-400" />
                  )}
                </button>
              </div>
            </div>



            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center text-sm sm:text-base py-2 sm:py-3"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
