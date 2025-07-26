using API.Models.Discover.Section;

namespace API.Data.Seeds.Sections
{
  public class DiscoverSectionSeeder
  {
    private readonly DataContext _dbContext;

    public DiscoverSectionSeeder(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    public async Task Seed()
    {
      Console.WriteLine($"[Info]: Seeding DiscoverSection");

      if (_dbContext.DiscoverSection.Any())
      {
        Console.WriteLine("[Info]: DiscoverSection already seeded, skipping.");
        return;
      }

      List<DiscoverSection> newDiscoverSections = new List<DiscoverSection>()
      {
        {
          new DiscoverSection {
            Title = "By Educational Level",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Elementary School" },
              new DiscoverSubsection { Title = "Middle School" },
              new DiscoverSubsection { Title = "High School School" }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Language learning",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Spanish" },
              new DiscoverSubsection { Title = "English" }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Science Exploration",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "The Solar System" },
              new DiscoverSubsection { Title = "Human Body Systems" },
              new DiscoverSubsection { Title = "Famous Scientists" }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Software Development",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Programming Languages" }
            }
          }
        }
      };

      _dbContext.DiscoverSection.AddRange(newDiscoverSections);
      await _dbContext.SaveChangesAsync();
    }
  }
}
