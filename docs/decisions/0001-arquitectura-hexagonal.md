# ADR 0001 — Arquitectura hexagonal en lugar de Clean Architecture

**Estado:** aceptada · **Fecha:** 2026-09-22

## Contexto

El reto pide "plantear la arquitectura como si fuera un proyecto grande", pero el
alcance real es minúsculo: tres endpoints de solo lectura sobre una tabla de 18 filas.
Hay una tensión evidente entre demostrar criterio arquitectónico y no construir un
andamio de catedral para un quiosco.

El requisito de usar procedimientos almacenados obligatoriamente es la pista más
fuerte: significa que el acceso a datos es una decisión de infraestructura que el
dominio no debe conocer.

## Opciones consideradas

**1. Arquitectura en capas clásica (Controller → Service → Repository).**
Es lo que la mayoría escribiría. Funciona, pero las dependencias apuntan hacia abajo:
el servicio conoce al repositorio concreto. Cambiar de Dapper a otra cosa obliga a
tocar la capa de negocio. No demuestra inversión de dependencias.

**2. Clean Architecture completa con CQRS y MediatR.**
Separa comandos de consultas y desacopla con un mediador. El problema: en un sistema
de **solo lectura** no hay comandos que separar de las consultas, así que la mitad del
patrón queda vacía. MediatR añadiría una indirección que hay que seguir con el
depurador para entender un flujo de tres pasos. Sería sobreingeniería visible.

**3. Hexagonal (puertos y adaptadores).** ← elegida

## Decisión

Hexagonal, con los **dos** lados del hexágono invertidos:

- El lado *driving*: el controller depende de `IGetTasksUseCase`, nunca de la clase
  concreta.
- El lado *driven*: el caso de uso depende de `ITaskRepositoryPort`, nunca de Dapper.

Cuatro proyectos: `Domain` (cero NuGet), `Application` (el hexágono), `Adapters.Rest`
y `Adapters.Persistence`.

La razón de fondo: el requisito de procedimientos almacenados **encaja exactamente**
en el puerto de salida. El SP es un detalle del adaptador; el caso de uso solo sabe
que pide tareas filtradas a algo que cumple un contrato. Hexagonal nombra esa idea
mejor que cualquier otra alternativa, y lo hace sin añadir piezas vacías.

## Consecuencias

**A favor**
- `TaskManager.Domain` no tiene una sola referencia de NuGet. Es verificable, no una
  promesa: `dotnet list package` sobre ese proyecto sale vacío.
- Los casos de uso se prueban con el puerto mockeado, sin base de datos. Los 59 tests
  del backend corren en menos de un segundo.
- Reemplazar PostgreSQL implicaría escribir un adaptador nuevo y cambiar una línea de
  registro de dependencias.

**En contra — y hay que decirlo**
- Para tres endpoints de lectura, cuatro proyectos y dos interfaces por caso de uso
  son más ceremonia de la que el problema exige. Si esto fuera un script interno y no
  un ejercicio de criterio, una sola capa bastaría.
- Un desarrollador nuevo necesita entender puertos y adaptadores antes de tocar nada.
- Cada dato atraviesa tres representaciones: `TaskRow` → `TaskItem` → `TaskSummaryDto`.
  Es mapeo que alguien tiene que mantener.

**Errores que se evitaron a propósito**
- *Puertos anémicos*: no hay una interfaz por método. `ITaskRepositoryPort` agrupa las
  dos operaciones de lectura de tareas porque son la misma responsabilidad.
- *Adaptadores que filtran sus tipos hacia adentro*: `TaskRow` es `internal` a su
  proyecto. Nada de Dapper cruza la frontera.
