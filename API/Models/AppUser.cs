using System.ComponentModel.DataAnnotations;
using API.Models.Play;
using Microsoft.AspNetCore.Identity;

namespace API.Models
{
  public class AppUser : IdentityUser
  {
    [Required]
    public override string UserName { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }

    // Navigation properties
    public ICollection<Kahoot> Kahoots { get; set; }
    public ICollection<Lobby> Lobbies { get; set; }
  }
}