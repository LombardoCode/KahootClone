using API.Data;
using API.Data.ForClient.Settings.EditProfile;
using API.DTOs.Settings.EditProfile;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [ApiController]
  [Route("/api/[controller]")]
  public class UserController : ControllerBase
  {
    private readonly DataContext _dbContext;
    private readonly UserService _userService;
    private readonly AuthService _authService;

    public UserController(DataContext dbContext, UserService userService, AuthService authService)
    {
      _dbContext = dbContext;
      _userService = userService;
      _authService = authService;
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
      string desiredUsername = data.UserName;

      bool doesThatUserNameExists = _dbContext.Users.Any(u => u.UserName == desiredUsername);

      if (doesThatUserNameExists)
      {
        return BadRequest("That username already exists. Choose another username.");
      }

      AppUser currentUser = await _userService.GetCurrentUserAsync();

      currentUser.UserName = desiredUsername;
      currentUser.NormalizedUserName = desiredUsername.ToUpper();

      await _dbContext.SaveChangesAsync();

      string newToken = _authService.GenerateJwtToken(currentUser.UserName);

      return Ok(new
      {
        newToken,
        user = new
        {
          currentUser.UserName
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

    public class ChangeProfilePictureDTO
    {
      public string? MediaUrl { get; set; }
    }
  }
}