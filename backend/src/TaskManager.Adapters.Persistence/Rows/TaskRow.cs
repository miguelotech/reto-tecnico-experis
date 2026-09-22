namespace TaskManager.Adapters.Persistence.Rows;

// forma cruda de lo que devuelve el SP. no sale de este proyecto.
internal sealed class TaskRow
{
    public Guid Id { get; init; }

    public string Title { get; init; } = string.Empty;

    public string? Description { get; init; }

    public string PriorityCode { get; init; } = string.Empty;

    public string PriorityName { get; init; } = string.Empty;

    public string StatusCode { get; init; } = string.Empty;

    public string StatusName { get; init; } = string.Empty;

    public DateTimeOffset? DueDate { get; init; }

    public DateTimeOffset CreatedAt { get; init; }
}
