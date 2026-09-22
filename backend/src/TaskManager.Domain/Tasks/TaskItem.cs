namespace TaskManager.Domain.Tasks;

public sealed class TaskItem
{
    public TaskItem(
        Guid id,
        string title,
        string? description,
        Priority priority,
        Status status,
        DateTimeOffset? dueDate,
        DateTimeOffset createdAt)
    {
        ArgumentNullException.ThrowIfNull(priority);
        ArgumentNullException.ThrowIfNull(status);

        if (id == Guid.Empty)
        {
            throw new ArgumentException("El identificador de la tarea no puede ser vacio.", nameof(id));
        }

        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("El titulo de la tarea es obligatorio.", nameof(title));
        }

        Id = id;
        Title = title.Trim();
        Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim();
        Priority = priority;
        Status = status;
        DueDate = dueDate;
        CreatedAt = createdAt;
    }

    public Guid Id { get; }

    public string Title { get; }

    public string? Description { get; }

    public Priority Priority { get; }

    public Status Status { get; }

    public DateTimeOffset? DueDate { get; }

    public DateTimeOffset CreatedAt { get; }
}
