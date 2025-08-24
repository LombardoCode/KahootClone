using API.DTOs;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;
    private readonly AuthService _authService;
    private readonly IWebHostEnvironment _environment;
    private readonly CookieService _cookieService;

    public AuthController(
      SignInManager<AppUser> signInManager,
      UserManager<AppUser> userManager,
      AuthService authService,
      IWebHostEnvironment environment,
      CookieService cookieService)
    {
      _signInManager = signInManager;
      _userManager = userManager;
      _authService = authService;
      _environment = environment;
      _cookieService = cookieService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser(RegisterDTO newUserData)
    {
      var user = new AppUser
      {
        UserName = newUserData.UserName,
        Email = newUserData.Email
      };

      var result = await _userManager.CreateAsync(user, newUserData.Password);

      if (result.Succeeded)
      {
        return Ok();
      }

      var errorsDict = new Dictionary<string, List<string>>()
      {
        { "username", new List<string>() },
        { "email", new List<string>() },
        { "password", new List<string>() },
      };

      foreach (var error in result.Errors)
      {
        if (error.Code.Contains("UserName"))
        {
          errorsDict["username"].Add(error.Description);
        }
        else if (error.Code.Contains("Email"))
        {
          errorsDict["email"].Add(error.Description);
        }
        else if (error.Code.Contains("Password"))
        {
          errorsDict["password"].Add(error.Description);
        }
      }

      var response = new
      {
        errors = errorsDict
      };

      return BadRequest(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO credentials)
    {
      var user = await _authService.FindUserByEmailOrUsernameAsync(credentials.Email);
      string genericError = "Email or password is wrong";
      var errors = new { errors = new[] { genericError } };

      if (user == null)
      {
        return BadRequest(errors);
      }

      var result = await _signInManager.PasswordSignInAsync(user.UserName, credentials.Password, false, false);

      if (result.Succeeded)
      {
        var token = GenerateJwtToken(user.UserName);

        // Set an HTTP-only cookie
        _cookieService.Set(token);

        return Ok(new
        {
          user = new
          {
            user.UserName
          }
        });
      }

      return Unauthorized(errors);
    }

    [HttpPost("logout")]
    public ActionResult Logout()
    {
      _cookieService.Delete();

      return Ok();
    }

    [HttpGet("me")]
    public ActionResult me()
    {
      var userName = User.Identity?.Name;
      
      return Ok(new
      {
        user = new
        {
          userName
        }
      });
    }

    private string GenerateJwtToken(string username)
    {
      string token = _authService.GenerateJwtToken(username);

      return token;
    }
  }
}