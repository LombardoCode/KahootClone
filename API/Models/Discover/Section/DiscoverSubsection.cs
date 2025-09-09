using API.Models.Classification;

namespace API.Models.Discover.Section
{
  public class DiscoverSubsection
  {
    public int Id { get; set; }
    public string Title { get; set; }

    // Navigation property
    public int CategoryId { get; set; }
    public Category Category { get; set; }


    // Navigation property
    public int DiscoverSectionId { get; set; }
    public DiscoverSection DiscoverSection { get; set; }

    public List<DiscoverSubsectionKahoot> DiscoverSubsectionKahoots { get; set; }
  }
}
