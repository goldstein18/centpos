# Instrucciones para Agregar el Logo

## Problema
El archivo `icon.png` no se está mostrando porque no existe en la carpeta `public`.

## Solución

### Opción 1: Agregar tu archivo icon.png
1. Coloca tu archivo `icon.png` en la carpeta `public/`
2. El archivo debe estar en: `public/icon.png`
3. Reinicia el servidor de desarrollo

### Opción 2: Usar un nombre diferente
Si tu archivo tiene otro nombre, puedes:
1. Renombrarlo a `icon.png` y colocarlo en `public/`
2. O cambiar la ruta en el código:
   - En `src/components/Login.tsx`: línea donde dice `src="/icon.png"`
   - En `src/components/Sidebar.tsx`: línea donde dice `src="/icon.png"`

### Opción 3: Usar la solución temporal actual
Actualmente estoy usando una "C" estilizada como logo temporal.

## Estructura de archivos esperada:
```
centPOSfront/
├── public/
│   ├── index.html
│   └── icon.png  ← Tu archivo aquí
├── src/
│   └── components/
│       ├── Login.tsx
│       └── Sidebar.tsx
└── ...
```

## Tamaños recomendados:
- **Login**: 64x64 píxeles (16x16 en Tailwind)
- **Sidebar**: 40x40 píxeles (10x10 en Tailwind)

Una vez que agregues el archivo, el logo se mostrará automáticamente.
