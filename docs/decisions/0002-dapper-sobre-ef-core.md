# ADR 0002 — Dapper en lugar de Entity Framework Core

**Estado:** aceptada · **Fecha:** 2026-09-22

## Contexto

El reto exige que **todo** el acceso a datos pase por procedimientos almacenados. No
hay queries inline ni SQL generado. La pregunta es qué biblioteca usar para invocar
esos procedimientos y materializar sus filas.

## Opciones consideradas

**1. Entity Framework Core.**
Es el ORM por defecto del ecosistema .NET. Pero su valor está en lo que aquí no se va
a usar: generación de SQL, seguimiento de cambios, migraciones, LINQ traducido. Con
procedimientos almacenados quedaría reducido a `FromSqlRaw`, es decir, a un ejecutor
de SQL caro. Además su seguimiento de entidades añade trabajo inútil en consultas de
solo lectura, y habría que desactivarlo con `AsNoTracking()` en todas partes.

**2. ADO.NET puro (`NpgsqlCommand` + `DataReader`).**
Cero dependencias y control total, pero obliga a escribir el mapeo columna por columna
a mano. Es código repetitivo y frágil: un cambio de nombre de columna se descubre en
tiempo de ejecución.

**3. Dapper.** ← elegida

## Decisión

Dapper, invocando los procedimientos con `SELECT * FROM sp_...(@p1, @p2)` y parámetros
nombrados.

Dapper es un micro-ORM: hace exactamente una cosa, mapear el resultado de una consulta
a objetos, y no intenta generar SQL. Eso es justo lo que este proyecto necesita, porque
el SQL ya está escrito y vive en la base de datos.

## Consecuencias

**A favor**
- El SQL que se ejecuta es el que está en `/database`. No hay una capa que lo
  reescriba, así que lo que se lee en el repositorio es lo que llega al servidor.
- Los parámetros van siempre parametrizados, nunca concatenados: inmune a inyección
  SQL por construcción.
- Arranque más rápido y menos memoria que EF: no hay que construir un modelo en
  memoria al iniciar.

**En contra**
- No hay migraciones. El esquema se versiona a mano en los scripts de `/database`. En
  un proyecto grande esto exigiría una herramienta aparte (Flyway, DbUp o similar).
- No hay seguimiento de cambios ni unidad de trabajo. Si mañana entrara escritura con
  varias tablas, habría que manejar transacciones explícitamente.
- El mapeo es por convención de nombres: si una columna cambia de nombre en el SP, el
  error aparece en tiempo de ejecución. Se mitiga con los tests de integración.
