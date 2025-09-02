using System.Net;
using API.Data;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
  public class PasswordResetTokensService
  {
    private readonly DataContext _dbContext;
    private readonly UserManager<AppUser> _userManager;
    private readonly string _clientBaseUrl;

    public PasswordResetTokensService(DataContext dbContext, UserManager<AppUser> userManager, IConfiguration config)
    {
      _dbContext = dbContext;
      _userManager = userManager;
      _clientBaseUrl = config["Client:BaseUrl"];
    }

    public async Task<string> generateResetPasswordUrl(string userId)
    {
      AppUser user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

      string token = await generateResetToken(user);

      return $"{_clientBaseUrl}/auth/reset-password/" +
              $"?email={Uri.EscapeDataString(user.Email)}" +
              $"&token={WebUtility.UrlEncode(token)}";
    }

    private async Task<string> generateResetToken(AppUser user)
    {
      return await _userManager.GeneratePasswordResetTokenAsync(user);
    }
  }
}
