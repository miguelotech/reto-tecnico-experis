# Arquitectura

Documento de entrada. Explica cómo está armado el sistema y desde dónde seguir leyendo.
El *porqué* de cada decisión vive en los [ADR](decisions/README.md).

## Vista general

```
App React Native  ──HTTP──►  API .NET 10  ──procedimientos──►  PostgreSQL 16
   (móvil)                   (hexagonal)      almacenados          (Docker)
```

Tres piezas, una dirección: el móvil nunca habla con la base de datos, y la base nunca
sabe quién la consulta.

## Backend: el hexágono

Cuatro proyectos, y la regla que los ordena es una sola: **las dependencias apuntan
hacia el dominio**.

| Proyecto | Rol | De qué depende |
|---|---|---|
| `TaskManager.Domain` | Entidades, value objects, excepciones | De nada. Cero paquetes NuGet |
| `TaskManager.Application` | Puertos y casos de uso | Solo de `Domain` |
| `TaskManager.Adapters.Rest` | Controllers, errores RFC 7807, DI | De `Application` |
| `TaskManager.Adapters.Persistence` | Dapper sobre los SP | De `Application` |

Los dos adaptadores **no se conocen entre sí**. Ambos dependen del centro, y el centro
no depende de ninguno.

- Diagrama detallado: [arquitectura-backend.md](diagrams/arquitectura-backend.md)
- Por qué hexagonal y no Clean: [ADR 0001](decisions/0001-arquitectura-hexagonal.md)

### Cómo se lee un flujo

`GET /api/v1/tasks?priority=HIGH` recorre:

1. `TasksController` recibe la petición y depende de `IGetTasksUseCase`, no de una
   clase concreta.
2. `GetTasksUseCase` valida el filtro contra el catálogo del dominio. Si el código no
   existe, lanza `InvalidFilterException` y el middleware responde 400 sin tocar la
   base.
3. El caso de uso pide los datos a `ITaskRepositoryPort` — un contrato, no Dapper.
4. `TaskRepositoryAdapter` invoca `sp_get_tasks` y convierte sus filas (`TaskRow`) en
   entidades de dominio (`TaskItem`) **antes** de devolverlas.
5. `TaskMapper` traduce el dominio a DTO y el controller lo serializa.

El recorrido completo, incluyendo el lado del móvil:
[secuencia-filtrado.md](diagrams/secuencia-filtrado.md)

## Base de datos

Tres tablas: `tasks` y dos catálogos (`priorities`, `statuses`) unidos por llave
foránea. Todo el acceso pasa por cuatro funciones almacenadas.

- Modelo: [modelo-datos.md](diagrams/modelo-datos.md)
- Por qué catálogos y no enums: [ADR 0006](decisions/0006-catalogos-normalizados.md)
- Por qué `FUNCTION` y no `PROCEDURE`:
  [ADR 0003](decisions/0003-procedimientos-almacenados-en-postgresql.md)

## Móvil

Organización por features, con un sistema de diseño propio y sin ninguna librería de
componentes.

```
src/
├── app/          → App, navegación, providers
├── features/tasks/
│   ├── screens/     → Lista · Filtros · Detalle
│   ├── components/  → TaskCard, badges, ListHero
│   ├── hooks/       → useTasks, useTaskDetail, useCatalogs
│   ├── services/    → taskApi
│   └── types/
├── shared/       → theme, componentes base, http, utils
└── config/       → URL de la API
```

La capa HTTP traduce el `ProblemDetails` del backend a un `AppError` propio, de modo
que las pantallas nunca ven un error de axios y el reintento puede decidirse según el
tipo de fallo.

- [ADR 0007](decisions/0007-organizacion-feature-based-del-frontend.md) — features
- [ADR 0008](decisions/0008-sin-ui-kit-sistema-de-diseno-propio.md) — sin UI Kit
- [ADR 0009](decisions/0009-react-query-como-capa-de-datos.md) — React Query

## Lo que no está, y por qué

Paginación, caché distribuida, autenticación y escritura están fuera de alcance de
forma deliberada, con su camino de vuelta escrito en el
[ADR 0010](decisions/0010-alcance-deliberadamente-excluido.md). Lo relativo a índices,
inyección SQL y exposición de errores está en el
[ADR 0011](decisions/0011-escalabilidad-y-seguridad.md).
