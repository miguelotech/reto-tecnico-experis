using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Dtos;
using TaskManager.Application.Ports.In;
using TaskManager.Domain.Exceptions;

namespace TaskManager.Adapters.Rest.Controllers;

[ApiController]
[Route("api/v1/tasks")]
[Produces("application/json")]
[Tags("Tareas")]
public sealed class TasksController : ControllerBase
{
    private readonly IGetTasksUseCase _getTasks;
    private readonly IGetTaskByIdUseCase _getTaskById;

    public TasksController(IGetTasksUseCase getTasks, IGetTaskByIdUseCase getTaskById)
    {
        _getTasks = getTasks;
        _getTaskById = getTaskById;
    }

    [HttpGet]
    [EndpointSummary("Lista las tareas")]
    [EndpointDescription(
        "Devuelve las tareas ordenadas por prioridad descendente y fecha de creacion descendente. " +
        "Los filtros 'status' y 'priority' son opcionales y se combinan entre si. " +
        "Ejemplo: /api/v1/tasks?status=PENDING&priority=HIGH")]
    [ProducesResponseType<IReadOnlyList<TaskSummaryDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status503ServiceUnavailable)]
    public async Task<Ok<IReadOnlyList<TaskSummaryDto>>> GetTasks(
        [FromQuery] string? status,
        [FromQuery] string? priority,
        CancellationToken cancellationToken)
    {
        var tasks = await _getTasks.ExecuteAsync(new TaskFilter(status, priority), cancellationToken);

        return TypedResults.Ok(tasks);
    }

    [HttpGet("{id}")]
    [EndpointSummary("Obtiene el detalle de una tarea")]
    [EndpointDescription("Devuelve una unica tarea por su identificador UUID, o 404 si no existe.")]
    [ProducesResponseType<TaskDetailDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status503ServiceUnavailable)]
    public async Task<Ok<TaskDetailDto>> GetTaskById(string id, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(id, out var taskId))
        {
            throw new InvalidTaskIdException(id);
        }

        var task = await _getTaskById.ExecuteAsync(taskId, cancellationToken);

        return TypedResults.Ok(task);
    }
}
