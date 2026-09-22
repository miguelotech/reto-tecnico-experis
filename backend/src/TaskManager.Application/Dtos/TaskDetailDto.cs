namespace TaskManager.Application.Dtos;

public sealed record TaskDetailDto(
    Guid Id,
    string Title,
    string? Description,
    CatalogItemDto Priority,
    CatalogItemDto Status,
    DateTimeOffset? DueDate,
    DateTimeOffset CreatedAt);
