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
            Title = "Math games for the classroom",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Additions and subtractions", CategoryId = categoryMath },
              new DiscoverSubsection { Title = "Multiplications and divisions", CategoryId = categoryMath },
              new DiscoverSubsection { Title = "Reasoning with numbers", CategoryId = categoryMath }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Multiples and factors",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Finding multiples", CategoryId = categoryMath },
              new DiscoverSubsection { Title = "Factors and divisibility", CategoryId = categoryMath }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Geometry and measurements",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Shapes and figures", CategoryId = categoryMath },
              new DiscoverSubsection { Title = "Angles and lines", CategoryId = categoryMath },
              new DiscoverSubsection { Title = "Measurements and conversions", CategoryId = categoryMath }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Applied math",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Time and calendars", CategoryId = categoryMath },
              new DiscoverSubsection { Title = "Fractions", CategoryId = categoryMath }
            }
          }
        }
      };

      _dbContext.DiscoverSection.AddRange(newDiscoverSections);
      await _dbContext.SaveChangesAsync();
    }
  }
}
