using TaskManager.Adapters.Persistence.Connections;
using TaskManager.Adapters.Persistence.Rows;
using TaskManager.Application.Ports.Out;
using TaskManager.Domain.Tasks;

namespace TaskManager.Adapters.Persistence.Repositories;

internal sealed class CatalogRepositoryAdapter : ICatalogRepositoryPort
{
    private const string GetPrioritiesSql = "SELECT * FROM sp_get_priorities()";

    private const string GetStatusesSql = "SELECT * FROM sp_get_statuses()";

    private readonly DapperExecutor _executor;

    public CatalogRepositoryAdapter(DapperExecutor executor)
    {
        ArgumentNullException.ThrowIfNull(executor);
        _executor = executor;
    }

    public async Task<IReadOnlyList<Priority>> FindPrioritiesAsync(CancellationToken cancellationToken)
    {
        var rows = await _executor.QueryAsync<CatalogRow>(GetPrioritiesSql, null, cancellationToken);

        return [.. rows.Select(row => Priority.FromCode(row.Code))];
    }

    public async Task<IReadOnlyList<Status>> FindStatusesAsync(CancellationToken cancellationToken)
    {
        var rows = await _executor.QueryAsync<CatalogRow>(GetStatusesSql, null, cancellationToken);

        return [.. rows.Select(row => Status.FromCode(row.Code))];
    }
}
