using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Domain.Exceptions;

namespace TaskManager.Adapters.Rest.Errors;

internal sealed class DomainExceptionHandler : IExceptionHandler
{
    private readonly IProblemDetailsService _problemDetailsService;
    private readonly ILogger<DomainExceptionHandler> _logger;

    public DomainExceptionHandler(IProblemDetailsService problemDetailsService, ILogger<DomainExceptionHandler> logger)
    {
        _problemDetailsService = problemDetailsService;
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is not DomainException domainException)
        {
            return false;
        }

        var problemDetails = Build(domainException);
        httpContext.Response.StatusCode = problemDetails.Status!.Value;

        _logger.LogInformation(
            "Peticion rechazada en {Path}: {Message}",
            httpContext.Request.Path,
            domainException.Message);

        return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = domainException,
            ProblemDetails = problemDetails,
        });
    }

    private static ProblemDetails Build(DomainException exception) => exception switch
    {
        TaskNotFoundException notFound => new ProblemDetails
        {
            Status = StatusCodes.Status404NotFound,
            Title = "Tarea no encontrada",
            Detail = notFound.Message,
            Extensions = { ["taskId"] = notFound.TaskId },
        },
        InvalidFilterException invalidFilter => new ProblemDetails
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Filtro invalido",
            Detail = invalidFilter.Message,
            Extensions =
            {
                ["parameter"] = invalidFilter.FilterName,
                ["value"] = invalidFilter.InvalidValue,
                ["allowedValues"] = invalidFilter.AllowedValues,
            },
        },
        InvalidTaskIdException invalidId => new ProblemDetails
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Identificador invalido",
            Detail = invalidId.Message,
            Extensions = { ["value"] = invalidId.InvalidValue },
        },
        _ => new ProblemDetails
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Peticion invalida",
            Detail = exception.Message,
        },
    };
}
