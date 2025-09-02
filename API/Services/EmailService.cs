using API.Data;
using API.HTMLTemplates.Emailing;
using API.Models.Emailing.PasswordReset;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace API.Services
{
  public class EmailService
  {
    private readonly DataContext _dbContext;
    private readonly EmailTemplateRenderer _renderer;
    private readonly PasswordResetTokensService _passwordResetService;

    // Emailing
    private readonly string _smtpServer;
    private readonly int _port;
    private readonly string _fromEmail;
    private readonly string _fromEmailAppPassword;
    private readonly string _fromName = "Experimenting email sending";
    

    public EmailService(
      DataContext dbContext,
      EmailTemplateRenderer renderer,
      IConfiguration config,
      PasswordResetTokensService passwordResetService)
    {
      _dbContext = dbContext;
      _renderer = renderer;
      _passwordResetService = passwordResetService;
      _smtpServer = config["Email:SmtpServer"];
      _port = int.TryParse(config["Email:Port"], out var p) ? p : 587;
      _fromEmail = config["Email:FromEmail"];
      _fromEmailAppPassword = config["Email:FromEmailAppPassword"];
    }


    [Hangfire.AutomaticRetry(Attempts = 3)]
    public async Task SendPasswordResetEmailAsync(string rawEmail)
    {
      string email = rawEmail.Trim();

      if (string.IsNullOrEmpty(email))
      {
        return;
      }

      bool existsUserWithThatEmail = await _dbContext.Users.AsNoTracking().AnyAsync(u => u.Email.ToLower() == email);

      if (!existsUserWithThatEmail)
      {
        return;
      }

      var user = await _dbContext.Users.AsNoTracking().Where(u => u.Email == email).Select(u => new { u.Id, u.UserName }).SingleOrDefaultAsync();

      string subject = "Reset your password";

      var model = new PasswordResetEmailModel
      {
        Username = user.UserName,
        ResetPasswordLink = await _passwordResetService.generateResetPasswordUrl(user.Id)
      };

      string htmlBody = await _renderer.RenderAsync("PasswordReset.cshtml", model);

      await SendEmailAsync(email, subject, htmlBody);
    }
    

    public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
      var message = new MimeMessage();
      message.From.Add(new MailboxAddress(_fromName, _fromEmail));
      message.To.Add(new MailboxAddress("", toEmail));
      message.Subject = subject;
      message.Body = new TextPart("html") { Text = htmlBody };

      using var client = new SmtpClient();
      await client.ConnectAsync(_smtpServer, _port, SecureSocketOptions.StartTls);
      await client.AuthenticateAsync(_fromEmail, _fromEmailAppPassword);
      await client.SendAsync(message);
      await client.DisconnectAsync(true);
    }
  }
}
