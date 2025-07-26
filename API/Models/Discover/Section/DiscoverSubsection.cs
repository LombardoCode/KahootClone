namespace API.Models.Discover.Section
{
  public class DiscoverSubsection
  {
    public int Id { get; set; }
    public string Title { get; set; }

    // Navigation property
    public int DiscoverSectionId { get; set; }
    public DiscoverSection DiscoverSection { get; set; }

    public List<DiscoverSubsectionKahoot> DiscoverSubsectionKahoots { get; set; }
  }
}
