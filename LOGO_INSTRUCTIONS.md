# Logo del Sistema

## Archivo Utilizado
El sistema está configurado para usar `logo.png` como logo principal.

## Ubicaciones del Logo
- **Login**: Pantalla de inicio de sesión
- **Sidebar**: Barra lateral del dashboard

## Estructura de archivos:
```
centPOSfront/
├── public/
│   ├── index.html
│   └── logo.png  ← Logo principal del sistema
├── src/
│   └── components/
│       ├── Login.tsx      ← Logo en pantalla de login
│       └── Sidebar.tsx    ← Logo en sidebar
└── ...
```

## Tamaños del Logo:
- **Login**: 64x64 píxeles (16x16 en Tailwind)
- **Sidebar**: 40x40 píxeles (10x10 en Tailwind)

El logo se muestra automáticamente en ambas ubicaciones.
