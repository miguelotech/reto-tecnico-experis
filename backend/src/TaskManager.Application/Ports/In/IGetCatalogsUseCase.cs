using TaskManager.Application.Dtos;

namespace TaskManager.Application.Ports.In;

public interface IGetCatalogsUseCase
{
    Task<IReadOnlyList<CatalogItemDto>> GetPrioritiesAsync(CancellationToken cancellationToken);

    Task<IReadOnlyList<CatalogItemDto>> GetStatusesAsync(CancellationToken cancellationToken);
}
