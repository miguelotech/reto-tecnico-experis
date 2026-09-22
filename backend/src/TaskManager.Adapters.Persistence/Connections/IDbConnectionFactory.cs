using System.Data.Common;

namespace TaskManager.Adapters.Persistence.Connections;

internal interface IDbConnectionFactory
{
    Task<DbConnection> OpenAsync(CancellationToken cancellationToken);
}
