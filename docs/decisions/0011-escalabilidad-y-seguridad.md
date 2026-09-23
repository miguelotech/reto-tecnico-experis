# ADR 0011 — Escalabilidad y seguridad

**Estado:** aceptada · **Fecha:** 2026-09-22

## Contexto

El proyecto no va a producción, pero las decisiones que lo prepararían (o que lo
impedirían) se toman igual desde el primer día. Este ADR separa lo que **ya está
hecho** de lo que sería el siguiente paso.

## Lo que ya está resuelto

### Inyección SQL: imposible por construcción

Todo el acceso pasa por procedimientos almacenados invocados con parámetros nombrados
de Dapper. En ningún punto se concatena entrada del usuario dentro de una cadena SQL.
Además, un valor de filtro que no exista en el catálogo se rechaza en el dominio con un
400 **antes** de llegar a la base.

Son dos barreras independientes: aunque una fallara, la otra sigue en pie.

### Los errores no filtran detalles internos

El contrato es RFC 7807 (`ProblemDetails`) en todos los casos:

| Situación | Código | Qué se expone |
|---|---|---|
| Filtro con valor inexistente | 400 | El valor inválido y la lista de aceptados |
| Id con formato no-UUID | 400 | Que el formato es inválido |
| Tarea no encontrada | 404 | Nada más que eso |
| Base de datos no disponible | 503 | Mensaje genérico |
| Excepción no controlada | 500 | Mensaje genérico; el detalle va solo al log |

Una cadena de conexión o un stack trace nunca cruzan la frontera HTTP. El `traceId`
permite correlacionar el error del usuario con el log del servidor sin revelar nada.

### Índices pensados para el crecimiento

```sql
CREATE INDEX ix_tasks_status_priority ON tasks (status_id, priority_id);
CREATE INDEX ix_tasks_created_at ON tasks (created_at DESC);
```

Con 18 filas PostgreSQL los ignora: un scan secuencial le sale más barato, y eso es lo
correcto. Están puestos para cuando la tabla crezca, porque cubren exactamente los dos
patrones de acceso que existen (filtrar por estado y prioridad, ordenar por fecha).

### Cancelación de extremo a extremo

El `CancellationToken` recorre controller → caso de uso → repositorio → Npgsql. Una
petición abandonada libera la conexión en lugar de seguir ocupando la base.

### Otros

- Sin secretos reales en el repositorio: la cadena de conexión de desarrollo apunta a
  credenciales locales de Docker y `appsettings.Production.json` está en `.gitignore`.
- Conexiones creadas por petición mediante una fábrica, apoyadas en el pool de Npgsql.
  No hay un `IDbConnection` singleton compartido.
- Health check que verifica de verdad la base, no solo que el proceso esté vivo.

## Lo que sería el siguiente paso

**HTTPS obligatorio.** Hoy la API sirve HTTP en local. En producción: TLS terminado en
el balanceador, `UseHsts()` y redirección permanente.

**Rate limiting.** .NET trae `AddRateLimiter` integrado. Una ventana fija por IP sobre
los endpoints de lectura bastaría para el abuso trivial.

**CORS restrictivo.** La política actual es permisiva para desarrollo, porque el
emulador cambia de origen. En producción se fija la lista de orígenes permitidos.

**Autenticación.** Está fuera del reto, pero condiciona el modelo de datos: hoy `tasks`
no tiene `owner_id`. Introducir usuarios significa añadir esa columna, filtrarla en
cada SP y validar la propiedad en el caso de uso. Es una migración con impacto, y por
eso conviene decirlo ahora y no descubrirlo después.

**Escalado horizontal.** El servicio es sin estado, así que varias instancias detrás de
un balanceador no requieren cambios. El cuello de botella aparecería primero en las
conexiones a PostgreSQL, y la respuesta sería PgBouncer antes que más réplicas.

## Consecuencias

- Lo hecho no compromete lo que falta: ninguna decisión actual cierra la puerta a
  HTTPS, rate limiting ni autenticación.
- La excepción honesta es la autenticación: al no existir `owner_id`, añadir usuarios
  sería una migración de esquema y no un simple `ALTER TABLE` sin consecuencias.
