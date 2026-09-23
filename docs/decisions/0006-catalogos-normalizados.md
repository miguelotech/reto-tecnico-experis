# ADR 0006 — Catálogos normalizados en vez de enums en columna

**Estado:** aceptada · **Fecha:** 2026-09-22

## Contexto

Prioridad y estado son conjuntos cerrados y pequeños: tres valores cada uno. Hay
varias formas de guardarlos y la elección afecta a la integridad de los datos, a la
API y a la pantalla de filtros del móvil.

## Opciones consideradas

**1. `VARCHAR` libre en la tabla `tasks`.**
Simple hasta que alguien inserta `"alta"`, `"ALTA"` y `"Alta"`. Nada lo impide y el
listado empieza a mostrar duplicados fantasma.

**2. `CHECK (priority IN ('LOW','MEDIUM','HIGH'))`.**
Garantiza integridad, pero agregar un valor nuevo exige `ALTER TABLE` sobre la tabla
principal, y no hay dónde guardar la etiqueta que ve el usuario ni el orden de
presentación.

**3. Tipo `ENUM` nativo de PostgreSQL.**
Integridad garantizada, pero los `ENUM` de PostgreSQL son incómodos de modificar: se
pueden añadir valores, no reordenar ni renombrar con facilidad, y tampoco admiten una
etiqueta legible aparte del valor.

**4. Tablas de catálogo con llave foránea.** ← elegida

## Decisión

Tablas `priorities` y `statuses`, cada una con `id`, `code`, `name` y `sort_order`, y
llaves foráneas desde `tasks`.

La separación entre `code` y `name` es el punto clave:

- **`code`** (`HIGH`) es el contrato técnico. Viaja en la URL, en el JSON y en el
  código. No cambia nunca.
- **`name`** (`Alta`) es lo que lee la persona. Se puede corregir, traducir o
  reescribir sin romper una sola línea de código ni un filtro guardado.

## Consecuencias

**A favor**
- La base **rechaza** una prioridad inexistente. La integridad no depende de que el
  código valide bien.
- Agregar una prioridad "Crítica" es un `INSERT`. Sin migración, sin despliegue: como
  la app móvil lee los catálogos de `/api/v1/catalogs/*`, la opción nueva aparece sola
  en la pantalla de filtros.
- `sort_order` deja que la base defina el orden de presentación, en lugar de
  hardcodearlo en la UI.

**En contra**
- Dos `JOIN` en cada consulta del listado. Con índices y este volumen es irrelevante,
  pero es un costo real que crece con la tabla.
- Tres representaciones del mismo concepto que mantener alineadas: la fila del
  catálogo, el value object `Priority` del dominio y el `CatalogItemDto` de la API.

**Nota sobre el dominio.** El value object `Priority` valida contra el mismo conjunto
de códigos. Es duplicación deliberada: la base protege la integridad de los datos y el
dominio protege la entrada de la API, de modo que un filtro inválido se rechaza con un
400 antes de gastar una conexión a la base.
