using API.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Data.Seeds
{
  public class UserSeeder
  {
    private readonly UserManager<AppUser> _userManager;

    public UserSeeder(UserManager<AppUser> userManager)
    {
      _userManager = userManager;
    }

    public async Task Seed()
    {
      Console.WriteLine($"[Info]: Seeding Users");

      var users = new List<(string UserName, string Email)>
      {
        ("lombardo", "lombardo@lombardo.com"),
        ("cake", "cakey@cake.com"),
        ("pizza", "pizza@pizza.com"),
        ("gamer", "gamer@gamer.com"),
      };

      foreach (var user in users)
      {
        var existingUser = await _userManager.FindByNameAsync(user.UserName);

        if (existingUser == null)
        {
          var newUser = new AppUser
          {
            UserName = user.UserName,
            Email = user.Email
          };

          var result = await _userManager.CreateAsync(newUser, "12341234");

          if (result.Succeeded)
          {
            Console.WriteLine($"[Info]: Username '{newUser.UserName}' created successfully.");
          }
          else
          {
            foreach (var error in result.Errors)
            {
              Console.WriteLine($"[Error]: Username '{newUser.UserName}' -> {error.Description}");
            }
          }
        }
        else
        {
          Console.WriteLine($"[Info]: Username '{user.UserName}' already exists.");
        }
      }
    }
  }
}
