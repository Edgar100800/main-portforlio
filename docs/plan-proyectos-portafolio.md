# Plan de proyectos para el portafolio

Revisión: 16 de octubre de 2026. Estado: propuesta editorial y de implementación; no publicada.

## Objetivo y criterio de selección

Mostrar que Edgar puede construir productos web, móviles e interactivos a partir de problemas concretos. La audiencia se asume equilibrada entre clientes y reclutadores, pendiente de su respuesta. El orden puede cambiar: para clientes priorizar CREAX, TuNutri y Sin Límites; para roles técnicos priorizar Xplora, PhotoGuide y PartyDeck cuando su demo esté validada.

Seleccionar por claridad del problema, evidencia visible, profundidad técnica y variedad. La fecha del último push sirve para encontrar candidatos; no demuestra funcionamiento, autoría individual ni calidad.

Propuesta: seis destacados en la página principal, con otros proyectos en un catálogo posterior. Mantener el sistema visual actual del portafolio. No hace falta un filtro para seis tarjetas ni nuevas dependencias.

## Qué se comprobó

- Se revisaron carpetas de `..` (`/home/edgarchambilla/Projects`, el directorio padre de este repositorio), remotos Git, README, manifiestos y documentación relevante.
- Se consultaron repositorios públicos y privados accesibles de `Edgar100800`, ordenados por último push. También se identificaron repositorios de organizaciones mediante sus remotos locales.
- Se consultaron los dominios de PartyDeck y PhotoGuide en Railway y los despliegues de ASOHER y MarketGame en GitHub.
- Se hicieron solicitudes GET a las páginas públicas. Un HTTP 200 confirma respuesta de la página, no sus flujos, hidratación, recursos, autenticación o integraciones.
- No se ejecutaron compilaciones ni tests de los proyectos candidatos, ni se crearon usuarios, salas, pagos, mensajes o registros. El navegador de inspección no estaba disponible en esta sesión.
- Las métricas, testimonios y promesas de las landing pages no se consideran resultados verificados para el portafolio.

## Selección inicial: seis destacados

| Orden | Proyecto | Qué aporta a la selección | Estado comprobado | Acción antes de publicarlo |
| --- | --- | --- | --- | --- |
| 1 | CREAX | Producto comercial con catálogo, contenido con IA e integración de WhatsApp | Landing HTTP 200; funciones y dependencias encontradas en código local | Grabar un recorrido con datos de demostración y confirmar tu contribución |
| 2 | Xplora | Descubrimiento de cafeterías y arquitectura con cliente, administración y API | Sitio público HTTP 200; arquitectura local documentada | Comprobar búsqueda y ficha; determinar qué versión del código está desplegada |
| 3 | TuNutri | SaaS vertical con un problema fácil de entender | Landing HTTP 200 | Confirmar alcance de tu trabajo y grabar agenda/pacientes con datos ficticios |
| 4 | PhotoGuide | Diferenciación móvil: cámara nativa y publicación remota de contenido | Landing HTTP 200; documentación de web/iOS disponible | Presentarlo como «En desarrollo» hasta cerrar QA física y distribución |
| 5 | Sin Límites 360 | Trabajo para una organización y digitalización de operaciones | Sitio y Worker HTTP 200 | Separar el sitio público del panel; comprobar estado actual de la migración |
| 6 | Mini Mart Lab | Producto 3D jugable, distinto de las plataformas anteriores | Cloudflare Pages y GitHub Pages HTTP 200 | Validar una partida en escritorio y móvil y elegir un enlace canónico |

PartyDeck es el primer reemplazo propuesto para Mini Mart Lab si se valida el flujo multijugador. Ambos muestran juegos; mantener solo uno entre los seis iniciales ayuda a conservar variedad.

## Fichas propuestas

### 1. CREAX — plataforma para comercio y contenido con IA

**Texto para tarjeta:** «Plataforma que reúne la gestión de productos, la creación de contenido con IA y herramientas de atención por WhatsApp para negocios digitales.»

