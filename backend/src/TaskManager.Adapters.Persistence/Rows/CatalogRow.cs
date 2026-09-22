namespace TaskManager.Adapters.Persistence.Rows;

internal sealed class CatalogRow
{
    public string Code { get; init; } = string.Empty;

    public string Name { get; init; } = string.Empty;

    public short SortOrder { get; init; }
}
