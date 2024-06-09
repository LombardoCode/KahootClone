using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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