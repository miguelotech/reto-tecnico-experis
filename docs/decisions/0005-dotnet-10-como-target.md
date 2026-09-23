# ADR 0005 — .NET 10 como framework objetivo

**Estado:** aceptada · **Fecha:** 2026-09-22

## Contexto

El reto pide ".NET 6 o superior". Esa frase se escribió cuando .NET 6 era vigente, y
hoy ya no lo es. Elegir versión es una decisión de mantenibilidad, no de preferencia
personal, así que conviene mirar el calendario de soporte antes que la novedad.

| Versión | Tipo | Fin de soporte |
|---|---|---|
| .NET 6 | LTS | 12 de noviembre de 2024 — **ya sin soporte** |
| .NET 8 | LTS | 10 de noviembre de 2026 |
| .NET 9 | STS | 10 de noviembre de 2026 |
| **.NET 10** | **LTS** | **noviembre de 2028** |
| .NET 11 | STS | ~2027 |

## Opciones consideradas

**1. .NET 6, al pie de la letra del enunciado.**
Cumpliría literalmente, pero significa entregar código sobre una versión sin parches
de seguridad desde hace casi dos años. Cumplir la letra y fallar el espíritu.

**2. .NET 8 o 9.**
Ambas tienen soporte hoy, pero las dos terminan el **10 de noviembre de 2026**. Un
proyecto que nace en septiembre de 2026 sobre cualquiera de ellas nace con dos meses
de vida útil.

**3. .NET 11 (STS).**
Es la más nueva, pero las versiones STS tienen 18 meses de soporte y el ecosistema
(bibliotecas, imágenes de contenedor, documentación) tarda en asentarse.

**4. .NET 10 (LTS).** ← elegida

## Decisión

`<TargetFramework>net10.0</TargetFramework>` en los cuatro proyectos, centralizado en
`Directory.Build.props` para que no haya forma de que se desalineen.

## Consecuencias

**A favor**
- Soporte hasta finales de 2028: tres años de parches sin migrar.
- Cumple "6+" con holgura.
- `Directory.Build.props` garantiza una sola fuente de verdad para la versión.

**En contra**
- Exige el SDK 10 instalado. Alguien con solo el SDK 8 no compila el proyecto sin
  actualizar, y eso es fricción real para el evaluador. El README lo indica como
  prerrequisito con el comando de verificación.
- Al ser reciente, alguna biblioteca de terceros podría no tener binarios específicos.
  No fue el caso: Dapper, Npgsql y xUnit funcionan sin ajustes.
