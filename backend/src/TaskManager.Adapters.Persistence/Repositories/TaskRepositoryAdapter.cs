using System.Data;
using Dapper;
using TaskManager.Adapters.Persistence.Connections;
using TaskManager.Adapters.Persistence.Mappers;
using TaskManager.Adapters.Persistence.Rows;
using TaskManager.Application.Ports.Out;
using TaskManager.Domain.Tasks;

namespace TaskManager.Adapters.Persistence.Repositories;

internal sealed class TaskRepositoryAdapter : ITaskRepositoryPort
{
    // en postgres los SP que devuelven filas son funciones, por eso SELECT *
    // FROM y no CommandType.StoredProcedure (que emitiria CALL).
    private const string GetTasksSql =
        "SELECT * FROM sp_get_tasks(@p_status_code, @p_priority_code)";

    private const string GetTaskByIdSql =
        "SELECT * FROM sp_get_task_by_id(@p_id)";

    private readonly DapperExecutor _executor;

    public TaskRepositoryAdapter(DapperExecutor executor)
    {
        ArgumentNullException.ThrowIfNull(executor);
        _executor = executor;
    }

    public async Task<IReadOnlyList<TaskItem>> FindAllAsync(TaskCriteria criteria, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(criteria);

        var parameters = new DynamicParameters();
        parameters.Add("p_status_code", criteria.Status?.Code, DbType.String, size: 20);
        parameters.Add("p_priority_code", criteria.Priority?.Code, DbType.String, size: 20);

        var rows = await _executor.QueryAsync<TaskRow>(GetTasksSql, parameters, cancellationToken);

        return [.. rows.Select(TaskRowMapper.ToDomain)];
    }

    public async Task<TaskItem?> FindByIdAsync(Guid taskId, CancellationToken cancellationToken)
    {
        var parameters = new DynamicParameters();
        parameters.Add("p_id", taskId, DbType.Guid);

        var row = await _executor.QuerySingleOrDefaultAsync<TaskRow>(GetTaskByIdSql, parameters, cancellationToken);

        return row is null ? null : TaskRowMapper.ToDomain(row);
    }
}
