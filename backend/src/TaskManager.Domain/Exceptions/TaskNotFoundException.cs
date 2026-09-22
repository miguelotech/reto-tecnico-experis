namespace TaskManager.Domain.Exceptions;

public sealed class TaskNotFoundException : DomainException
{
    public TaskNotFoundException(Guid taskId)
        : base($"No existe una tarea con el identificador '{taskId}'.")
    {
        TaskId = taskId;
    }

    public Guid TaskId { get; }
}
