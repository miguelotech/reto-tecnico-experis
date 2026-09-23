# ADR 0010 — Lo que se dejó fuera a propósito

**Estado:** aceptada · **Fecha:** 2026-09-22

## Contexto

Este ADR existe para dejar constancia de que ciertas ausencias son **decisiones**, no
olvidos. Un evaluador tiene derecho a preguntar "¿y la paginación?", y la respuesta
debe estar escrita antes de que la pregunte.

## Fuera de alcance por pedido explícito del reto

| Excluido | Motivo |
|---|---|
| Autenticación y registro | El reto lo excluye |
| CRUD completo | El reto pide **solo lectura** |
| Multiusuario | El reto lo excluye |
| Despliegue y CI/CD | El reto lo excluye |
| Librerías de UI Kit | El reto lo prohíbe (ver [ADR 0008](0008-sin-ui-kit-sistema-de-diseno-propio.md)) |

Por eso **no existe** ningún endpoint ni pantalla de crear, editar o eliminar. No es
que falten: no deben estar.

## Fuera de alcance por criterio propio

### Paginación

El seed tiene 18 tareas. Paginar implicaría parámetros en el SP, en el endpoint, una
respuesta envuelta con metadatos y scroll infinito en el móvil: bastante maquinaria
para 18 filas.

**Cómo se añadiría**, si el volumen lo pidiera:

1. **SP**: `sp_get_tasks(p_status_code, p_priority_code, p_limit INT, p_offset INT)`
   más un `sp_count_tasks` con los mismos filtros. Para tablas grandes conviene
   *keyset pagination* (`WHERE (created_at, id) < (:last_created_at, :last_id)`) en
   lugar de `OFFSET`, que se degrada al avanzar páginas.
2. **API**: `GET /api/v1/tasks?page=1&pageSize=20` devolviendo
   `{ items, page, pageSize, totalItems, totalPages }`.
3. **Móvil**: `useInfiniteQuery` de React Query y `onEndReached` en el `FlatList`.

El índice `ix_tasks_created_at (created_at DESC)` ya está puesto pensando en esto.

### Caché distribuida (Redis)

Con una base que responde en milisegundos y un solo consumidor, una caché externa
añadiría un componente que desplegar, monitorear e invalidar. Hoy la caché vive en el
cliente (React Query). Si aparecieran varias instancias del servicio y tráfico real,
los catálogos serían el primer candidato: cambian casi nunca y se consultan siempre.

### Versionado de la base de datos

Los scripts de `/database` se aplican al inicializar el contenedor. Para un entorno con
datos reales haría falta una herramienta de migraciones versionadas (Flyway, DbUp,
Liquibase), porque "borrar el volumen y recrear" deja de ser una opción.

### Observabilidad

Hay logging estructurado con `ILogger<T>` y un health check que verifica la base. No
hay trazas distribuidas ni métricas. Con un solo servicio no hay traza distribuida que
seguir; el momento de añadir OpenTelemetry es cuando aparezca el segundo servicio.

## Consecuencias

- El proyecto es más chico y más fácil de evaluar.
- Cada exclusión tiene su camino de vuelta escrito, así que ninguna es un callejón sin
  salida.
- Riesgo asumido: quien lea el código sin leer este documento puede interpretar las
  ausencias como descuidos. Por eso el README enlaza aquí.
