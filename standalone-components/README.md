# Componentes Standalone - Tasas de Interés y Seguros

Esta carpeta contiene los componentes de **Tasas de Interés** y **Seguros** listos para ser copiados a otro codebase.

## Estructura de Archivos

```
standalone-components/
├── README.md                    # Este archivo
├── TasasInteresSection.tsx      # Componente de Tasas de Interés
├── SegurosSection.tsx           # Componente de Seguros
└── lib/
    └── auth.ts                  # Utilidades de autenticación
```

## Dependencias Requeridas

### Paquetes NPM
```bash
npm install lucide-react
```

### Dependencias de Estilos
Los componentes utilizan clases de Tailwind CSS. Asegúrate de tener configurado Tailwind CSS en tu proyecto.

**Clases CSS personalizadas utilizadas:**
- `card` - Contenedor con estilo de tarjeta
- `input-field` - Campo de entrada con estilo
- `btn-primary` - Botón primario
- `btn-secondary` - Botón secundario
- Clases de colores: `primary-*`, `secondary-*`, `green-*`, `blue-*`, `red-*`, `amber-*`

Si no tienes estas clases definidas, necesitarás agregarlas a tu configuración de Tailwind o crear estilos personalizados.

## Instalación

1. Copia toda la carpeta `standalone-components` a tu nuevo proyecto
2. Instala las dependencias:
   ```bash
   npm install lucide-react
   ```
3. Asegúrate de tener Tailwind CSS configurado
4. Ajusta las importaciones según la estructura de tu proyecto

## Uso

### TasasInteresSection

```tsx
import TasasInteresSection from './standalone-components/TasasInteresSection';

function App() {
  return <TasasInteresSection />;
}
```

**Configuración de API:**
- El componente usa `process.env.REACT_APP_API_URL` o el valor por defecto
- Endpoint: `${baseUrl}/investment-rates`
- Métodos: GET (obtener tasas), POST (actualizar tasa)

**Autenticación:**
- Requiere token de autenticación en localStorage
- El token se obtiene mediante `getAuthToken()` del archivo `lib/auth.ts`
- Se envía en el header: `Authorization: Bearer ${token}`

### SegurosSection

```tsx
import SegurosSection from './standalone-components/SegurosSection';

function App() {
  return <SegurosSection />;
}
```

**Nota:** Actualmente usa datos mock. Necesitarás reemplazar el `useEffect` con una llamada real a tu API.

## Personalización

### Cambiar la URL de la API

En `TasasInteresSection.tsx`, línea 41:
```tsx
const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, '') ?? 'TU_URL_AQUI';
```

### Adaptar el sistema de autenticación

Si tu proyecto usa un sistema de autenticación diferente, puedes:

1. Modificar `lib/auth.ts` para usar tu implementación
2. O reemplazar las llamadas a `getAuthToken()` en los componentes

### Integrar SegurosSection con API real

En `SegurosSection.tsx`, reemplaza el `useEffect` (líneas 39-118) con una llamada real a tu API:

```tsx
useEffect(() => {
  const fetchSeguros = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${baseUrl}/seguros`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error('Error fetching seguros:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchSeguros();
}, []);
```

## Estilos CSS Requeridos

Si no tienes las clases personalizadas, aquí hay ejemplos de cómo definirlas:

```css
.card {
  @apply bg-white rounded-lg shadow-soft border border-secondary-200;
}

.input-field {
  @apply w-full px-4 py-2 border border-secondary-300 rounded-lg 
         focus:outline-none focus:ring-2 focus:ring-primary-500 
         focus:border-transparent;
}

.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded-lg 
         hover:bg-primary-700 transition-colors duration-200 
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-secondary-100 text-secondary-700 px-4 py-2 rounded-lg 
         hover:bg-secondary-200 transition-colors duration-200;
}
```

## Notas Importantes

- Los componentes están diseñados para ser responsive (mobile-first)
- Utilizan iconos de `lucide-react`
- Requieren TypeScript para los tipos de datos
- Los componentes manejan estados de carga y errores internamente

## Soporte

Si necesitas ayuda para integrar estos componentes, revisa:
- La estructura de tipos TypeScript en cada componente
- Los endpoints de API esperados
- El formato de datos que cada componente espera recibir





