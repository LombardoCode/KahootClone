using API.Models.Discover.Section;
using Microsoft.EntityFrameworkCore;

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
      Console.WriteLine("\n\n\n\n");
      Console.WriteLine($"[Info]: Seeding DiscoverSection");

      if (await _dbContext.DiscoverSection.AnyAsync())
      {
        Console.WriteLine("[Info]: DiscoverSection already seeded, skipping.");
        return;
      }

      var categories = await _dbContext.Categories.ToListAsync();
      int categoryMath = categories.Single(c => c.Slug == "math").Id;
      int categoryLanguage = categories.Single(c => c.Slug == "language").Id;
      int categoryScience = categories.Single(c => c.Slug == "science").Id;
      int categoryCoding = categories.Single(c => c.Slug == "coding").Id;

      List<DiscoverSection> newDiscoverSections = new List<DiscoverSection>()
      {
        {
          new DiscoverSection {
            Title = "By Educational Level",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Elementary School", CategoryId = categoryMath },
              new DiscoverSubsection { Title = "Middle School", CategoryId = categoryMath },
              new DiscoverSubsection { Title = "High School", CategoryId = categoryMath }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Language learning",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Spanish", CategoryId = categoryLanguage },
              new DiscoverSubsection { Title = "English", CategoryId = categoryLanguage }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Science Exploration",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "The Solar System", CategoryId = categoryScience },
              new DiscoverSubsection { Title = "Human Body Systems", CategoryId = categoryScience },
              new DiscoverSubsection { Title = "Famous Scientists", CategoryId = categoryScience }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Software Development",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Programming Languages", CategoryId = categoryCoding }
            }
          }
        }
      };

      _dbContext.DiscoverSection.AddRange(newDiscoverSections);
      await _dbContext.SaveChangesAsync();
    }
  }
}
