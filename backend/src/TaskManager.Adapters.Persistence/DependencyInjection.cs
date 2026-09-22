using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Npgsql;
using TaskManager.Adapters.Persistence.Connections;
using TaskManager.Adapters.Persistence.HealthChecks;
using TaskManager.Adapters.Persistence.Repositories;
using TaskManager.Application.Ports.Out;

namespace TaskManager.Adapters.Persistence;

public static class DependencyInjection
{
    private const string ConnectionStringName = "TaskManagerDatabase";

    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);

        var connectionString = configuration.GetConnectionString(ConnectionStringName);
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                $"Falta la cadena de conexion 'ConnectionStrings:{ConnectionStringName}' en la configuracion.");
        }

        // las columnas del SP vienen en snake_case y los modelos de fila en PascalCase
        DefaultTypeMap.MatchNamesWithUnderscores = true;

        services.AddNpgsqlDataSource(connectionString);
        services.AddSingleton<IDbConnectionFactory, NpgsqlConnectionFactory>();
        services.AddSingleton<DapperExecutor>();
        services.AddScoped<ITaskRepositoryPort, TaskRepositoryAdapter>();
        services.AddScoped<ICatalogRepositoryPort, CatalogRepositoryAdapter>();

        services.AddHealthChecks()
            .AddCheck<DatabaseHealthCheck>("database", HealthStatus.Unhealthy, ["ready"]);

        return services;
    }
}
