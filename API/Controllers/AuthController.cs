using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.DTOs;
using API.Models;
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
    private readonly IConfiguration _configuration;

    public AuthController(SignInManager<AppUser> signInManager, UserManager<AppUser> userManager, IConfiguration configuration)
    {
      _signInManager = signInManager;
      _userManager = userManager;
      _configuration = configuration;
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

      var errorsList = result.Errors.Select(e => e.Description).ToList();

      var response = new
      {
        errors = errorsList
      };

      return BadRequest(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO credentials)
    {
      var user = await _userManager.FindByEmailAsync(credentials.Email);

      if (user == null)
      {
        return BadRequest(new { errors = new[] { "Email or password is wrong" } });
      }

      var result = await _signInManager.PasswordSignInAsync(user.UserName, credentials.Password, false, false);

      if (result.Succeeded)
      {
        var userFromDB = await _userManager.FindByEmailAsync(credentials.Email);
        var token = GenerateJwtToken(credentials.Email);

        return Ok(new
        {
          token,
          user = new
          {
            userFromDB.UserName
          }
        });
      }

      return Unauthorized();
    }

    private string GenerateJwtToken(string email)
    {
      var issuer = _configuration["Jwt:Issuer"];
      var audience = _configuration["Jwt:Audience"];
      var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new[]
        {
          new Claim(ClaimTypes.NameIdentifier, email)
        }),
        Expires = DateTime.Now.AddDays(7),
        Issuer = issuer,
        Audience = audience,
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
      };

      var tokenHandler = new JwtSecurityTokenHandler();
      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }
  }
}