using API.Models.Play;
using Microsoft.AspNetCore.Identity;

namespace API.Models
{
  public class AppUser : IdentityUser
  {
    public string? MediaUrl { get; set; }

    // Navigation properties
    public ICollection<Kahoot> Kahoots { get; set; }
    public ICollection<Lobby> Lobbies { get; set; }
  }
}