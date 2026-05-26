<div align="center">

# Xpendia · Mundial 26

**🇪🇸 Español** · [🇬🇧 English](./README.en.md)

**Tu Mundial 2026, en tu máquina.** Una web app _local-first_ para construir tu propio archivo del Mundial — colecciona fotos y videos de las 48 selecciones, dibuja tácticas en una pizarra 3D, y proyecta todo en modo presentación.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/three.js-r184-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-v3-319795?logo=chakraui&logoColor=white)](https://chakra-ui.com/)
[![i18n](https://img.shields.io/badge/i18n-ES%20%C2%B7%20EN-9b6bff)](#-internacionalizaci%C3%B3n)

</div>

---

> **Sin afiliación con FIFA ni con federaciones nacionales.** No incluye logos protegidos. Banderas, datos fácticos y rosters provienen de fuentes públicas con la atribución correspondiente. Este es un proyecto editorial y experimental — todo el contenido multimedia que subas queda en tu dispositivo.

## ¿Qué es esto?

Xpendia Mundial 26 es una **app web local** con tres oficios bajo el mismo techo:

- **Para el fan** — un álbum digital con las 48 selecciones agrupadas por confederación y por los 12 grupos oficiales. Sube fotos y videos directamente desde tu navegador; cada gol queda fichado al jugador, en tu disco.
- **Para el técnico** — una **pizarra táctica 3D regulamentaria FIFA** (105×68 m) con fichas de los dos equipos, drag físico suave, formaciones predefinidas por equipo, y un overlay 2D para dibujar líneas, flechas curvas con efecto aerodinámico, y trazos libres tipo broadcast.
- **Para presentar** — **Modo Marquesina**: pantalla completa con transiciones cinematográficas que proyecta todo el material multimedia de un equipo, con branding editorial y fondo del trofeo en efecto cromo vectorizado.

Todo corre en tu navegador. Sin nube, sin trackers, sin licencias.

## Capturas

> Las capturas en alta resolución viven en `/docs/screenshots/` (próximamente). Mientras tanto, `pnpm dev` y velo en vivo.

## Características

### 🏆 Landing editorial

- Hero con el trofeo del Mundial 2026 a escala y countdown a la fecha de inicio.
- Dos "oficios" en bento tiles: fan y técnico.
- `TacticsShowcase` — vista miniatura animada de la pizarra con dos flechas curvas en buildup por bandas (#2→#7 y #3→#11).
- `GroupsBoard` — los 12 grupos oficiales con sus 48 selecciones, color por confederación.
- `FixtureCalendar` — calendario tentativo de las 7 fases (104 partidos, 39 días).
- `ConfederationGallery` — selecciones agrupadas por AFC / CAF / CONCACAF / CONMEBOL / OFC / UEFA en carruseles con scroll-snap, anfitriones destacados.

### 📁 Selecciones y plantillas

- 48 selecciones con bandera, kit home/away, grupo, confederación y país anfitrión.
- 11 plantillas oficiales con campos `name`, `number`, `position`, `club`, `age` o `birthDate` (Argentina, Brasil, España, Francia, Inglaterra, USA, México, Canadá, **+ Corea del Sur, Bosnia y Suiza desde Wikipedia**).
- `TeamPage` para cada selección con cabecera de bandera _fullbleed_, kit colors y `PlayerGrid` responsive (2→6 columnas).
- `PlayerCard` con efecto _grayscale-shadow_ cuando aún no tiene contenido cargado; al subir media, recupera color y vida.
- `PlayerDetailModal` con galería del jugador, drag-and-drop multi-archivo y previews inline. Muestra club + edad cuando están disponibles.

### ✏️ Pizarra táctica 3D

> Ruta `/tactics`. Construida sobre **react-three-fiber** + **drei** + **zustand**.

- Pitch FIFA-scale con textura procedural de césped (canvas + ruido determinista mulberry32), líneas reglamentarias (perímetro, central, círculo r=9.15 m, áreas grandes/chicas, puntos de penal).
- **Fichas 3D** (cilindros bajos) con drag físico suave (damping factor 12), dorsal en HTML overlay, anillo de selección dorado, raycasting que respeta la rotación del campo (`worldToLocal`).
- **Formaciones independientes** por equipo Local/Visita: 4-4-2, 4-3-3, 4-2-3-1, 3-5-2, 5-3-2, 3-4-3.
- **TeamMenu** glassmorphism: añadir a cancha / banca, cambiar jugadores (swap mode), seleccionar formación.
- **Modo perspectiva 3D** con OrbitControls vs **top-down** con auto-fit automático según rotación y aspect ratio.
- **Auto-fit cámara**: al rotar el campo 90°/180°/270°, la cámara recalcula la distancia óptima para que el pitch llene el canvas en cualquier orientación.
- **Botón fullscreen** local (no Fullscreen API nativa).

### 🎨 Overlay de dibujo

Canvas 2D superpuesto al 3D, sincronizado con rotación y zoom:

- **Lápiz** con suavizado exponencial.
- **Flecha** curva (quadratic Bézier) con sensación aerodinámica:
  - Tap en el **radar blip** del origen → cicla `convex → flat → concave`.
  - Drag desde la base → mueve el origen.
  - Drag desde el **tip handle** → redirige el destino.
  - **Marching ants animados** (RAF + `lineDashOffset`) para flujo de movimiento.
- **Goma** con hit-test punto-a-segmento.
- **Paleta** gold / cyan / red / white.
- Los trazos siguen al pitch cuando rotas o zoomeas.
- Respeta `prefers-reduced-motion`.

### 🎬 Modo Marquesina

Botón en la cabecera de cada equipo (`TeamPage`) abre una proyección en pantalla completa dentro de la app (sin invocar Fullscreen API):

- Fondo: trofeo del Mundial con **efecto cromo vectorizado** (filtro SVG `feColorMatrix` + `feComponentTransfer` con tabla de tonos azul-acero).
- Recorre **toda la media** de los jugadores del equipo, en orden aleatorio.
- **7 transiciones cinematográficas** alternadas: `kenburns`, `crossfade`, `slideR`, `slideL`, `blurpull`, `whippan`, `scaledown`.
- **Empty state con YouTube embebido** + crédito al canal `@JuanPabloZaracho` cuando el equipo aún no tiene material propio.
- HUD broadcast: bandera + dorsal + nombre del jugador, branding `{Xpendia} · Mundial 26`, contador `01/12`, barra de progreso cyan→gold.
- ESC, click fuera o botón "Salir · Esc" para cerrar.
- Respeta `prefers-reduced-motion`.

### 💾 Storage

Dos backends intercambiables vía variable de entorno, ambos implementan la misma `IMediaStorage` (patrón Strategy):

- **LocalForage** (default) — IndexedDB del navegador. Sin Docker. Límite ~50 MB–2 GB según browser.
- **MinIO** (S3-compatible) — `docker compose up -d`, ideal para archivos pesados. Bucket auto-creado con CORS para `localhost:5173`.

El indicador del header muestra el backend activo en vivo.

### 🌐 Internacionalización

- **ES + EN** completos con [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/).
- Switcher ES/EN en el nav, persistido en localStorage (key `xpendia.lang`).
- Detección automática del idioma del browser en la primera visita.
- Pluralización (`trazo / trazos` ↔ `stroke / strokes`) e interpolación (`Grupo {{letter}}`, `{{pitch}}/11 cancha`).
- ~140 claves agrupadas en 20 namespaces (`nav`, `hero`, `useCase`, `tactics`, `marquee`, `settings`, etc.).

### 📱 PWA

- Manifest + service worker (vite-plugin-pwa) con Workbox runtime caching.
- `/data/*.json` cache-first 30 días → app funciona offline tras la primera carga.
- Botón **"↓ Instalar"** en el nav cuando el browser ofrece installability.

## Stack

| Capa        | Tecnología                                                                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build       | **Vite 7** + `@vitejs/plugin-react-swc` + **vite-plugin-pwa**                                                                                         |
| UI          | **React 19** + **TypeScript 5.9** strict                                                                                                              |
| Componentes | **Chakra UI v3** con tokens custom + **glass.css** editorial                                                                                          |
| 3D          | **Three.js r184** + **react-three-fiber 9** + **@react-three/drei**                                                                                   |
| Animación   | **framer-motion 12** (con `useReducedMotion`)                                                                                                         |
| Estado      | **Zustand 5** (pizarra, drawing, swap mode) + Context API (storage, rosters, media)                                                                   |
| Storage     | **LocalForage** (IndexedDB) ó **@aws-sdk/client-s3** (MinIO)                                                                                          |
| Routing     | **react-router-dom v7** (lazy + Suspense + ErrorBoundary por ruta)                                                                                    |
| Banderas    | **flag-icons** (MIT)                                                                                                                                  |
| i18n        | **i18next** + **react-i18next** + LanguageDetector                                                                                                    |
| Testing     | **Vitest** + **@testing-library/react** + **Playwright** (e2e)                                                                                        |
| Quality     | **ESLint** flat config (typescript-eslint + react-hooks + jsx-a11y) + **Prettier** + **husky** + **lint-staged** + **size-limit** + **Lighthouse CI** |

## Estructura del proyecto

```
src/
├── components/
│   ├── atoms/        # GlassPanel, FlagBadge, JerseyChip, PlayerAvatar, UploadButton, RouteSpinner
│   ├── molecules/    # PlayerCard, TeamHeader, TeamMenu, XpendiaLogo, CountdownChip,
│   │                 # LanguageSwitcher, ErrorBoundary, GroupCard, HoloTeamCard, …
│   ├── organisms/    # HeroStadium, UseCaseTrio, TacticsShowcase, GroupsBoard,
│   │                 # FixtureCalendar, ConfederationGallery, PlayerGrid, MediaUploader,
│   │                 # PlayerDetailModal, TacticsToolbar, TeamMarquee, SiteFooter
│   ├── templates/    # AppShell (nav frosted glass + storage indicator + install + lang switcher)
│   └── pages/        # HomePage, TeamPage, TacticsPage, SettingsPage, NotFoundPage
├── features/
│   └── tactics/
│       ├── three/    # TacticsCanvas, Pitch, PitchLines, Token, TokensLayer
│       ├── overlay/  # DrawingOverlay + geometry.ts (helpers puros con tests)
│       ├── store/    # useTacticsStore (zustand) — tokens, swap, strokes, formaciones
│       └── types.ts  # PITCH_WIDTH/HEIGHT, BENCH_Z, Token, Stroke, ArrowCurvature
├── contexts/         # StorageContext, MediaContext, RostersContext
├── hooks/            # usePwaInstall
├── i18n/             # config + locales ES + EN
├── services/
│   ├── storage/      # IMediaStorage, LocalForageStorage, MinioStorage
│   └── rosters/      # carga JSON estáticos + inyecta teamCode
├── routes/           # AppRoutes (lazy + ErrorBoundary por ruta)
├── theme/            # tokens.ts (Chakra system) + editorial.css + glass.css
├── test/             # setup vitest
└── types/            # Team, Player, MediaAsset (dominio compartido)

e2e/                  # Playwright tests (landing, tactics, marquee)
```

## Arranque rápido

> Requiere **Node 20+** y **npm** (o pnpm con `corepack enable`).

```bash
npm install --legacy-peer-deps
npm run dev
# → http://localhost:5173
```

Con este modo, las fotos y videos quedan en IndexedDB del navegador (single-device). Si subes muchos videos pesados, considera pasar a MinIO.

### Storage con MinIO (opcional, recomendado para archivos grandes)

```bash
docker compose up -d
```

- Console: <http://localhost:9001> (usuario `minioadmin`, pass `minioadmin`)
- API S3: <http://localhost:9000>
- Bucket auto-creado: `mundial-media` (con CORS para `localhost:5173`)

Activa el backend:

```bash
cp .env.example .env.local
# Edita .env.local:
#   VITE_STORAGE_BACKEND=minio
npm run dev
```

## Fuentes de datos y atribución

- **Equipos** (`public/data/teams-2026.json`) — derivado de [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json) (ODbL-1.0) y códigos ISO de [restcountries](https://restcountries.com/). Colores de camisetas curados desde fuentes públicas (Footy Headlines, anuncios oficiales de Adidas/Nike/Puma). Grupos y selecciones validados contra [Wikipedia ES](https://es.wikipedia.org/wiki/Equipos_participantes_en_la_Copa_Mundial_de_F%C3%BAtbol_de_2026).
- **Rosters** (`public/data/rosters-2026.json`) — 11 selecciones con plantillas tentativas. Las 3 más recientes (KOR, BIH, SUI) importadas de las tablas oficiales de Wikipedia con club + edad. El resto muestra "Roster por confirmar" hasta que se publiquen oficialmente (10 días antes del 11/06/2026 según reglamento FIFA).
- **Banderas** — [flag-icons](https://github.com/lipis/flag-icons), licencia MIT.
- **Tipografías** — Google Fonts (Fraunces, Inter Tight, JetBrains Mono).
- **Video de fondo del modo marquesina (empty state)** — [Juan Pablo Zaracho en YouTube](https://www.youtube.com/@JuanPabloZaracho), embebido con crédito visible.

## Scripts

| Comando                 | Acción                                                          |
| ----------------------- | --------------------------------------------------------------- |
| `npm run dev`           | Dev server con HMR en `:5173`                                   |
| `npm run build`         | Type-check estricto + bundle de producción + PWA service worker |
| `npm run preview`       | Sirve el build de `dist/`                                       |
| `npm run typecheck`     | `tsc --noEmit`                                                  |
| `npm run lint`          | ESLint sobre `src/`                                             |
| `npm run lint:fix`      | ESLint con auto-fix                                             |
| `npm run format`        | Prettier sobre todo                                             |
| `npm run test`          | Vitest watch                                                    |
| `npm run test:run`      | Vitest single-run                                               |
| `npm run test:coverage` | Vitest con reporte v8                                           |
| `npm run test:e2e`      | Playwright e2e                                                  |
| `npm run test:e2e:ui`   | Playwright en modo UI interactivo                               |
| `npm run size`          | Verifica bundle size budgets                                    |

## Estado del proyecto

| Fase                                                          | Estado |
| ------------------------------------------------------------- | ------ |
| Landing editorial multi-sección                               | ✅     |
| 48 selecciones + 12 grupos + calendario                       | ✅     |
| TeamPage con uploader y galería por jugador                   | ✅     |
| Storage dual (LocalForage / MinIO)                            | ✅     |
| Pizarra táctica 3D MVP                                        | ✅     |
| Overlay de dibujo libre + flechas con flow                    | ✅     |
| Modo Marquesina con cromo vectorizado                         | ✅     |
| Auto-fit de cámara en rotación                                | ✅     |
| Drag de tokens respetando rotación                            | ✅     |
| PWA + offline-first                                           | ✅     |
| i18n ES + EN                                                  | ✅     |
| Code splitting + lazy routes + ErrorBoundary                  | ✅     |
| CI: lint + typecheck + test + build + e2e + size + lighthouse | ✅     |
| Undo/redo + persistencia de pizarras                          | 🔜     |
| Marquesina con audio ambient                                  | 🔜     |
| Export de jugadas a video                                     | 🔜     |
| Más rosters (37 selecciones restantes)                        | 🔜     |

## Contribuir

PRs bienvenidos. Lee [`CONTRIBUTING.md`](./CONTRIBUTING.md) para el flujo completo y las convenciones. Antes de abrir un PR:

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run test:run    # Vitest
npm run build       # producción
```

El hook `pre-commit` (husky + lint-staged) corre `eslint --fix` + `prettier` sobre archivos staged automáticamente.

## Seguridad

Reporta vulnerabilidades vía [GitHub Security Advisories](https://github.com/leit0cl/xpendia-mundial-2026/security/advisories/new) o a contacto@xpendia.cl. Detalles en [`SECURITY.md`](./SECURITY.md).

## Código de conducta

Este proyecto adhiere al [Contributor Covenant 2.1](./CODE_OF_CONDUCT.md). Sé amable.

## Licencia

Liberado bajo licencia **MIT** — ver [`LICENSE`](./LICENSE) para el texto completo. En resumen: úsalo, modifícalo, distribúyelo, incluso comercialmente, siempre que mantengas el aviso de copyright original.

**El código es libre. La FIFA y federaciones no están afiliadas.** Banderas y datos fácticos son públicos. Ningún logo protegido está incluido en este repo. El contenido multimedia que subas a tu instalación local te pertenece a ti y nunca sale de tu dispositivo (salvo que conectes MinIO a un bucket remoto, decisión tuya).

---

<div align="center">
<sub>Hecho con cuidado en Chile · <a href="https://xpendia.cl">xpendia.cl</a></sub>
</div>
