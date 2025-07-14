namespace API.Models.Statistics
{
  /// <summary>
  /// PlayedKahoots.cs
  /// Purpose: To track how many times a Kahoot has been played.
  /// </summary>
  public class PlayedKahoots
  {
    public int Id { get; set; }
    public Guid KahootId { get; set; }
    public DateTime PlayedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Kahoot Kahoot { get; set; }
  }
}
