using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.DTOs;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;
    private readonly AuthService _authService;

    public AuthController(
      SignInManager<AppUser> signInManager,
      UserManager<AppUser> userManager,
      IConfiguration configuration,
      AuthService authService)
    {
      _signInManager = signInManager;
      _userManager = userManager;
      _authService = authService;
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

        return Ok(new
        {
          token,
          user = new
          {
            user.UserName
          }
        });
      }

      return Unauthorized(errors);
    }

    private string GenerateJwtToken(string username)
    {
      string token = _authService.GenerateJwtToken(username);
      
      return token;
    }
  }
}