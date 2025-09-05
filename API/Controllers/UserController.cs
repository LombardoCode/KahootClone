using API.Data;
using API.Data.ForClient.Settings.EditProfile;
using API.DTOs.Settings.EditProfile;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
  [ApiController]
  [Route("/api/[controller]")]
  public class UserController : ControllerBase
  {
    private readonly DataContext _dbContext;
    private readonly UserService _userService;
    private readonly AuthService _authService;
    private readonly UserManager<AppUser> _userManager;
    private readonly IWebHostEnvironment _environment;
    private readonly CookieService _cookieService;


    public UserController(
      DataContext dbContext,
      UserService userService,
      AuthService authService,
      UserManager<AppUser> userManager,
      IWebHostEnvironment environment,
      CookieService cookieService)
    {
      _dbContext = dbContext;
      _userService = userService;
      _authService = authService;
      _userManager = userManager;
      _environment = environment;
      _cookieService = cookieService;
    }


    [Authorize]
    [HttpGet("")]
    public async Task<ActionResult> getUserInformation()
    {
      AppUser user = await _userService.GetCurrentUserAsync();

      var safeUserData = new UserMetadata
      {
        Email = user.Email,
        UserName = user.UserName,
        MediaUrl = user.MediaUrl
      };

      return Ok(safeUserData);
    }


    [Authorize]
    [HttpPost("changeUserName")]
    public async Task<ActionResult> changeUserName(ChangeUserNameDTO data)
    {
      List<string> errors = new List<string>();

      string desiredUsername = data.UserName;

      AppUser currentUser = await _userService.GetCurrentUserAsync();

      if (string.Equals(currentUser.UserName, desiredUsername))
      {
        return Ok(new { user = new { currentUser.UserName } });
      }

      bool doesThatUserNameExists = await _dbContext.Users.AnyAsync(u => u.UserName == desiredUsername);

      if (doesThatUserNameExists)
      {
        errors.Add("That username already exists. Choose another username.");
        return BadRequest(new { errors });
      }

      if (desiredUsername.Length > 20)
      {
        errors.Add("Username must not exceed 20 characters.");
        return BadRequest(new { errors });
      }

      var setUsername = await _userManager.SetUserNameAsync(currentUser, desiredUsername);

      if (!setUsername.Succeeded)
      {
        errors.AddRange(setUsername.Errors.Select(e => e.Description).ToList());
        return BadRequest(new { errors });
      }

      string newToken = _authService.GenerateJwtToken(currentUser.UserName);

      _cookieService.Set(newToken);

      return Ok(new
      {
        user = new
        {
          userName = currentUser.UserName,
          mediaUrl = currentUser.MediaUrl
        }
      });
    }


    [Authorize]
    [HttpPost("changeProfilePicture")]
    public async Task<ActionResult> changeProfilePicture(ChangeProfilePictureDTO data)
    {
      AppUser user = await _userService.GetCurrentUserAsync();
      user.MediaUrl = data.MediaUrl;
      await _dbContext.SaveChangesAsync();
      return Ok($"MediaUrl: {data.MediaUrl}");
    }


    [Authorize]
    [HttpPost("changePassword")]
    public async Task<ActionResult> ChangePassword(ChangePasswordDTO data)
    {
      List<string> errors = new List<string>();

      AppUser user = await _userService.GetCurrentUserAsync();

      string oldPassword = data.OldPassword;
      string newPassword = data.NewPassword;
      string repeatNewPassword = data.RepeatNewPassword;

      if (oldPassword.IsNullOrEmpty() || newPassword.IsNullOrEmpty() || repeatNewPassword.IsNullOrEmpty())
      {
        errors.Add("All password fields must be filled.");
        return BadRequest(new { errors });
      }

      bool isPasswordCorrect = await _userManager.CheckPasswordAsync(user, oldPassword);

      if (!isPasswordCorrect)
      {
        errors.Add("Password is not correct");
        return BadRequest(new { errors });
      }

      if (newPassword != repeatNewPassword)
      {
        errors.Add("New passwords must match");
        return BadRequest(new { errors });
      }

      await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);

      return Ok();
    }


    public class ChangeProfilePictureDTO
    {
      public string? MediaUrl { get; set; }
    }


    public class ChangePasswordDTO
    {
      public string OldPassword { get; set; }
      public string NewPassword { get; set; }
      public string RepeatNewPassword { get; set; }
    }
  }
}
