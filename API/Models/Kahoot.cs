using API.Models.Creator;

namespace API.Models
{
  public class Kahoot
  {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public string UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public AppUser User { get; set; }
    public List<Question> Questions { get; set; }
  }
}
