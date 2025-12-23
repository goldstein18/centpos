// Auth utility functions for standalone components
// You can replace this with your own auth implementation

const TOKEN_STORAGE_KEY = 'centpos_admin_token';

export const setAuthToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('No se pudo guardar el token de autenticación:', error);
  }
};

export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('No se pudo leer el token de autenticación:', error);
    return null;
  }
};

export const clearAuthToken = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('No se pudo eliminar el token de autenticación:', error);
  }
};










