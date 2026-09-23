# ADR 0008 — Sistema de diseño propio, sin librerías de UI

**Estado:** aceptada · **Fecha:** 2026-09-22

## Contexto

El reto **prohíbe** explícitamente las librerías de UI Kit: nada de React Native Paper,
NativeBase, UI Kitten, Tamagui ni Gluestack. Todo componente visual se construye sobre
`View`, `Text`, `Pressable` y `FlatList` con `StyleSheet`.

La prohibición no es arbitraria: quiere ver si quien desarrolla sabe construir una
interfaz consistente sin que otro se la haya resuelto.

## Decisión

Un sistema de diseño en `src/shared/theme`, con cuatro archivos de tokens y ninguna
dependencia visual:

| Token | Contenido |
|---|---|
| `colors.ts` | Paleta + tonos semánticos por prioridad y estado |
| `spacing.ts` | Escala en múltiplos de 4 (`xs` 4 … `xxxl` 48) |
| `typography.ts` | Escala tipográfica sobre DM Sans, con tracking por tamaño |
| `radius.ts` | Radios de esquina |
| `elevation.ts` | Dos sombras, por rol: tarjeta y barra |

Sobre esos tokens se construyen seis componentes compartidos (`Button`, `Chip`,
`Screen`, `Loader`, `EmptyState`, `ErrorState`) y los de la feature.

### Las decisiones visuales, y su porqué

**Prioridad rellena, estado delineado.** Son dos dimensiones distintas del mismo dato.
Si ambas fueran píldoras de color, habría que leer el texto para saber cuál es cuál.
Con una rellena y otra delineada, la forma las distingue antes que la lectura.

**El color es semántico, no decorativo.** Rojo, ámbar y verde en prioridad; gris, azul
y verde en estado. Cada tono se define una sola vez y se resuelve por código
(`priorityTone('HIGH')`), con un tono neutro de respaldo: si la API devolviera mañana
una prioridad "CRITICAL" que el móvil no conoce, se pinta en gris en vez de romperse.

**Tipografía empaquetada, no heredada.** DM Sans viaja dentro de la app como recurso
nativo en iOS y Android. Si se usara la fuente del sistema, la app se vería distinta
en cada plataforma (SF Pro contra Roboto) y la jerarquía tipográfica no sería la misma.

**Escala de espaciado en múltiplos de 4.** Nadie decide "aquí van 13 píxeles". Todo
sale de la escala, y por eso las tarjetas tienen los mismos márgenes internos entre sí.

## Consecuencias

**A favor**
- `package.json` no tiene ninguna dependencia visual. Es verificable de un vistazo.
- Cambiar la identidad visual de la app es editar los tokens, no perseguir estilos por
  los archivos.
- Bundle más liviano: no se arrastra un catálogo de componentes del que se usarían
  cinco.

**En contra**
- Hay que construir a mano lo que una librería regala: estados de presionado,
  accesibilidad, áreas táctiles. Cada `Pressable` lleva su `accessibilityRole`,
  `accessibilityLabel` y `accessibilityState` escritos explícitamente.
- No hay componentes complejos disponibles. Si el proyecto necesitara un selector de
  fecha o un modal de acciones, habría que escribirlos.
- El sistema es tan consistente como la disciplina de quien lo use: nada impide
  escribir un color suelto. En un equipo, esto se blindaría con una regla de lint.