- Demo: <https://ecommerce-rho-rosy-33.vercel.app/>. Título recibido: «CREAX | Infraestructura para ecommerce modernos».
- Código: `Edgar100800/ecommerce`, privado. La copia local revisada está en `../ecommerce-security`; también se identificaron otras copias del mismo remoto al iniciar la revisión. Mostrar un único proyecto.
- Evidencia técnica: Next.js, React, Drizzle, Better Auth y Gemini; módulos de productos, identidad, generación de contenido y WhatsApp en `src/`.
- Caso de estudio: producto → información comercial → asistencia de IA → contenido → atención. Explicar qué implementaste tú y cómo se conectan las partes.
- Material: portada del dashboard, editor de producto y una generación terminada. Video de 30–45 segundos con contenido ficticio.
- CTA: «Ver plataforma» y, cuando exista, «Ver caso». Omitir el enlace al repositorio privado.
- Pendiente: verificar el recorrido completo y la correspondencia entre el despliegue y el checkout. No afirmar ventas, ahorro o conversiones sin evidencia.

### 2. Xplora — descubrimiento de cafeterías

**Texto para tarjeta:** «Plataforma para descubrir cafeterías por ubicación y características, con fichas de negocios y herramientas de administración.»

- Demo actual: <https://xplora.edgarchambilla.com/>.
- Código local principal revisado: `../Xplora-second/xplora-monorepo`; remoto `XploraApp/xplora-monorepo`. No asumir que los antiguos `xplora-app` y `xplora-web` representan esta versión.
- Arquitectura documentada: TanStack Start, ElysiaJS/Bun, PostgreSQL, Drizzle y Better Auth. Este stack corresponde al monorepo local; confirmar su relación con el sitio publicado.
- Caso de estudio: exploración → filtros → ficha; luego mostrar cómo se organiza y mantiene el catálogo.
- Material: resultados de búsqueda, ficha de cafetería y un diagrama pequeño de cliente/API/administración.
- CTA: «Explorar cafeterías».
- Pendiente: actualizar la ficha actual del portafolio, que declara Next.js/Supabase. Evitar «con IA» hasta identificar una función visible y verificable que lo respalde. No reutilizar cifras de la landing como resultados propios.

### 3. TuNutri — gestión para nutricionistas

**Texto para tarjeta:** «Plataforma para organizar citas, gestionar pacientes y centralizar el seguimiento de una consulta nutricional.»

- Demo: <https://tunutri.app/>. La landing presenta agenda, pagos, pacientes y portal de reserva.
- No se identificó el repositorio de esta versión en las carpetas revisadas ni en el listado consultado. El stack y tu responsabilidad deben confirmarse antes de redactar el caso técnico.
- Caso de estudio: reserva → organización de la consulta → seguimiento del paciente. Distinguir funcionalidades anunciadas de las que se prueben.
- Material: agenda y portal de pacientes con datos ficticios; un recorrido que no requiera dar acceso a información real.
- CTA: «Ver plataforma».
- Pendiente: confirmar qué construiste, qué está operativo y si se pueden compartir capturas. No copiar cifras de usuarios, citas o ingresos como logros verificados.

### 4. PhotoGuide — fotografía guiada en iPhone

**Texto para tarjeta:** «App de fotografía guiada con poses y referencias sobre la cámara, conectada a un panel que publica contenido remoto.»

- Demo pública preferida: <https://photoguide.click/>. Dominio alternativo verificado: <https://photoguide-web-production.up.railway.app/>.
- Código: `Edgar100800/CameraAppIOS`, privado; carpeta `../CameraAppIOS`.
- Stack documentado: SwiftUI, AVFoundation, Core Image; Next.js, SQLite/Drizzle, Cloudflare R2 y Railway para panel/API.
- Caso de estudio: publicar un template → sincronizar contenido → seleccionar una pose → encuadrar → capturar. Explicar versiones y coordenadas normalizadas si tu contribución lo justifica.
- Material: grabación del iPhone y una captura del editor de templates. El panel administrativo no debe ser el destino principal del visitante.
- CTA: «Conocer PhotoGuide» o «Ver demo en video»; sin botón de App Store hasta disponer de una ficha real.
- Pendiente: `docs/PROGRESS.md` documenta QA física y rollout pendientes. Presentarlo como desarrollo en curso; los checks históricos del documento no son pruebas ejecutadas en esta auditoría.

