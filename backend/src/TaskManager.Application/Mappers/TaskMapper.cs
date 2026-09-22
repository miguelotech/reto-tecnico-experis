using TaskManager.Application.Dtos;
using TaskManager.Domain.Tasks;

namespace TaskManager.Application.Mappers;

public static class TaskMapper
{
    public static TaskSummaryDto ToSummary(TaskItem task) => new(
        task.Id,
        task.Title,
        task.Description,
        ToCatalogItem(task.Priority),
        ToCatalogItem(task.Status));

    public static TaskDetailDto ToDetail(TaskItem task) => new(
        task.Id,
        task.Title,
        task.Description,
        ToCatalogItem(task.Priority),
        ToCatalogItem(task.Status),
        task.DueDate,
        task.CreatedAt);

    public static CatalogItemDto ToCatalogItem(Priority priority) => new(priority.Code, priority.Name);

    public static CatalogItemDto ToCatalogItem(Status status) => new(status.Code, status.Name);
}
