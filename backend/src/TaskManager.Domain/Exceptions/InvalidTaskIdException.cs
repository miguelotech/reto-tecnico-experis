namespace TaskManager.Domain.Exceptions;

public sealed class InvalidTaskIdException : DomainException
{
    public InvalidTaskIdException(string? invalidValue)
        : base($"El identificador '{invalidValue}' no tiene formato UUID.")
    {
        InvalidValue = invalidValue;
    }

    public string? InvalidValue { get; }
}