### 5. Sin Límites 360 — sitio y gestión de voluntariado

**Texto para tarjeta:** «Sitio institucional y herramientas para gestionar postulaciones, voluntarios y certificados verificables mediante QR.»

- Sitio público: <https://sinlimites360.org.pe/>.
- Worker documentado y accesible: <https://sinlimites360.renovandosinlimites.workers.dev/>.
- Código local: `../ONG-SinLimites`; remoto `ong-sinlimites360/landing-page`. Confirmar visibilidad antes de ofrecer «Ver código».
- Stack documentado: Astro, Cloudflare Workers, PostgreSQL/Supabase, Drizzle, Better Auth y generación de PDF/QR.
- Caso de estudio: postulación → revisión → incorporación → certificado → verificación pública.
- Material: sitio público, panel con datos ficticios y certificado de muestra claramente identificado.
- CTA: «Visitar sitio» y un caso de estudio que explique el panel.
- Pendiente: el README advierte que el dominio sirve una versión estática anterior y que la migración a Workers está incompleta. Comprobar su vigencia; no afirmar que todas las funciones están disponibles en el dominio principal. No modificar ni desplegar este proyecto como parte de actualizar el portafolio.

### 6. Mini Mart Lab — juego 3D en el navegador

**Texto para tarjeta:** «Juego de gestión de un minimercado en 3D, desarrollado para jugar desde el navegador y con soporte de instalación como PWA.»

- Demos accesibles: <https://minimart-lab.pages.dev/> y <https://edgar100800.github.io/MarketGame/>. Elegir una sola como enlace principal después del smoke test.
- Código público: <https://github.com/Edgar100800/MarketGame>.
- Stack observado: React, TypeScript, React Three Fiber, Three.js y Zustand. El último commit local menciona desbloqueo de audio iOS y PWA.
- Caso de estudio: primera partida → gestión de la tienda → progresión; explicar decisiones de controles, renderizado y audio móvil que puedas demostrar.
- Material: portada de una partida, video corto del juego y controles visibles.
- CTA: «Jugar» + «Ver código».
- Pendiente: probar carga de recursos, interacción, audio tras gesto y persistencia. Su README sigue siendo el de Vite; reemplazarlo en un trabajo posterior.

## Catálogo secundario y reservas

