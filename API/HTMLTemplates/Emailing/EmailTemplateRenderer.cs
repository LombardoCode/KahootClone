using RazorLight;

namespace API.HTMLTemplates.Emailing
{
  public class EmailTemplateRenderer
  {
    private readonly RazorLightEngine _engine;

    public EmailTemplateRenderer(IWebHostEnvironment env)
    {
      var templateRoot = Path.Combine(env.ContentRootPath, "HTMLTemplates", "Emailing");

      _engine = new RazorLightEngineBuilder()
                    .UseFileSystemProject(templateRoot)
                    .UseMemoryCachingProvider()
                    .Build();
    }

    public Task<string> RenderAsync<TModel>(string templateName, TModel model)
    {
      return _engine.CompileRenderAsync(templateName, model);
    }
  }
}
