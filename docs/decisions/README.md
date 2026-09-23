# Registro de decisiones de arquitectura (ADR)

Cada documento sigue el mismo formato: **contexto → opciones consideradas → decisión →
consecuencias**, incluidas las negativas. Las opciones descartadas se dejan escritas
porque son la mitad del razonamiento.

| # | Decisión | En una línea |
|---|---|---|
| [0001](0001-arquitectura-hexagonal.md) | Hexagonal sobre Clean Architecture | CQRS y MediatR sobrarían en un sistema de solo lectura |
| [0002](0002-dapper-sobre-ef-core.md) | Dapper sobre EF Core | Con procedimientos almacenados, un ORM completo no aporta |
| [0003](0003-procedimientos-almacenados-en-postgresql.md) | `FUNCTION ... RETURNS TABLE` | En PostgreSQL un `PROCEDURE` no devuelve filas con naturalidad |
| [0004](0004-postgresql-sobre-sql-server.md) | PostgreSQL sobre SQL Server | 240 MB y un comando contra 1.5 GB e instalación |
| [0005](0005-dotnet-10-como-target.md) | .NET 10 (LTS) | .NET 6 ya no tiene soporte; 8 y 9 terminan en nov. 2026 |
| [0006](0006-catalogos-normalizados.md) | Catálogos normalizados | La base impide una prioridad inexistente |
| [0007](0007-organizacion-feature-based-del-frontend.md) | Frontend por features | Borrar una feature es borrar una carpeta |
| [0008](0008-sin-ui-kit-sistema-de-diseno-propio.md) | Sin UI Kit | Tokens propios y componentes sobre `View` y `Pressable` |
| [0009](0009-react-query-como-capa-de-datos.md) | React Query | El reintento depende del tipo de error, no del azar |
| [0010](0010-alcance-deliberadamente-excluido.md) | Alcance excluido | Paginación y caché: decisiones, no olvidos |
| [0011](0011-escalabilidad-y-seguridad.md) | Escalabilidad y seguridad | Lo ya resuelto y lo que sería el siguiente paso |
