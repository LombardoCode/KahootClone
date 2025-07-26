namespace API.Models.Discover.Section
{
  public class DiscoverSection
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public List<DiscoverSubsection> Subsections { get; set; }
  }
}
