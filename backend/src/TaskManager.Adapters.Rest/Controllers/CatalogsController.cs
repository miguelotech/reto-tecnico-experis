using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Dtos;
using TaskManager.Application.Ports.In;

namespace TaskManager.Adapters.Rest.Controllers;

[ApiController]
[Route("api/v1/catalogs")]
[Produces("application/json")]
[Tags("Catalogos")]
public sealed class CatalogsController : ControllerBase
{
    private readonly IGetCatalogsUseCase _getCatalogs;

    public CatalogsController(IGetCatalogsUseCase getCatalogs)
    {
        _getCatalogs = getCatalogs;
    }

    [HttpGet("priorities")]
    [EndpointSummary("Lista las prioridades disponibles")]
    [EndpointDescription("Alimenta la pantalla de filtros del movil para no hardcodear los codigos en el cliente.")]
    [ProducesResponseType<IReadOnlyList<CatalogItemDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status503ServiceUnavailable)]
    public async Task<Ok<IReadOnlyList<CatalogItemDto>>> GetPriorities(CancellationToken cancellationToken)
    {
        var priorities = await _getCatalogs.GetPrioritiesAsync(cancellationToken);

        return TypedResults.Ok(priorities);
    }

    [HttpGet("statuses")]
    [EndpointSummary("Lista los estados disponibles")]
    [EndpointDescription("Alimenta la pantalla de filtros del movil para no hardcodear los codigos en el cliente.")]
    [ProducesResponseType<IReadOnlyList<CatalogItemDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status503ServiceUnavailable)]
    public async Task<Ok<IReadOnlyList<CatalogItemDto>>> GetStatuses(CancellationToken cancellationToken)
    {
        var statuses = await _getCatalogs.GetStatusesAsync(cancellationToken);

        return TypedResults.Ok(statuses);
    }
}
