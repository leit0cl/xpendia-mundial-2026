# Política de seguridad

## Versiones soportadas

Xpendia · Mundial 26 es un proyecto activo, fan-driven. Solo se proveen correcciones de seguridad para la **rama `main`** y la **última release tagged**.

| Versión               | Soportada |
| --------------------- | --------- |
| `main` (último HEAD)  | ✅        |
| Última release tagged | ✅        |
| Releases anteriores   | ❌        |

## Reportar una vulnerabilidad

**No** abras un issue público para vulnerabilidades de seguridad. En vez de eso:

1. Usa el formulario privado de GitHub: [Reportar vulnerabilidad](https://github.com/leit0cl/xpendia-mundial-2026/security/advisories/new)
2. O envía un correo a **contacto@xpendia.cl** con asunto `[SECURITY] xpendia-mundial-2026`.

Por favor incluye:

- Descripción detallada de la vulnerabilidad.
- Pasos para reproducir.
- Impacto potencial (qué se puede leer/modificar/ejecutar).
- Versión / commit afectado.
- Si tienes una propuesta de mitigación, mejor todavía.

## Qué esperar

- **24-72 h**: acuse de recibo.
- **7 días**: triaje inicial y plan de fix (o explicación de por qué no se considera vulnerabilidad).
- **30 días**: parche disponible en `main` para vulnerabilidades confirmadas. Vulnerabilidades críticas se aceleran.

Tras el fix, podemos publicar un security advisory en GitHub y darte crédito (o mantener anonimato si lo prefieres).

## Alcance

Este proyecto corre **local-first**: el código se ejecuta en el navegador del usuario y, opcionalmente, contra una instancia MinIO autohospedada. No hay backend propio que comprometer.

### Sí aplica como vulnerabilidad

- XSS, prototype pollution, o cualquier code injection en el frontend.
- Exfiltración no consentida de media local del usuario.
- Configuración de MinIO insegura por defecto en el `docker-compose.yml` provisto.
- Vulnerabilidades introducidas por dependencias (las monitorea Dependabot).
- CORS / headers que permitan abuso si el usuario hostea la app.

### No aplica como vulnerabilidad

- "El usuario puede subir cualquier archivo a su propio storage local" — es feature.
- Pull-requests con nombres de jugadores incorrectos — usa un issue normal.
- MinIO `minioadmin/minioadmin` por defecto en `docker-compose.yml`: documentado como dev-only.
- Tracking — no usamos tracking, ya es la postura. Si encuentras tracking, sí es bug.

## Dependencias y supply chain

- **Dependabot** corre semanalmente y abre PRs agrupados.
- **npm audit** se ejecutará en CI (próximamente).
- Toda PR pasa por `lint + typecheck + test + build + e2e` antes de merge.

## Reconocimientos

Cuando confirmes una vulnerabilidad válida, te listamos acá (o mantenemos anonimato si lo prefieres).

_(No hay reportes hasta la fecha.)_
