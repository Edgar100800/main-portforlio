# Portafolio de Edgar Chambilla

Portafolio personal construido con Astro, React y Tailwind CSS. Incluye proyectos, vistas animadas y contenido en español e inglés.

## Desarrollo local

| Comando | Acción |
| --- | --- |
| `bun install` | Instalar dependencias |
| `bun run dev --host 0.0.0.0` | Abrir el desarrollo en http://localhost:4321 |
| `bun run build` | Generar la versión de producción en `dist/` |
| `bun run preview` | Revisar la compilación localmente |

## Identidad visual: liquid glass

Liquid glass es parte esencial de la página. Las tarjetas y los botones de acción deben conservar este material, incluidos **Ver detalles**, **Cerrar detalles**, **Ver código** y los enlaces a cada proyecto (por ejemplo, **Abrir PartyDeck**), con sus equivalentes en inglés. El enlace al proyecto es la acción principal y usa el nivel de cristal más brillante (`.project-glass-primary`).

- Reutilizar `.liquid-glass` de `src/styles/global.css`: transparencia, desenfoque del fondo, borde fino y reflejos interiores.
- En los controles de proyectos, combinar `.liquid-glass` con `.project-glass-button` para compartir tamaño, espaciado y estados de interacción.
- Evitar fondos opacos o reglas de hover que oculten el cristal. Los fondos sólidos se reservan para las alternativas de accesibilidad y compatibilidad ya definidas.
- Mantener texto claro, foco visible, área táctil mínima de 44 px y animaciones breves. Respetar movimiento y transparencia reducidos.
- Conservar la semántica: enlaces para navegar y `details`/`summary` para desplegar información.
- Verificar escritorio y móvil al modificar estos componentes. No retirar este estilo sin una solicitud explícita del usuario.

## Proyectos

Los datos y enlaces están en `src/lib/projects-data.ts`; los textos en `src/locales/{es,en}/common.json`. Las imágenes y los logos están en `public/projects/`, con su procedencia en [SOURCES.md](public/projects/SOURCES.md).

La investigación y las decisiones de la galería están en [el plan de proyectos](docs/plan-proyectos-portafolio.md). Las instrucciones para futuras modificaciones están en [AGENTS.md](AGENTS.md).

## Reels de Instagram

La sección «Últimos reels» muestra los tres reels más recientes de la cuenta. El flujo `.github/workflows/sync-instagram.yml` ejecuta `scripts/sync-instagram.mjs` cada 6 horas: guarda los datos en `src/data/instagram-reels.json` y las portadas en `public/instagram/`, y hace commit solo si hubo cambios. Ese push dispara el despliegue en Vercel. Si no hay reels, la sección no se muestra.

Requisitos: una cuenta profesional de Instagram (creador o empresa) y una app de Meta con «Instagram API with Instagram Login» y el permiso `instagram_business_basic`. Secretos del repositorio:

- `INSTAGRAM_ACCESS_TOKEN`: token de larga duración (60 días).
- `GH_SECRETS_PAT`: token de GitHub con permiso para escribir secretos del repositorio. El flujo lo usa cada lunes para renovar el token de Instagram; sin él, el token caduca a los 60 días.

Para sincronizar en local: `INSTAGRAM_ACCESS_TOKEN=... node scripts/sync-instagram.mjs`.
