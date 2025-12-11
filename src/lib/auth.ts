const TOKEN_STORAGE_KEY = 'centpos_admin_token';
const USER_INFO_KEY = 'centpos_user_info';

export interface UserInfo {
  name?: string;
  email?: string;
  nombre?: string;
  correo?: string;
}

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
    localStorage.removeItem(USER_INFO_KEY);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('No se pudo eliminar el token de autenticación:', error);
  }
};

export const setUserInfo = (userInfo: UserInfo) => {
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('No se pudo guardar la información del usuario:', error);
  }
};

export const getUserInfo = (): UserInfo | null => {
  try {
    const userInfoStr = localStorage.getItem(USER_INFO_KEY);
    if (userInfoStr) {
      return JSON.parse(userInfoStr);
    }
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('No se pudo leer la información del usuario:', error);
    return null;
  }
};

export const fetchCurrentUser = async (): Promise<UserInfo | null> => {
  try {
    const token = getAuthToken();
    const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, '') ?? 'https://centdos-backend-production.up.railway.app';
    
    // Intentar diferentes endpoints comunes para obtener información del usuario
    const endpoints = [
      `${baseUrl}/pos/me`,
      `${baseUrl}/pos/user`,
      `${baseUrl}/pos/profile`,
      `${baseUrl}/me`,
      `${baseUrl}/user`,
      `${baseUrl}/profile`
    ];

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Intentar cada endpoint hasta que uno funcione
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers,
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          // Normalizar la respuesta a nuestro formato
          const userInfo: UserInfo = {
            name: data.full_name || data.fullName || data.name || data.nombre,
            email: data.email || data.correo || data.emailAddress || data.email_address,
            nombre: data.full_name || data.fullName || data.name || data.nombre,
            correo: data.email || data.correo
          };
          
          if (userInfo.name || userInfo.email) {
            setUserInfo(userInfo);
            return userInfo;
          }
        }
      } catch (err) {
        // Continuar con el siguiente endpoint
        continue;
      }
    }

    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Error obteniendo información del usuario:', error);
    return null;
  }
};


