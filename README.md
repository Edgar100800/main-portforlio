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

Liquid glass es parte esencial de la página. Las tarjetas y los botones de acción deben conservar este material, incluidos **Conocer**, **Ver menos**, **GitHub**, **Ver web** y sus equivalentes en inglés.

- Reutilizar `.liquid-glass` de `src/styles/global.css`: transparencia, desenfoque del fondo, borde fino y reflejos interiores.
- En los controles de proyectos, combinar `.liquid-glass` con `.project-glass-button` para compartir tamaño, espaciado y estados de interacción.
- Evitar fondos opacos o reglas de hover que oculten el cristal. Los fondos sólidos se reservan para las alternativas de accesibilidad y compatibilidad ya definidas.
- Mantener texto claro, foco visible, área táctil mínima de 44 px y animaciones breves. Respetar movimiento y transparencia reducidos.
- Conservar la semántica: enlaces para navegar y `details`/`summary` para desplegar información.
- Verificar escritorio y móvil al modificar estos componentes. No retirar este estilo sin una solicitud explícita del usuario.

## Proyectos

Los datos y enlaces están en `src/lib/projects-data.ts`; los textos en `src/locales/{es,en}/common.json`. Las imágenes y los logos están en `public/projects/`, con su procedencia en [SOURCES.md](public/projects/SOURCES.md).

La investigación y las decisiones de la galería están en [el plan de proyectos](docs/plan-proyectos-portafolio.md). Las instrucciones para futuras modificaciones están en [AGENTS.md](AGENTS.md).
