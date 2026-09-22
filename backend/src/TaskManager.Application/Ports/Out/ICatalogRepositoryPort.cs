using TaskManager.Domain.Tasks;

namespace TaskManager.Application.Ports.Out;

public interface ICatalogRepositoryPort
{
    Task<IReadOnlyList<Priority>> FindPrioritiesAsync(CancellationToken cancellationToken);

    Task<IReadOnlyList<Status>> FindStatusesAsync(CancellationToken cancellationToken);
}
