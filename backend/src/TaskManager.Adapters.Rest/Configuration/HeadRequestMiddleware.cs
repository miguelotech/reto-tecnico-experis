namespace TaskManager.Adapters.Rest.Configuration;

// HEAD es un GET sin cuerpo: se reescribe antes del enrutado para no declarar
// dos veces cada endpoint ni duplicarlos en el documento OpenAPI.
internal static class HeadRequestMiddleware
{
    public static IApplicationBuilder UseHeadAsGet(this IApplicationBuilder app) =>
        app.Use(async (context, next) =>
        {
            if (HttpMethods.IsHead(context.Request.Method))
            {
                context.Request.Method = HttpMethods.Get;
            }

            await next(context);
        });
}
