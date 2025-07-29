using System.Security.Claims;
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
  public class UserService
  {
    private readonly DataContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserService(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
      _dbContext = dbContext;
      _httpContextAccessor = httpContextAccessor;
    }

    public async Task<string> GetUserId()
    {
      string username = await GetUserName();
      string Id = String.Empty;
      var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == username);

      if (user != null)
      {
        Id = user.Id;
      }

      return Id;
    }

    public async Task<AppUser> GetCurrentUserAsync()
    {
      string username = await GetUserName();
      AppUser user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == username);
      return user;
    }

    public async Task<string> GetUserName()
    {
      var username = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
      return username;
    }
  }
}