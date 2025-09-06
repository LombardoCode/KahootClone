namespace API.Models.Statistics
{
  /// <summary>
  /// KahootsPlayedByUser
  /// Purpose: To track which kahoots were played by a specific user
  /// </summary>
  public class KahootsPlayedByUser
  {
    public int Id { get; set; }

    // Navigation property for Kahoot
    public Guid KahootId { get; set; }
    public Kahoot Kahoot { get; set; }

    // Navigation property for User
    public string? UserId { get; set; }
    public AppUser User { get; set; }

    public DateTime PlayedAt { get; set; }
  }
}
