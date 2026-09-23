# ADR 0009 — React Query para el estado del servidor

**Estado:** aceptada · **Fecha:** 2026-09-22

## Contexto

La app no tiene estado propio que valga la pena administrar: todo lo que muestra vive
en el servidor. Lo que sí necesita es resolver bien los problemas de *estado remoto*:
carga, error, reintento, caché, cancelación y refresco manual.

El filtro activo, que sí es estado local, viaja como parámetro de ruta de React
Navigation, así que tampoco requiere una solución aparte.

## Opciones consideradas

**1. `useEffect` + `useState` a mano.**
Es lo que uno escribe primero, y también donde aparecen los bugs clásicos: actualizar
estado sobre un componente desmontado, condiciones de carrera cuando el usuario cambia
de filtro rápido, y ningún caché. Cada pantalla reimplementaría lo mismo, ligeramente
distinto.

**2. Redux Toolkit con RTK Query.**
Resuelve lo mismo que React Query, pero arrastra el store de Redux completo para una
app que **no tiene estado global**. Sería montar la infraestructura de un supermercado
para vender limonada.

**3. React Query (TanStack Query).** ← elegida

## Decisión

React Query, con tres hooks propios (`useTasks`, `useTaskDetail`, `useCatalogs`) que
envuelven las consultas, y una configuración explícita de reintentos.

La pieza que justifica la elección: **el reintento depende del tipo de error**.

```ts
retry: (failureCount, error) => {
  if (isAppError(error) && !error.retryable) return false;
  return failureCount < 2;
}
```

Un 400 por filtro inválido o un 404 por tarea inexistente **no se reintentan**: el
resultado sería idéntico y solo haría esperar al usuario. Un fallo de red o un 503 sí
se reintentan, porque la siguiente vez puede funcionar. Esa distinción viene del
`AppError` que produce el interceptor de axios, y es lo que conecta el contrato de
errores del backend (RFC 7807) con el comportamiento de la interfaz.

Las claves de caché incluyen los filtros (`['tasks','list',status,priority]`), así que
volver a un filtro ya consultado es instantáneo. Los catálogos se cachean 30 minutos
porque cambian muy rara vez.

## Consecuencias

**A favor**
- Cancelación real: React Query entrega un `AbortSignal` a axios, así que salir de una
  pantalla aborta la petición en vuelo, y el `CancellationToken` del backend la cancela
  hasta en la consulta a PostgreSQL.
- El pull-to-refresh es `isRefetching` + `refetch()`, sin estado manual.
- Las pantallas quedan declarativas: piden datos y describen los tres estados.

**En contra**
- Una dependencia más y un vocabulario que aprender (`staleTime`, `gcTime`,
  invalidación). Para tres consultas de lectura es más máquina de la estrictamente
  necesaria.
- La caché puede mostrar datos ligeramente viejos. Con `staleTime` de 60 segundos y
  datos que no cambian desde la app (es solo lectura), el riesgo es nulo aquí, pero
  sería una decisión a revisar si se añadiera escritura.
