using TaskManager.Application.Dtos;

namespace TaskManager.Application.Ports.In;

public interface IGetTaskByIdUseCase
{
    Task<TaskDetailDto> ExecuteAsync(Guid taskId, CancellationToken cancellationToken);
}