| Proyecto | Presentación recomendada | Evidencia disponible y siguiente paso |
| --- | --- | --- |
| PartyDeck | Juego social multijugador; candidato a destacado | Repo privado reciente, Next.js/Socket.IO/PostgreSQL y ocho juegos documentados. Dominio confirmado en Railway: <https://web-production-2f98f.up.railway.app/>. Dos solicitudes agotaron el tiempo de respuesta de 25 s; causa sin diagnosticar. Validar disponibilidad y dos jugadores antes de recomendar «Jugar» |
| BeBetter | Producto de hábitos; conservar en catálogo | <https://www.bebetter.lifestyle> HTTP 200. Confirmar contribución y probar alta/edición de hábito; stack aún sin cotejar con un repo |
| ASOHER | Caso de diseño y desarrollo institucional | <https://edgar100800.github.io/ASOHER/> HTTP 200; código público <https://github.com/Edgar100800/ASOHER>. Landing Next.js/React con contenido real; no describirla como plataforma clínica o backend |
| ParticleWall | Ingeniería gráfica y aplicación de escritorio | <https://github.com/Edgar100800/live-wallpaper>; carpeta `../live-wallpaper`. Documenta Swift/Metal y Linux Rust/wgpu. Mostrar video y código; falta compilar/probar por plataforma y verificar qué está sincronizado con el remoto |
| DroneSimulator | Demo técnica de 3D e interacción con hardware | <https://github.com/Edgar100800/DroneSimulator>; `../Drones/DroneSimulator`. React Three Fiber/Rapier y Web Serial para mando DJI. No se encontró GitHub Pages activo (API 404); preparar demo con teclado y video del mando |
| X Post Collector | Herramienta de productividad para Chrome | Repo privado y código local en `../x-post-collector`. Guardado de posts y descarga con créditos documentados. Mostrar video/instalación; no inventar enlace de Chrome Web Store |
| WhatsApp Bot Service | Arquitectura de backend o parte del caso CREAX | Repo privado, push 16/10. README: Go, FastAPI, IA/embeddings y dashboard. Homepage <https://whatsapp-bot-service.vercel.app/> respondió 200 sin título HTML: no tratarlo como demo de producto. Preferir integrarlo a CREAX si comparten el mismo flujo |
| SmartDesktopClock | Proyecto IoT | <https://github.com/Edgar100800/SmartDesktopClock>, push 10/10. ESP8266 y matriz LED 32×8, basado en PixelIt. Fotos y documentación de hardware en repo; reconocer la base y concretar aportes propios |
| Study Environment | Demo de producto educativo | <https://github.com/Edgar100800/study-environment>, push 27/09. React/TypeScript/Vite, flashcards y quizzes con progreso local. No se encontró URL en metadatos ni despliegues consultados; preparar demo y contenido que pueda compartirse |
| IEEE-CIS Fraud Detection | Caso de investigación/ML | <https://github.com/Edgar100800/ieee-cis-fraud-detection-local-benchmark>, push 23/09. Notebook e informe; revisar metodología y resultados antes de citarlos. La descripción aclara benchmark local sin submissions |
| Reloj ambiental IoT | Caso académico o complemento IoT | <https://github.com/Edgar100800/reloj-ambiental-iot>, push 23/09. Lenguaje principal TeX según metadatos; no inferir dispositivo operativo sin revisar el informe |
| Clock Manager for Work | Reserva de producto B2B | Repo privado, push 25/08, descripción de time tracker con portal de cliente. Se identificó proyecto Railway; falta revisión de código y demo |
| ManyChat Clone | Reserva de automatización | Repo privado, push 02/08 y proyecto Railway identificado. Falta evidencia funcional; definir relación con WhatsApp/CREAX antes de crear otra ficha |
| EQUIPO_VIDEO_IA | Caso colaborativo de proceso, condicionado a aclarar tu rol | Repo privado, push 12/10. README atribuye su armado a Lucciana Chambilla y declara materiales de terceros. No presentarlo como desarrollo individual tuyo; aclarar contribución y materiales compartibles |

## Qué no convertir en proyectos independientes

- `ecommerce-security`, `personal/ecommerce` y las demás copias de `Edgar100800/ecommerce`: son variantes/checkouts del mismo proyecto, no tres productos.
- AcerolaFX, melee, omdrop-owl y VoiceStudio: los remotos locales apuntan a otros autores. Solo incluir una contribución concreta con PR/commit y atribución.
- GodotDrone, stemdeck y otros forks: no basta con tener el fork. Mostrar cambios propios verificables si se incluyen.
- `CoffePass` estaba vacía; FractalWorld no tenía un remoto/README identificado en el inventario inicial. No hay evidencia suficiente para describirlos como productos listos.
- Este portafolio, templates y versiones antiguas de Xplora no deberían desplazar casos más sustantivos entre los seis destacados.

## Cómo mostrar los proyectos

Cada tarjeta debe responder, en ese orden: qué es, para quién sirve, qué permite hacer y dónde se puede probar.

Contenido mínimo: captura real, nombre, descripción de una o dos frases, hasta cuatro tecnologías verificadas y acciones disponibles. Si el proyecto está incompleto, usar un estado concreto como «En desarrollo»; mantener por separado la visibilidad del código. Un repo privado puede tener una demo pública.

Un caso de estudio posterior puede incluir problema, contribución de Edgar, recorrido del usuario, dos decisiones técnicas, evidencia visual y estado actual. No inventar fechas de lanzamiento, clientes, autoría, métricas de negocio ni testimonios. Los resultados se añaden cuando exista fuente o medición.

Evitar galerías de landing pages casi idénticas. Las portadas pueden mostrar, respectivamente, dashboard comercial, explorador de cafeterías, agenda, cámara de iPhone, panel de voluntariado y escena 3D. Usar material real del producto.

Conservar el español e inglés existentes. El texto definitivo debe reflejar el mismo alcance y estado en ambos idiomas.

## Plan de ejecución

### Fase 1. Cerrar selección y evidencia

