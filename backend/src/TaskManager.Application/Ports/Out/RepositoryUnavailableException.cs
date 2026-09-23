namespace TaskManager.Application.Ports.Out;

public sealed class RepositoryUnavailableException : Exception
{
    public RepositoryUnavailableException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
