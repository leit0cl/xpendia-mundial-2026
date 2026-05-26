# Contribuir a Xpendia · Mundial 26

¡Gracias por interesarte! Este proyecto es **open source bajo MIT**, fan-driven y sin fines comerciales. Toda contribución que respete el espíritu del repo es bienvenida.

## Antes de empezar

- Lee el [README](./README.md) para entender el alcance y el stack.
- Revisa los [issues abiertos](https://github.com/leit0cl/xpendia-mundial-2026/issues) por si lo que tenías en mente ya está en discusión.
- Para cambios grandes (refactors, nuevas features), abre un issue primero para alinear antes de invertir tiempo.

## Setup

```bash
git clone https://github.com/leit0cl/xpendia-mundial-2026.git
cd xpendia-mundial-2026
npm install --legacy-peer-deps   # o pnpm install
npm run dev
```

> El flag `--legacy-peer-deps` es necesario por algunos peer-deps conflictivos en React 19 + drei. Trabajamos en limpiarlo.

## Workflow

1. **Fork** y crea una rama desde `main` con un nombre descriptivo:
   - `feat/marquee-audio` para features
   - `fix/drag-rotated-misalign` para bugs
   - `refactor/extract-geometry-helpers` para refactors
   - `docs/contributing-guide` para documentación

2. **Haz tus cambios** en commits pequeños y autocontenidos.

3. **Antes de commitear**: el hook `pre-commit` corre automáticamente `lint-staged` (eslint + prettier sobre archivos modificados). Si falla, arregla y reintenta.

4. **Antes de pushear**, valida el pipeline completo localmente:

   ```bash
   npm run lint        # ESLint
   npm run typecheck   # tsc --noEmit
   npm run test:run    # Vitest
   npm run build       # producción
   ```

5. **Abre un PR** contra `main` con descripción clara, capturas si toca UI, y referencia al issue si aplica.

## Convención de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo        | Cuándo usarlo                               |
| ----------- | ------------------------------------------- |
| `feat:`     | Nueva funcionalidad para el usuario         |
| `fix:`      | Corrección de bug                           |
| `refactor:` | Cambio de código sin cambiar comportamiento |
| `docs:`     | Solo documentación                          |
| `test:`     | Solo tests                                  |
| `chore:`    | Tooling, deps, build                        |
| `style:`    | Formato, sin lógica                         |
| `perf:`     | Mejora de performance                       |
| `a11y:`     | Accesibilidad                               |

**Ejemplos**:

```
feat(tactics): cycle arrow curvature on radar dot tap
fix(overlay): inverse rotation + zoom in pointer math
refactor(tactics): extract geometry helpers for testability
docs(readme): add World Cup 2026 group table
```

## Estándares de código

- **TypeScript estricto**: `strict: true` activado. Evita `any`; usa tipos precisos o `unknown` + narrowing.
- **No comentarios de "qué hace el código"**: el código bien nombrado se explica solo. Los comentarios son para **por qué** (decisiones no obvias).
- **No `console.log`** en código de producción. Si necesitas trazar algo, usa el patrón de `console.error` en el `ErrorBoundary` o un logger.
- **Componentes**: sigue la pirámide atómica (`atoms/molecules/organisms/templates/pages`) que ya existe.
- **Hooks**: respeta las reglas de `react-hooks` que enforcea ESLint.
- **Accesibilidad**: agrega `aria-label` en botones con iconos, respeta `prefers-reduced-motion` en animaciones nuevas, usa roles ARIA donde Chakra `Box` reemplace un elemento semántico.

## Tests

- Helpers puros viven en archivos separados (ej. `overlay/geometry.ts`) y se testean al lado (`geometry.test.ts`).
- Componentes interactivos clave (ErrorBoundary, formularios, drag handlers) se testean con `@testing-library/react`.
- Los stores de Zustand se resetean entre tests con `setState`.
- **Cobertura objetivo**: ≥60% en `features/` y `services/`.

```bash
npm run test:run            # corre todo una vez
npm run test                # watch mode
npm run test:coverage       # con reporte HTML
```

## Datos y assets

Si quieres aportar **rosters de selecciones** (`public/data/rosters-2026.json`):

- Usa **fuentes públicas y verificables** (sitios oficiales de federaciones, prensa reconocida).
- Cita la fuente en el PR.
- Mantén el formato actual: `{ id, teamCode, number, position, name, club }`.
- IDs `playerId` deben ser únicos y estables. Usa el patrón `{TEAM}-{nombre-kebab}` (ej. `ARG-lionel-messi`).
- **No subas fotos al repo** — son personales del usuario que la app gestiona localmente.

Si quieres aportar **información de equipos** (`teams-2026.json`):

- Solo datos fácticos (banderas, colores de camisetas, grupo, confederación).
- Colores se curan de Footy Headlines o anuncios oficiales de Adidas/Nike/Puma — cita en PR.

## Qué NO aceptamos

- Logos de FIFA o federaciones (problema legal).
- Streams o links a contenido pirata.
- Dependencias trackers o analytics que envíen datos del usuario.
- Cambios que rompan el modo local-first (todo debe seguir corriendo sin internet tras la primera carga).

## Issues y bugs

Reporta bugs con:

- Pasos para reproducir
- Browser + OS
- Captura o video
- Errores de consola si los hay

Para features, describe el caso de uso antes de la implementación.

## Código de conducta

Sé amable. Es un proyecto de fans, no FIFA. Cero tolerancia a discriminación.

---

¡Gracias por contribuir! 🏆
