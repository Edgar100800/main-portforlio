# Configuración de Internacionalización (i18n)

Este proyecto ahora incluye soporte completo para múltiples idiomas utilizando React i18next y Astro i18n.

## Idiomas Soportados

- **Español (es)** - Idioma por defecto
- **Inglés (en)**

## Estructura de Archivos

```
src/
├── locales/
│   ├── es/
│   │   └── common.json
│   └── en/
│       └── common.json
├── lib/
│   ├── i18n.ts
│   ├── i18n-utils.ts
│   └── ui.ts
└── components/
    ├── I18nProvider.tsx
    ├── LanguageSelector.tsx
    └── Header.tsx
```

## Rutas

- `/` - Página principal en español (idioma por defecto)
- `/en/` - Página principal en inglés
- `/links` - Enlaces en español
- `/en/links` - Enlaces en inglés

## Componentes Principales

### I18nProvider
Proveedor principal que inicializa i18next y maneja la detección de idioma basada en la URL.

### LanguageSelector
Componente dropdown para cambiar entre idiomas disponibles. Incluye:
- Detección automática del idioma actual
- Persistencia en localStorage
- Actualización de URL al cambiar idioma
- Iconos de banderas para cada idioma

### Header
Componente de navegación que incluye el selector de idioma y navegación traducida.

## Uso de Traducciones

### En componentes React

```tsx
import { useTranslation } from 'react-i18next';

function MiComponente() {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('home.greeting')}</h1>
      <p>{t('home.description')}</p>
    </div>
  );
}
```

### Con HTML dentro de traducciones

Para traducciones que incluyen HTML (como `<strong>`), usa `dangerouslySetInnerHTML`:

```tsx
<p 
  dangerouslySetInnerHTML={{ __html: t('home.description') }}
/>
```

## Archivo de Traducciones

### Estructura JSON

```json
{
  "nav": {
    "home": "Inicio",
    "projects": "Proyectos"
  },
  "home": {
    "greeting": "👋 Hola soy",
    "name": "Edgar Chambilla"
  }
}
```

### Acceso anidado

```tsx
t('nav.home')        // "Inicio"
t('home.greeting')   // "👋 Hola soy"
```

## Configuración de Astro

El archivo `astro.config.mjs` incluye la configuración i18n:

```js
i18n: {
  defaultLocale: "es",
  locales: ["es", "en"],
  routing: {
    prefixDefaultLocale: false
  }
}
```

## Detección de Idioma

El sistema detecta el idioma en el siguiente orden:
1. localStorage (preferencia guardada del usuario)
2. URL pathname (`/en/` para inglés)
3. Navegador del usuario
4. Fallback a español

## SEO y Meta Tags

Cada página incluye:
- `lang` attribute en el HTML
- Meta tags de idioma alternativo
- Links `hreflang` para SEO multiidioma

## Agregar Nuevas Traducciones

1. Agregar la clave en ambos archivos JSON (`es/common.json` y `en/common.json`)
2. Usar `t('nueva.clave')` en el componente
3. El sistema automáticamente fallback al idioma por defecto si falta una traducción

## Agregar Nuevo Idioma

1. Crear carpeta en `src/locales/[codigo-idioma]/`
2. Agregar archivo `common.json` con todas las traducciones
3. Actualizar `languages` en `src/lib/ui.ts`
4. Actualizar configuración en `astro.config.mjs`
5. Agregar al componente `LanguageSelector`

## Scripts Disponibles

- `bun run dev` - Inicia servidor de desarrollo
- `bun run build` - Construye para producción
- `bun run preview` - Vista previa de la build

## Notas Técnicas

- Las traducciones se cargan de forma síncrona al inicializar
- El componente `I18nProvider` maneja el estado de carga
- Los cambios de idioma recargan la página para garantizar consistencia
- Las rutas se manejan tanto en cliente como servidor
