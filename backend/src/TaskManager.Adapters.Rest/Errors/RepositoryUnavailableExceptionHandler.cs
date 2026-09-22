using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Ports.Out;

namespace TaskManager.Adapters.Rest.Errors;

internal sealed class RepositoryUnavailableExceptionHandler : IExceptionHandler
{
    private readonly IProblemDetailsService _problemDetailsService;
    private readonly ILogger<RepositoryUnavailableExceptionHandler> _logger;

    public RepositoryUnavailableExceptionHandler(
        IProblemDetailsService problemDetailsService,
        ILogger<RepositoryUnavailableExceptionHandler> logger)
    {
        _problemDetailsService = problemDetailsService;
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is not RepositoryUnavailableException)
        {
            return false;
        }

        _logger.LogError(exception, "Fallo el acceso a la base de datos en {Path}", httpContext.Request.Path);

        httpContext.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;

        // el mensaje real y la cadena de conexion se quedan en el log
        return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status503ServiceUnavailable,
                Title = "Servicio no disponible",
                Detail = "No se pudo consultar el origen de datos. Intentalo nuevamente en unos momentos.",
            },
        });
    }
}
