# CentPOS Dashboard

Un sistema moderno y responsivo de Punto de Venta (POS) construido para empresas fintech usando React, TypeScript y Tailwind CSS.

## Características

- 🔐 **Sistema de Login Seguro** - Autenticación moderna con validación de formularios
- 💳 **Procesamiento de Abonos** - Formulario completo de transacciones con múltiples métodos de pago
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
│   └── TransactionForm.tsx # Formulario de procesamiento de abonos
├── App.tsx                 # Componente principal de la aplicación
├── index.tsx              # Punto de entrada de la aplicación
└── index.css              # Estilos globales e imports de Tailwind
```

## Key Components

### Login Component
- Modern authentication form with validation
- Password visibility toggle
- Loading states and error handling
- Remember me functionality

### Dashboard
- Overview with key business metrics
- Recent transaction history
- Quick action buttons
- Responsive grid layout

### Sidebar Navigation
- Clean navigation menu
- Active state indicators
- User profile section
- Notification system

### Transaction Form
- Comprehensive customer information fields
- Multiple payment method support
- Product and quantity management
- Notes and additional information
- Form validation and processing states

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

