# ADR 0007 — Organización por features en el frontend

**Estado:** aceptada · **Fecha:** 2026-09-22

## Contexto

Una app React Native se puede organizar por tipo de archivo (todas las pantallas
juntas, todos los componentes juntos) o por funcionalidad. Con tres pantallas la
diferencia parece cosmética; con treinta, decide si el proyecto es navegable.

## Opciones consideradas

**1. Por tipo: `screens/`, `components/`, `hooks/`, `services/`.**
Es lo que genera casi cualquier tutorial. El problema aparece al crecer: tocar una
funcionalidad obliga a abrir cuatro carpetas distintas, y nada indica qué archivos van
juntos. `components/` termina siendo un cajón de sastre de 40 elementos sin relación.

**2. Por feature: `features/tasks/{screens,components,hooks,services,types}`.** ← elegida

## Decisión

```
src/
├── app/         → arranque, navegación, providers
├── features/
│   └── tasks/   → todo lo de tareas, junto
├── shared/      → theme, componentes base, http, utils
└── config/      → URL de la API
```

La regla que separa `features/` de `shared/`: **algo vive en `shared/` cuando lo usaría
otra feature distinta.** `Button` y `Chip` no saben qué es una tarea, por eso son
compartidos. `TaskCard` y `PriorityBadge` solo tienen sentido con tareas, por eso viven
en la feature.

## Consecuencias

**A favor**
- Agregar una feature nueva (por ejemplo, proyectos) es crear una carpeta, sin tocar
  las existentes.
- Borrar una feature es borrar su carpeta. No quedan huérfanos repartidos.
- La estructura le dice a quien llega qué hace la app: se ve "tasks", no "components".

**En contra**
- Aparece la pregunta recurrente de dónde va cada cosa, y hay casos ambiguos. La regla
  de arriba resuelve la mayoría, pero no todos.
- Con una sola feature, la carpeta intermedia `features/tasks/` puede parecer
  ceremonia. Es una apuesta al crecimiento, coherente con el "como si fuera un
  proyecto grande" que pide el reto.
