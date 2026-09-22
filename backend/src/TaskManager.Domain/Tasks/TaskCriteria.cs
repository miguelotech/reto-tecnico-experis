namespace TaskManager.Domain.Tasks;

public sealed record TaskCriteria(Status? Status, Priority? Priority)
{
    public static readonly TaskCriteria None = new(null, null);

    public bool HasFilters => Status is not null || Priority is not null;
}
