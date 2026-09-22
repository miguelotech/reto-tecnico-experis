using TaskManager.Domain.Tasks;

namespace TaskManager.Application.Tests.TestSupport;

internal static class TaskItemFactory
{
    public static TaskItem Create(
        Guid? id = null,
        string title = "Comprar los ingredientes de la cena",
        string? description = "Pasar por el mercado antes de las siete.",
        Priority? priority = null,
        Status? status = null,
        DateTimeOffset? dueDate = null,
        DateTimeOffset? createdAt = null) => new(
            id ?? Guid.NewGuid(),
            title,
            description,
            priority ?? Priority.Medium,
            status ?? Status.Pending,
            dueDate,
            createdAt ?? new DateTimeOffset(2026, 9, 1, 10, 0, 0, TimeSpan.Zero));
}
