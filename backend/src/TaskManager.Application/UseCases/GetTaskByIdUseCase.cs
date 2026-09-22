using TaskManager.Application.Dtos;
using TaskManager.Application.Mappers;
using TaskManager.Application.Ports.In;
using TaskManager.Application.Ports.Out;
using TaskManager.Domain.Exceptions;

namespace TaskManager.Application.UseCases;

public sealed class GetTaskByIdUseCase : IGetTaskByIdUseCase
{
    private readonly ITaskRepositoryPort _repository;

    public GetTaskByIdUseCase(ITaskRepositoryPort repository)
    {
        ArgumentNullException.ThrowIfNull(repository);
        _repository = repository;
    }

    public async Task<TaskDetailDto> ExecuteAsync(Guid taskId, CancellationToken cancellationToken)
    {
        var task = await _repository.FindByIdAsync(taskId, cancellationToken)
            ?? throw new TaskNotFoundException(taskId);

        return TaskMapper.ToDetail(task);
    }
}