1. Confirmar audiencia y contribución personal en cada destacado, especialmente TuNutri, proyectos de organizaciones y trabajos colaborativos.
2. Ejecutar un smoke test acotado por proyecto: CREAX con datos demo; Xplora búsqueda/ficha; TuNutri recorrido demo; PhotoGuide cámara en iPhone; Sin Límites con datos demo; Mini Mart una partida. PartyDeck necesita dos dispositivos o clientes y un ciclo completo de juego.
3. Registrar fecha, versión, URL y resultado. Si un flujo falla, corregirlo en una tarea propia o presentar únicamente un video/caso que describa con precisión el estado.
4. Elegir URL canónica para cada uno. No cambiar dominios ni infraestructura para poder completar esta planificación.

### Fase 2. Preparar material y contenido

1. Capturar una portada real y dos detalles por destacado; 16:10 para las portadas del grid actual, con el contenido principal legible también en móvil.
2. Exportar AVIF/WebP a `public/projects/`, con dimensiones explícitas y nombres estables. Las cuatro imágenes actuales no cubren los nuevos destacados.
3. Preparar seis descripciones ES/EN y completar el rol personal. Para proyectos privados, ofrecer demo o caso y ocultar el enlace de código.
4. Grabar PhotoGuide y el juego elegido; cargar video solo cuando el visitante lo solicite, con poster estático.

### Fase 3. Actualizar esta sección

1. Extraer el catálogo de `src/components/ProjectsSection.tsx` a un archivo de datos tipado, por ejemplo `src/lib/projects-data.ts`.
2. Separar campos de selección, estado del producto y visibilidad del repositorio: `id`, claves de traducción, `tech`, `image`/dimensiones, `featured`, `status`, `repositoryVisibility`, `demoUrl`, `repositoryUrl`, `videoUrl`, `caseStudyPath`. Usar solo los campos que se consuman; no crear CMS ni sincronización automática con GitHub.
3. Renderizar acciones por la existencia y validez del enlace. El `type` actual impide que un proyecto `web` muestre también su GitHub.
4. Usar un enlace con aspecto de botón (`Button asChild`, si el componente lo admite); evitar el `<a><button>…</button></a>` actual.
5. Completar `src/locales/es/common.json` y `src/locales/en/common.json`; verificar las tecnologías por proyecto. No copiar el mismo stack a todas las tarjetas.
6. Mantener grid de una columna en móvil y dos en escritorio. Revisar las animaciones `nth-child`, actualmente definidas solo para cuatro tarjetas, si se amplía a seis.
7. Empezar con los seis destacados. Crear una ruta de catálogo y casos de estudio en una entrega posterior si ya hay contenido suficiente; no enlazar rutas inexistentes.

### Fase 4. Verificación y publicación

- Ejecutar `bun run build` del portafolio una vez implementados los cambios.
- Revisar escritorio y móvil en español e inglés: imágenes, textos, teclado, foco, contraste, movimiento reducido y enlaces.
- Comprobar ausencia de enlaces vacíos, repos privados ofrecidos como públicos, capturas de datos reales y rutas inexistentes.
- Probar cada CTA y la carga de la demo elegida; documentar los flujos que no se pudieron probar.
- Revisar el diff y publicar cuando esté autorizado el despliegue. Esta planificación no modifica ni despliega las aplicaciones candidatas.

## Condición de entrega de la primera versión

Seis fichas con contenido ES/EN, portadas reales, rol personal confirmado, tecnologías cotejadas y CTA utilizables. Cada ficha tiene un estado veraz y al menos una evidencia revisada: recorrido funcional, video o caso documentado. No se necesita abrir repositorios privados ni completar todos los candidatos para lanzar esa versión.

## Fuentes de esta revisión

