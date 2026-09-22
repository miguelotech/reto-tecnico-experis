using TaskManager.Adapters.Persistence.Rows;
using TaskManager.Domain.Tasks;

namespace TaskManager.Adapters.Persistence.Mappers;

internal static class TaskRowMapper
{
    public static TaskItem ToDomain(TaskRow row) => new(
        row.Id,
        row.Title,
        row.Description,
        Priority.FromCode(row.PriorityCode),
        Status.FromCode(row.StatusCode),
        row.DueDate,
        row.CreatedAt);
}
