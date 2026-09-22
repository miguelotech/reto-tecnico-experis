namespace TaskManager.Domain.Exceptions;

public sealed class InvalidFilterException : DomainException
{
    public InvalidFilterException(string filterName, string? invalidValue, IReadOnlyCollection<string> allowedValues)
        : base($"El valor '{invalidValue}' no es valido para el filtro '{filterName}'. Valores aceptados: {string.Join(", ", allowedValues)}.")
    {
        FilterName = filterName;
        InvalidValue = invalidValue;
        AllowedValues = allowedValues;
    }

    public string FilterName { get; }

    public string? InvalidValue { get; }

    public IReadOnlyCollection<string> AllowedValues { get; }
}
