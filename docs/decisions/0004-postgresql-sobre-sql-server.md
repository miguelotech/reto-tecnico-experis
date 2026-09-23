# ADR 0004 — PostgreSQL en lugar de SQL Server

**Estado:** aceptada · **Fecha:** 2026-09-22

## Contexto

El reto pide "una base de datos relacional" sin especificar cuál. El criterio de
elección no es técnico en el vacío: el evaluador tiene que poder levantar el proyecto
en su máquina, y cada minuto de instalación es fricción.

## Opciones consideradas

**1. SQL Server (Developer Edition o contenedor).**
Es la opción "natural" en el mundo .NET y la que mejor encaja con la palabra
*stored procedure*. En contra: la imagen oficial pesa alrededor de 1.5 GB y hasta hace
poco no corría de forma nativa en Mac con Apple Silicon, lo que obligaba a emulación.

**2. SQLite.**
Cero instalación, un archivo. Pero **no tiene procedimientos almacenados**. Queda
descartada por el requisito explícito del reto.

**3. MySQL / MariaDB.**
Tiene `CREATE PROCEDURE` con result sets naturales, lo que evitaría el ADR 0003. En
contra: tipos menos ricos (sin `UUID` nativo, sin `TIMESTAMPTZ` real) y una comunidad
menos activa en el ecosistema .NET moderno.

**4. PostgreSQL 16.** ← elegida

## Decisión

PostgreSQL 16 en Docker, expuesto en el puerto **5433** del host.

Tres razones, en orden de peso:

1. **Reproducibilidad.** Un `docker compose up -d` deja la base con esquema,
   procedimientos y datos cargados. Los scripts de `/database` se ejecutan solos al
   inicializar el volumen. El evaluador no instala nada pesado.
2. **La imagen `postgres:16-alpine` pesa unos 240 MB** contra 1.5 GB de SQL Server, y
   corre nativa en ARM y en x86.
3. **Tipos que este modelo aprovecha**: `UUID` con `gen_random_uuid()` nativo y
   `TIMESTAMPTZ` con zona horaria de verdad.

El puerto 5433 en lugar del 5432 es deliberado: evita el choque si el evaluador ya
tiene un PostgreSQL instalado en su máquina.

## Consecuencias

**A favor**
- Setup reproducible en un comando y sin instaladores.
- Licencia permisiva, sin ediciones ni límites que revisar.

**En contra**
- Obliga al rodeo de `FUNCTION ... RETURNS TABLE` explicado en el ADR 0003.
- Requiere Docker instalado. Es el único prerrequisito pesado del backend, y se
  consideró aceptable porque hoy es herramienta estándar.
- Si la empresa fuera "tienda Microsoft" de punta a punta, SQL Server sería la
  elección correcta por alineación con el resto de su infraestructura. La decisión
  aquí optimiza para que el proyecto se levante en cualquier máquina.
