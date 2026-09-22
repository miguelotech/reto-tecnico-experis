using System.Text.Json;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace TaskManager.Adapters.Rest.Configuration;

internal static class HealthResponseWriter
{
    public static Task WriteAsync(HttpContext httpContext, HealthReport report)
    {
        httpContext.Response.ContentType = "application/json";

        var payload = new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(entry => new
            {
                name = entry.Key,
                status = entry.Value.Status.ToString(),
                description = entry.Value.Description,
            }),
        };

        return httpContext.Response.WriteAsync(JsonSerializer.Serialize(payload));
    }
}
