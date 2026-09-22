using TaskManager.Application.Dtos;
using TaskManager.Application.Mappers;
using TaskManager.Application.Ports.In;
using TaskManager.Application.Ports.Out;

namespace TaskManager.Application.UseCases;

public sealed class GetCatalogsUseCase : IGetCatalogsUseCase
{
    private readonly ICatalogRepositoryPort _repository;

    public GetCatalogsUseCase(ICatalogRepositoryPort repository)
    {
        ArgumentNullException.ThrowIfNull(repository);
        _repository = repository;
    }

    public async Task<IReadOnlyList<CatalogItemDto>> GetPrioritiesAsync(CancellationToken cancellationToken)
    {
        var priorities = await _repository.FindPrioritiesAsync(cancellationToken);

        return [.. priorities.Select(TaskMapper.ToCatalogItem)];
    }

    public async Task<IReadOnlyList<CatalogItemDto>> GetStatusesAsync(CancellationToken cancellationToken)
    {
        var statuses = await _repository.FindStatusesAsync(cancellationToken);

        return [.. statuses.Select(TaskMapper.ToCatalogItem)];
    }
}
