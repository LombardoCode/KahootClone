using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [ApiController]
  [Route("api/reset-password")]
  public class ResetPasswordController : ControllerBase
  {
    private readonly UserManager<AppUser> _userManager;

    public ResetPasswordController(UserManager<AppUser> userManager)
    {
      _userManager = userManager;
    }


    [HttpPost("validate")]
    public async Task<ActionResult> Validate(ValidateDTO data)
    {
      string token = data.Token;
      string email = data.Email.Trim();

      if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
      {
        return Ok(new { valid = false });
      }

      AppUser user = await _userManager.FindByEmailAsync(email);

      if (user == null)
      {
        return Ok(new { valid = false });
      }

      var provider = _userManager.Options.Tokens.PasswordResetTokenProvider;
      var ok = await _userManager.VerifyUserTokenAsync(
        user,
        provider,
        UserManager<AppUser>.ResetPasswordTokenPurpose,
        token
      );

      return Ok(new { valid = ok });
    }


    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword(ResetPasswordDTO data)
    {
      List<string> errors = new List<string>();

      string newPassword = data.NewPassword.Trim();
      string newPasswordConfirm = data.NewPasswordConfirm.Trim();

      if (string.IsNullOrEmpty(newPassword) ||
          string.IsNullOrEmpty(newPasswordConfirm))
      {
        errors.Add("Password fields must be filled.");
        return BadRequest(new { errors });
      }

      if (string.IsNullOrEmpty(data.Email) ||
          string.IsNullOrEmpty(data.Token))
      {
        errors.Add("Invalid payload data.");
        return BadRequest(new { errors });
      }

      if (newPassword != newPasswordConfirm)
      {
        errors.Add("Both password fields must match.");
        return BadRequest(new { errors });
      }

      AppUser user = await _userManager.FindByEmailAsync(data.Email);

      if (user == null)
      {
        errors.Add("Invalid user or token");
        return BadRequest(new { errors });
      }

      string token = data.Token;

      var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

      if (!result.Succeeded)
      {
        errors.AddRange(result.Errors.Select(e => e.Description).ToList());
        return BadRequest(new { errors });
      }

      return Ok();
    }
  }
  

  public class ValidateDTO
  {
    public string Email { get; set; }
    public string Token { get; set; }
  }

  public class ResetPasswordDTO
  {
    public string Email { get; set; }
    public string Token { get; set; }
    public string NewPassword { get; set; }
    public string NewPasswordConfirm { get; set; }
  }
}
