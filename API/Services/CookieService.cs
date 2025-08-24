namespace API.Services
{
  public class CookieService
  {
    private const string cookieName = "auth-token";
    private readonly IHttpContextAccessor _http;
    private readonly IWebHostEnvironment _env;

    public CookieService(IHttpContextAccessor http, IWebHostEnvironment env)
    {
      _http = http;
      _env = env;
    }

    public void Set(string token)
    {
      var ctx = _http.HttpContext ?? throw new InvalidOperationException("No HttpContext");

      ctx.Response.Cookies.Append(cookieName, token, new CookieOptions
      {
        HttpOnly = true,
        Secure = _env.IsProduction(),
        SameSite = SameSiteMode.Strict,
        Expires = DateTime.UtcNow.AddDays(7),
        Path = "/"
      });
    }

    public void Delete()
    {
      var ctx = _http.HttpContext ?? throw new InvalidOperationException("No HttpContext");

      if (ctx.Request.Cookies[cookieName] != null)
      {
        ctx.Response.Cookies.Delete(cookieName, new CookieOptions
        {
          HttpOnly = true,
          Secure = _env.IsProduction(),
          SameSite = SameSiteMode.Strict,
          Path = "/"
        });
      }
    }
  }
}
