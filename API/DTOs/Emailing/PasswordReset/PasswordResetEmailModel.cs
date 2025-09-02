namespace API.Models.Emailing.PasswordReset
{
  public class PasswordResetEmailModel
  {
    public string Username { get; set; }
    public string ResetPasswordLink { get; set; }
  }
}