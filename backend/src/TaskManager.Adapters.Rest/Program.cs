using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Scalar.AspNetCore;
using TaskManager.Adapters.Persistence;
using TaskManager.Adapters.Rest;
using TaskManager.Adapters.Rest.Configuration;
using TaskManager.Application;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddApplication()
    .AddPersistence(builder.Configuration)
    .AddRestAdapter(builder.Configuration);

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

app.UseHeadAsGet();
app.UseRouting();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/swagger", options => options.WithTitle("TaskManager API"));
}

app.UseCors(CorsPolicies.Mobile);

app.MapControllers();
app.MapHealthChecks("/health", new HealthCheckOptions { ResponseWriter = HealthResponseWriter.WriteAsync });

app.Run();
