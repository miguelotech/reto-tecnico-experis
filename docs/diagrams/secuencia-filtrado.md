# Secuencia: el usuario filtra por prioridad Alta

Recorrido completo de un toque en la pantalla de filtros hasta el procedimiento
almacenado y de vuelta.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario
    participant F as TaskFilterScreen
    participant L as TaskListScreen
    participant Q as React Query
    participant H as httpClient (axios)
    participant C as TasksController
    participant UC as GetTasksUseCase
    participant R as TaskRepositoryAdapter
    participant DB as PostgreSQL

    U->>F: Toca "Alta" y luego "Aplicar"
    F->>L: navigate("TaskList", { filters })
    L->>Q: useTasks({ status: null, priority: "HIGH" })

    alt Ya hay datos en cache para ese filtro
        Q-->>L: Devuelve el resultado cacheado
    else Primera vez con ese filtro
        Q->>H: GET /api/v1/tasks?priority=HIGH
        H->>C: HTTP + CancellationToken
        C->>UC: ExecuteAsync(TaskFilter("", "HIGH"), ct)
        UC->>UC: Priority.Parse("HIGH") valida contra el catalogo
        Note over UC: Si el codigo no existe lanza<br/>InvalidFilterException y el<br/>middleware responde 400
        UC->>R: FindAllAsync(TaskCriteria, ct)
        R->>DB: SELECT * FROM sp_get_tasks(NULL, 'HIGH')
        DB-->>R: Filas ordenadas por prioridad y fecha
        R->>R: TaskRow → TaskItem (dominio)
        R-->>UC: IReadOnlyList<TaskItem>
        UC->>UC: TaskMapper: dominio → TaskSummaryDto
        UC-->>C: IReadOnlyList<TaskSummaryDto>
        C-->>H: 200 OK (JSON)
        H-->>Q: TaskSummary[]
    end

    Q-->>L: data, isPending, error
    L-->>U: Lista filtrada + chip "Alta" con boton de quitar
```

## Detalles que el diagrama deja ver

- **La cancelación viaja completa.** El `CancellationToken` nace en el controller y
  llega hasta Npgsql. Si el usuario sale de la pantalla, React Query aborta la
  petición y la consulta se cancela también del lado del servidor.
- **La validación ocurre antes de tocar la base.** Un filtro inválido nunca llega al
  procedimiento almacenado: el caso de uso lo rechaza contra el catálogo del dominio.
- **La caché evita el viaje.** Volver a un filtro ya consultado no genera petición
  HTTP mientras el dato siga fresco (60 segundos).
