using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
  public class AuthService
  {
    private readonly UserManager<AppUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthService(UserManager<AppUser> userManager, IConfiguration configuration)
    {
      _userManager = userManager;
      _configuration = configuration;
    }

    public async Task<AppUser> FindUserByEmailOrUsernameAsync(string emailOrUsername)
    {
      var user = await _userManager.FindByEmailAsync(emailOrUsername);

      if (user == null)
      {
        user = await _userManager.FindByNameAsync(emailOrUsername);
      }

      return user;
    }

    public string GenerateJwtToken(string username)
    {
      var issuer = _configuration["Jwt:Issuer"];
      var audience = _configuration["Jwt:Audience"];
      var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new System.Security.Claims.ClaimsIdentity(new[]
        {
          new Claim(ClaimTypes.NameIdentifier, username)
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
