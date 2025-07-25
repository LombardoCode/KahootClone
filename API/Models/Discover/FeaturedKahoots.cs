namespace API.Models.Discover
{
  public class FeaturedKahoot
  {
    public int Id { get; set; }

    // Navigation property
    public Guid KahootId { get; set; }
    public Kahoot Kahoot { get; set; }

    public DateTime FeaturedAt { get; set; } = DateTime.UtcNow;
  }
}
