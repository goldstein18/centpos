# CentPOS - Sistema de Abonos

Un sistema moderno y responsivo para el registro de abonos construido con React, TypeScript y Tailwind CSS.

## Características

- 🔐 **Sistema de Login Seguro** - Autenticación moderna con validación de formularios
- 💳 **Registro de Abonos** - Sistema simple para registrar abonos con verificación doble
- 📊 **Reportes** - Informes y métricas de negocio
- 🎨 **UI/UX Moderna** - Diseño hermoso y responsivo con animaciones suaves

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd centPOSfront
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Credenciales Demo

- **Usuario**: `admin`
- **Contraseña**: `password`

## Estructura del Proyecto

```
src/
├── components/
│   ├── Login.tsx           # Componente de autenticación
│   ├── Dashboard.tsx       # Layout principal del dashboard
│   ├── Sidebar.tsx         # Barra lateral de navegación
│   └── TransactionForm.tsx # Formulario de registro de abonos
├── App.tsx                 # Componente principal de la aplicación
├── index.tsx              # Punto de entrada de la aplicación
└── index.css              # Estilos globales e imports de Tailwind
```

## Componentes Principales

### Componente de Login
- Formulario de autenticación moderno con validación
- Toggle de visibilidad de contraseña
- Estados de carga y manejo de errores
- Funcionalidad "Recordarme"

### Dashboard
- Navegación simple entre Abonos y Reportes
- Interfaz limpia y responsiva
- Diseño optimizado para el flujo de trabajo

### Barra Lateral de Navegación
- Menú de navegación limpio
- Indicadores de estado activo
- Sección de perfil de usuario
- Sistema de notificaciones

### Formulario de Registro de Abonos
- **Número de teléfono**: Introducido dos veces para verificación
- **Monto a abonar**: Introducido dos veces para verificación
- **Sistema de desplazamiento**: El monto se desplaza automáticamente a la izquierda
- **Validación en tiempo real**: Verificación de coincidencia de datos
- **Interfaz intuitiva**: Guías visuales para el usuario

## Cómo Funciona el Sistema de Abonos

### Registro de Abonos
1. **Número de Teléfono**: Se introduce dos veces para evitar errores
2. **Monto**: Se introduce dos veces para verificación
3. **Desplazamiento Automático**: El sistema convierte automáticamente los números:
   - `100` → `$10.00`
   - `15` → `$1.50`
   - `5` → `$0.50`

### Validaciones
- Número de teléfono debe tener al menos 10 dígitos
- Los números de teléfono deben coincidir
- Los montos deben coincidir
- Solo se permiten números (sin letras ni símbolos)

## Customization

### Colors
The application uses a custom color palette defined in `tailwind.config.js`:

- **Primary**: Blue shades for main actions and branding
- **Secondary**: Gray shades for text and backgrounds
- **Success**: Green for positive actions
- **Warning**: Yellow for pending states
- **Error**: Red for errors and failures

### Styling
Custom CSS classes are defined in `src/index.css`:

- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.input-field` - Form input styling
- `.card` - Card container styling

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

