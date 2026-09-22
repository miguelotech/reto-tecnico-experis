using TaskManager.Application.Dtos;

namespace TaskManager.Application.Ports.In;

public interface IGetTasksUseCase
{
    Task<IReadOnlyList<TaskSummaryDto>> ExecuteAsync(TaskFilter filter, CancellationToken cancellationToken);
}
