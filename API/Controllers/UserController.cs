using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [ApiController]
  [Route("/api/[controller]")]
  public class UserController : ControllerBase
  {
    [HttpGet("test")]
    public ActionResult Test()
    {
      return Ok("Hello world!");
    }
  }
}