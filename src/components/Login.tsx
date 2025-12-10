import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { setAuthToken, clearAuthToken } from '../lib/auth';

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

      // Log para debugging
      // eslint-disable-next-line no-console
      console.log('Login response:', {
        status: response.status,
        ok: response.ok,
        body: responseBody
      });

      if (!response.ok) {
        const message =
          (responseBody && (responseBody.message || responseBody.error)) ||
          'Credenciales inválidas. Verifica tu usuario y contraseña.';
        setError(message);
        return;
      }

      // Buscar token en diferentes ubicaciones posibles
      const token =
        responseBody?.token ??
        responseBody?.access_token ??
        responseBody?.accessToken ??
        responseBody?.admin_access_token ??
        responseBody?.data?.token ??
        responseBody?.data?.access_token ??
        null;

      // eslint-disable-next-line no-console
      console.log('Token encontrado:', token ? 'Sí' : 'No', 'Estructura completa:', responseBody);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 p-3 sm:p-4 lg:p-6">
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
