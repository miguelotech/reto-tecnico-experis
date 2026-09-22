namespace TaskManager.Application.Dtos;

public sealed record TaskFilter(string? Status, string? Priority)
{
    public static readonly TaskFilter Empty = new(null, null);
}
