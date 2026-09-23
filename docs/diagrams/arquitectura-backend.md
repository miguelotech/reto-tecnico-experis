# Arquitectura del backend (hexagonal)

Las flechas indican **dependencia**: quien apunta conoce al apuntado. Todas terminan
en el dominio, nunca salen de él. Los adaptadores dependen de los puertos; los
puertos no saben que existen los adaptadores.

```mermaid
flowchart LR
    subgraph driving["Lado driving (quien maneja la app)"]
        MOBILE["App React Native"]
        SWAGGER["Swagger / curl"]
    end

    subgraph rest["TaskManager.Adapters.Rest"]
        CTRL["TasksController<br/>CatalogsController"]
        MW["Manejadores de excepciones<br/>(RFC 7807)"]
    end

    subgraph app["TaskManager.Application"]
        PIN["Puertos de entrada<br/>IGetTasksUseCase<br/>IGetTaskByIdUseCase<br/>IGetCatalogsUseCase"]
        UC["Casos de uso<br/>GetTasksUseCase<br/>GetTaskByIdUseCase<br/>GetCatalogsUseCase"]
        POUT["Puertos de salida<br/>ITaskRepositoryPort<br/>ICatalogRepositoryPort"]
        MAP["TaskMapper<br/>(dominio → DTO)"]
    end

    subgraph domain["TaskManager.Domain"]
        ENT["TaskItem<br/>Priority · Status<br/>TaskCriteria"]
        EXC["Excepciones de dominio"]
    end

    subgraph persistence["TaskManager.Adapters.Persistence"]
        REPO["TaskRepositoryAdapter<br/>CatalogRepositoryAdapter"]
        DAPPER["Dapper + Npgsql<br/>TaskRow (no sale de aqui)"]
    end

    DB[("PostgreSQL 16<br/>sp_get_tasks<br/>sp_get_task_by_id<br/>sp_get_priorities<br/>sp_get_statuses")]

    MOBILE -->|HTTP| CTRL
    SWAGGER -->|HTTP| CTRL
    CTRL --> PIN
    MW --> EXC
    UC -.implementa.-> PIN
    UC --> POUT
    UC --> MAP
    UC --> ENT
    MAP --> ENT
    REPO -.implementa.-> POUT
    REPO --> DAPPER
    REPO --> ENT
    DAPPER -->|CALL| DB

    style domain fill:#151B3D,color:#FFFFFF
    style app fill:#E6EDFF,color:#151B3D
    style rest fill:#E7F6EE,color:#151B3D
    style persistence fill:#FDF4E2,color:#151B3D
```

## Lo que hay que mirar en el diagrama

1. **El controller no conoce ninguna clase concreta.** Depende de `IGetTasksUseCase`,
   que vive en `Application`. Cambiar el caso de uso no toca el controller.
2. **El caso de uso no conoce Dapper.** Depende de `ITaskRepositoryPort`. Si mañana el
   origen de datos fuera un servicio externo en lugar de PostgreSQL, se escribe otro
   adaptador y el hexágono no se entera.
3. **`TaskRow` no cruza la frontera.** El adaptador de persistencia mapea sus filas a
   `TaskItem` antes de devolver. Ningún tipo de Dapper o Npgsql entra a `Application`.
4. **`Domain` no tiene un solo paquete NuGet.** Es la prueba de que la inversión de
   dependencias está bien aplicada y no solo dibujada.
