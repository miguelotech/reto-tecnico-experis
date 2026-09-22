namespace TaskManager.Application.Ports.Out;

// parte del contrato del puerto: el adaptador traduce aca cualquier fallo de
// infraestructura para que las capas de arriba no conozcan Npgsql.
public sealed class RepositoryUnavailableException : Exception
{
    public RepositoryUnavailableException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
