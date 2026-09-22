using System.Data.Common;
using Dapper;
using TaskManager.Application.Ports.Out;

namespace TaskManager.Adapters.Persistence.Connections;

internal sealed class DapperExecutor
{
    private readonly IDbConnectionFactory _connectionFactory;

    public DapperExecutor(IDbConnectionFactory connectionFactory)
    {
        ArgumentNullException.ThrowIfNull(connectionFactory);
        _connectionFactory = connectionFactory;
    }

    public async Task<IReadOnlyList<T>> QueryAsync<T>(string sql, object? parameters, CancellationToken cancellationToken)
    {
        try
        {
            await using var connection = await _connectionFactory.OpenAsync(cancellationToken);
            var command = new CommandDefinition(sql, parameters, cancellationToken: cancellationToken);
            var rows = await connection.QueryAsync<T>(command);

            return [.. rows];
        }
        catch (Exception exception) when (IsInfrastructureFailure(exception, cancellationToken))
        {
            throw new RepositoryUnavailableException("La base de datos no esta disponible.", exception);
        }
    }

    public async Task<T?> QuerySingleOrDefaultAsync<T>(string sql, object? parameters, CancellationToken cancellationToken)
    {
        try
        {
            await using var connection = await _connectionFactory.OpenAsync(cancellationToken);
            var command = new CommandDefinition(sql, parameters, cancellationToken: cancellationToken);

            return await connection.QuerySingleOrDefaultAsync<T>(command);
        }
        catch (Exception exception) when (IsInfrastructureFailure(exception, cancellationToken))
        {
            throw new RepositoryUnavailableException("La base de datos no esta disponible.", exception);
        }
    }

    private static bool IsInfrastructureFailure(Exception exception, CancellationToken cancellationToken) =>
        exception is DbException or TimeoutException && !cancellationToken.IsCancellationRequested;
}