- Implementación actual: `src/components/ProjectsSection.tsx`, `src/locales/{es,en}/common.json`, `src/lib/links-data.ts` y `src/styles/global.css`.
- GitHub: API de repositorios de [Edgar100800](https://github.com/Edgar100800), listado autenticado, README y estados de despliegue. Los repositorios privados se referencian aquí para planificación; no son enlaces públicos propuestos.
- Railway: consultas de proyectos, servicios y dominios de PartyDeck y PhotoGuide, sin cambios de configuración.
- Código/documentación local: `../ecommerce-security`, `../Xplora-second/xplora-monorepo/README.md`, `../CameraAppIOS/{README.md,docs/PROGRESS.md}`, `../ONG-SinLimites/README.md`, `../partydeck/README.md`, `../ASOHER/PRODUCT.md`, `../MarketGame/package.json`, `../live-wallpaper/README.md`, `../Drones/DroneSimulator/README.md` y `../x-post-collector/README.md`.
- Las URLs de las fichas se consultaron el 16/10/2026; las limitaciones de la prueba HTTP se describen al inicio. Los resultados de disponibilidad son una observación puntual.


## Implementación local — 16/10/2026

La galería está implementada localmente con once proyectos: Cubits, PartyDeck, ParticleWall, CREAX, Xplora, PhotoGuide, TuNutri, Sin Límites 360, Mini Mart Lab, BeBetter y ASCII Camera. Se conservaron los proyectos anteriores y se añadieron los solicitados. Las fichas usan detalles nativos desplegables, texto ES/EN, medios locales y logos reales cuando están disponibles. La procedencia está en `public/projects/SOURCES.md`.

Instagram se actualizó a `https://instagram.com/eeed.py` en los enlaces compartidos y la página inglesa de enlaces. LinkedIn, GitHub e Instagram tienen auras con colores de marca, animadas mediante transformaciones CSS; quedan estáticas con movimiento reducido.

| Antes | Después | Motivo |
| --- | --- | --- |
| Una descripción breve por tarjeta | Resumen y detalles que se pueden abrir con teclado | Explicar el producto sin saturar la galería |
| Stack repetido y enlace GitHub condicionado por tipo | Datos por proyecto y acciones independientes | Mostrar únicamente las opciones disponibles |
| Hover con `transition-all` en la tarjeta | Transiciones concretas y aura detrás de los iconos | Mantener el contenido estable y limitar el trabajo de animación |
| Cuatro portadas | Once proyectos con capturas y logos locales | Incluir productos recientes y variedad de trabajo |

Verificación: compilación de Astro; navegador Chromium en 1440 y 390 px; apertura/cierre con teclado; contenido en español e inglés; imágenes y ausencia de desbordamiento horizontal; animación de las tres auras y fallback de movimiento reducido. No se probaron los flujos internos de las demos externas. La estructura previa de islas e i18n sigue emitiendo advertencias de hidratación al diferir el idioma inicial servidor/cliente; las fichas se renderizan y las traducciones e interacciones comprobadas funcionan.

Servidor de desarrollo: `bun run dev --host 0.0.0.0`, puerto 4321. No se ha publicado.

### Refinamiento de movimiento y lectura

Aplicadas las guías de Emil y Humanizer. Se mantuvo el liquid glass y se acortó la copia ES/EN: resumen breve, explicación destacada y funciones en texto secundario. ParticleWall muestra ahora la fórmula original de Medusa de Puntos animada, con pausa fuera de pantalla, pestaña oculta y movimiento reducido. PhotoGuide usa el icono real de iOS obtenido del repositorio actual.

| Antes | Después | Motivo |
| --- | --- | --- |
| Canvas del tamaño de todo el documento y alta densidad | Fondo fijo con bitmap máximo de 1200 × 800 | Acotar el trabajo de renderizado al viewport |
| Entradas con blur, recorte y varias animaciones sobrepuestas | Entradas cortas de opacidad y desplazamiento | Reducir repintados y movimientos simultáneos |
| Detalles con apertura y cierre instantáneos | Apertura de 220 ms y cierre de 160 ms, interrumpibles | Dar continuidad al cambio de tamaño |
| Párrafos de detalle largos y del mismo tamaño | Frase de 18–22 px, funciones de 14 px y nota secundaria | Facilitar el escaneo del contenido |

Comprobado en Chromium a 1440 y 390 px: apertura/cierre, inversión durante la animación, teclado inmediato, movimiento reducido, cambio real de cuadros en la medusa y límites del canvas de fondo. Sin desbordamiento horizontal. No se afirma una tasa de FPS medida.
