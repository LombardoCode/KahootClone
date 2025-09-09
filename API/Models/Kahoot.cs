using API.Models.Classification;
using API.Models.Creator;
using API.Models.Play;

namespace API.Models
{
  public class Kahoot
  {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public string? MediaUrl { get; set; }
    public string UserId { get; set; }
    public bool IsPlayable { get; set; } = false;
    public bool IsPublic { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public AppUser User { get; set; }
    public List<Question> Questions { get; set; }
    public List<Lobby> Lobbies { get; set; }
    public KahootCategory KahootCategories { get; set; }
  }
}
