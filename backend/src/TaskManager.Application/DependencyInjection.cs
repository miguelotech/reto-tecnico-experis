using Microsoft.Extensions.DependencyInjection;
using TaskManager.Application.Ports.In;
using TaskManager.Application.UseCases;

namespace TaskManager.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IGetTasksUseCase, GetTasksUseCase>();
        services.AddScoped<IGetTaskByIdUseCase, GetTaskByIdUseCase>();
        services.AddScoped<IGetCatalogsUseCase, GetCatalogsUseCase>();

        return services;
    }
}
