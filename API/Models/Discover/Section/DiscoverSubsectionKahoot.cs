namespace API.Models.Discover.Section
{
  public class DiscoverSubsectionKahoot
  {
    // Navigation property
    public int DiscoverSubsectionId { get; set; }
    public DiscoverSubsection DiscoverSubsection { get; set; }

    // Navigation property
    public Guid KahootId { get; set; }
    public Kahoot Kahoot { get; set; }
  }
}
