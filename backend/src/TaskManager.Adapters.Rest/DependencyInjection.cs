using Microsoft.AspNetCore.Mvc;
using TaskManager.Adapters.Rest.Configuration;
using TaskManager.Adapters.Rest.Errors;

namespace TaskManager.Adapters.Rest;

public static class DependencyInjection
{
    public static IServiceCollection AddRestAdapter(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers();
        services.AddOpenApi();

        services.AddProblemDetails(options => options.CustomizeProblemDetails = context =>
        {
            context.ProblemDetails.Instance = context.HttpContext.Request.Path;
            context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier;
        });

        services.AddExceptionHandler<DomainExceptionHandler>();
        services.AddExceptionHandler<RepositoryUnavailableExceptionHandler>();
        services.AddExceptionHandler<UnhandledExceptionHandler>();

        services.Configure<ApiBehaviorOptions>(options => options.SuppressMapClientErrors = false);

        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        services.AddCors(options => options.AddPolicy(CorsPolicies.Mobile, policy =>
        {
            if (allowedOrigins.Length == 0)
            {
                policy.AllowAnyOrigin();
            }
            else
            {
                policy.WithOrigins(allowedOrigins);
            }

            policy.AllowAnyHeader().WithMethods("GET");
        }));

        return services;
    }
}
