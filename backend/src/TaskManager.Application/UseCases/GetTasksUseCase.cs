using TaskManager.Application.Dtos;
using TaskManager.Application.Mappers;
using TaskManager.Application.Ports.In;
using TaskManager.Application.Ports.Out;
using TaskManager.Domain.Exceptions;
using TaskManager.Domain.Tasks;

namespace TaskManager.Application.UseCases;

public sealed class GetTasksUseCase : IGetTasksUseCase
{
    private readonly ITaskRepositoryPort _repository;

    public GetTasksUseCase(ITaskRepositoryPort repository)
    {
        ArgumentNullException.ThrowIfNull(repository);
        _repository = repository;
    }

    public async Task<IReadOnlyList<TaskSummaryDto>> ExecuteAsync(TaskFilter filter, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(filter);

        var criteria = BuildCriteria(filter);
        var tasks = await _repository.FindAllAsync(criteria, cancellationToken);

        return [.. tasks.Select(TaskMapper.ToSummary)];
    }

    private static TaskCriteria BuildCriteria(TaskFilter filter)
    {
        Status? status = null;
        if (!string.IsNullOrWhiteSpace(filter.Status) && !Status.TryParse(filter.Status, out status))
        {
            throw new InvalidFilterException("status", filter.Status, Status.Codes);
        }

        Priority? priority = null;
        if (!string.IsNullOrWhiteSpace(filter.Priority) && !Priority.TryParse(filter.Priority, out priority))
        {
            throw new InvalidFilterException("priority", filter.Priority, Priority.Codes);
        }

        return new TaskCriteria(status, priority);
    }
}
