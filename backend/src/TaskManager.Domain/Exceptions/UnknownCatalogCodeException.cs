namespace TaskManager.Domain.Exceptions;

public sealed class UnknownCatalogCodeException : DomainException
{
    public UnknownCatalogCodeException(string catalogName, string? code)
        : base($"El catalogo '{catalogName}' no reconoce el codigo '{code}'.")
    {
        CatalogName = catalogName;
        Code = code;
    }

    public string CatalogName { get; }

    public string? Code { get; }
}
