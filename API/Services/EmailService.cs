using API.Data;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace API.Services
{
  public class EmailService
  {
    private readonly DataContext _dbContext;
    private readonly string _smtpServer;
    private readonly int _port;
    private readonly string _fromEmail;
    private readonly string _fromEmailAppPassword;
    private readonly string _fromName = "Experimenting email sending";

    public EmailService(DataContext dbContext, IConfiguration config)
    {
      _dbContext = dbContext;
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

      string subject = "Reset your password";
      string htmlBody = $"<p>Click here to reset your password</p>";

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
