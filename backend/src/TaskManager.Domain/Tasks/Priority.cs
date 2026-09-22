using TaskManager.Domain.Exceptions;

namespace TaskManager.Domain.Tasks;

public sealed class Priority : IEquatable<Priority>
{
    public static readonly Priority Low = new("LOW", "Baja");
    public static readonly Priority Medium = new("MEDIUM", "Media");
    public static readonly Priority High = new("HIGH", "Alta");

    private static readonly Priority[] KnownValues = [High, Medium, Low];
    private static readonly string[] KnownCodes = [.. KnownValues.Select(value => value.Code)];

    private Priority(string code, string name)
    {
        Code = code;
        Name = name;
    }

    public string Code { get; }

    public string Name { get; }

    public static IReadOnlyCollection<Priority> All => KnownValues;

    public static IReadOnlyCollection<string> Codes => KnownCodes;

    public static bool TryParse(string? code, out Priority? priority)
    {
        var normalized = Normalize(code);
        priority = KnownValues.FirstOrDefault(value => value.Code == normalized);
        return priority is not null;
    }

    public static Priority FromCode(string? code)
    {
        if (!TryParse(code, out var priority))
        {
            throw new UnknownCatalogCodeException(nameof(Priority), code);
        }

        return priority!;
    }

    private static string? Normalize(string? code) =>
        string.IsNullOrWhiteSpace(code) ? null : code.Trim().ToUpperInvariant();

    public bool Equals(Priority? other) => other is not null && other.Code == Code;

    public override bool Equals(object? obj) => Equals(obj as Priority);

    public override int GetHashCode() => Code.GetHashCode(StringComparison.Ordinal);

    public override string ToString() => Code;
}
