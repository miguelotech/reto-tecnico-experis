using TaskManager.Domain.Exceptions;

namespace TaskManager.Domain.Tasks;

public sealed class Status : IEquatable<Status>
{
    public static readonly Status Pending = new("PENDING", "Pendiente");
    public static readonly Status InProgress = new("IN_PROGRESS", "En progreso");
    public static readonly Status Completed = new("COMPLETED", "Completada");

    private static readonly Status[] KnownValues = [Pending, InProgress, Completed];
    private static readonly string[] KnownCodes = [.. KnownValues.Select(value => value.Code)];

    private Status(string code, string name)
    {
        Code = code;
        Name = name;
    }

    public string Code { get; }

    public string Name { get; }

    public static IReadOnlyCollection<Status> All => KnownValues;

    public static IReadOnlyCollection<string> Codes => KnownCodes;

    public static bool TryParse(string? code, out Status? status)
    {
        var normalized = Normalize(code);
        status = KnownValues.FirstOrDefault(value => value.Code == normalized);
        return status is not null;
    }

    public static Status FromCode(string? code)
    {
        if (!TryParse(code, out var status))
        {
            throw new UnknownCatalogCodeException(nameof(Status), code);
        }

        return status!;
    }

    private static string? Normalize(string? code) =>
        string.IsNullOrWhiteSpace(code) ? null : code.Trim().ToUpperInvariant();

    public bool Equals(Status? other) => other is not null && other.Code == Code;

    public override bool Equals(object? obj) => Equals(obj as Status);

    public override int GetHashCode() => Code.GetHashCode(StringComparison.Ordinal);

    public override string ToString() => Code;
}
