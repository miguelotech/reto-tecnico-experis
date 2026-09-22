namespace TaskManager.Application.Dtos;

public sealed record TaskSummaryDto(
    Guid Id,
    string Title,
    string? Description,
    CatalogItemDto Priority,
    CatalogItemDto Status);
