using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Services
{
  public class AuthService
  {
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;

    public AuthService(SignInManager<AppUser> signInManager, UserManager<AppUser> userManager)
    {
      _signInManager = signInManager;
      _userManager = userManager;
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
  }
}