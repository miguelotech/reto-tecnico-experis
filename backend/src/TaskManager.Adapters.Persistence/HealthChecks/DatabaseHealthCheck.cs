using Microsoft.Extensions.Diagnostics.HealthChecks;
using TaskManager.Adapters.Persistence.Connections;
using TaskManager.Application.Ports.Out;

namespace TaskManager.Adapters.Persistence.HealthChecks;

internal sealed class DatabaseHealthCheck : IHealthCheck
{
    private readonly DapperExecutor _executor;

    public DatabaseHealthCheck(DapperExecutor executor)
    {
        ArgumentNullException.ThrowIfNull(executor);
        _executor = executor;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await _executor.QuerySingleOrDefaultAsync<int>("SELECT 1", null, cancellationToken);

            return HealthCheckResult.Healthy("La base de datos responde.");
        }
        catch (RepositoryUnavailableException exception)
        {
            return HealthCheckResult.Unhealthy("La base de datos no responde.", exception);
        }
    }
}
