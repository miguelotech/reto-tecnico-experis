using TaskManager.Domain.Tasks;

namespace TaskManager.Application.Ports.Out;

public interface ITaskRepositoryPort
{
    Task<IReadOnlyList<TaskItem>> FindAllAsync(TaskCriteria criteria, CancellationToken cancellationToken);

    Task<TaskItem?> FindByIdAsync(Guid taskId, CancellationToken cancellationToken);
}
