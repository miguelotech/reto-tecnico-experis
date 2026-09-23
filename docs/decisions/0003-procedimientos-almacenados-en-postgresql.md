# ADR 0003 — `CREATE FUNCTION ... RETURNS TABLE` como procedimiento almacenado

**Estado:** aceptada · **Fecha:** 2026-09-22

## Contexto

El reto pide procedimientos almacenados. En SQL Server, `CREATE PROCEDURE` devuelve
result sets de forma natural y es lo que todo el mundo espera ver.

En PostgreSQL no funciona igual. `CREATE PROCEDURE` existe desde la versión 11, pero
está pensado para lógica transaccional (puede hacer `COMMIT` internamente) y **no
devuelve filas de forma natural**: habría que usar parámetros `INOUT refcursor`, que
obliga al cliente a abrir el cursor y leerlo dentro de una transacción. Es incómodo y
poco idiomático.

Es una diferencia real entre motores, no un capricho, y un evaluador acostumbrado a
SQL Server puede preguntarlo. Por eso queda escrito aquí.

## Opciones consideradas

**1. `CREATE PROCEDURE` con `INOUT refcursor`.**
Cumple con la palabra "procedure" al pie de la letra. A cambio: el adaptador tendría
que abrir transacción, invocar el procedimiento, leer el cursor y cerrarlo. Más código
en infraestructura para satisfacer una etiqueta.

**2. `CREATE FUNCTION ... RETURNS TABLE`.** ← elegida

## Decisión

Cuatro funciones que devuelven tablas:

| Función | Parámetros | Devuelve |
|---|---|---|
| `sp_get_tasks` | `p_status_code`, `p_priority_code` (ambos nullable) | 0..N tareas |
| `sp_get_task_by_id` | `p_id UUID` | 0 o 1 tarea |
| `sp_get_priorities` | — | catálogo de prioridades |
| `sp_get_statuses` | — | catálogo de estados |

Se conserva el prefijo `sp_` porque comunica la intención a quien lee el proyecto:
son procedimientos almacenados en el sentido del reto, escritos en la forma idiomática
de PostgreSQL.

El filtrado opcional se resuelve dentro del SQL con el patrón
`(p_status_code IS NULL OR s.code = p_status_code)`, que cubre las cuatro
combinaciones (sin filtros, solo estado, solo prioridad, ambos) con **una sola**
consulta y sin SQL dinámico.

## Consecuencias

**A favor**
- El adaptador las invoca con un `SELECT * FROM sp_get_tasks(@status, @priority)`
  normal, sin manejo de cursores.
- Las funciones son componibles: se pueden usar dentro de otra consulta, con `JOIN` o
  con `WHERE`, cosa que un procedimiento no permite.
- Los scripts son idempotentes (`DROP FUNCTION IF EXISTS` + `CREATE`), así que se
  pueden reaplicar sin error.

**En contra**
- Alguien que venga de SQL Server puede extrañar la palabra `PROCEDURE`. De ahí este
  documento.
- Una función no puede manejar transacciones internamente. Para este alcance de solo
  lectura da igual; si más adelante hiciera falta lógica transaccional, esa operación
  concreta sí tendría que ser un `PROCEDURE`.
