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
      int categoryGeography = categories.Single(c => c.Slug == "geography").Id;
      int categoryScience = categories.Single(c => c.Slug == "science").Id;
      int categoryLanguage = categories.Single(c => c.Slug == "language").Id;
      int categoryTechnology = categories.Single(c => c.Slug == "technology").Id;
      int categoryTrivia = categories.Single(c => c.Slug == "trivia").Id;

      // Math
      List<DiscoverSection> newMathDiscoverSections = new List<DiscoverSection>()
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

      // Geography
      List<DiscoverSection> newGeographyDiscoverSections = new List<DiscoverSection>()
      {
        {
          new DiscoverSection {
            Title = "World capitals and countries",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Capitals by continent", CategoryId = categoryGeography },
              new DiscoverSubsection { Title = "Flags", CategoryId = categoryGeography },
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Human and cultural geography",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Cities and landmarks", CategoryId = categoryGeography }
            }
          }
        }
      };

      // Science
      List<DiscoverSection> newScienceDiscoverSections = new List<DiscoverSection>()
      {
        {
          new DiscoverSection {
            Title = "Life science",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Human body", CategoryId = categoryScience }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Earth and space science",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Earth systems", CategoryId = categoryScience },
              new DiscoverSubsection { Title = "Space exploration", CategoryId = categoryScience }
            }
          }
        }
      };

      // Language
      List<DiscoverSection> newLanguageDiscoverSections = new List<DiscoverSection>()
      {
        {
          new DiscoverSection {
            Title = "Core Spanish skills",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Everyday Spanish practice", CategoryId = categoryLanguage },
              new DiscoverSubsection { Title = "Spanish grammar and usage", CategoryId = categoryLanguage }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "English basics",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Vocabulary and grammar", CategoryId = categoryLanguage }
            }
          }
        }
      };

      // Technology
      List<DiscoverSection> newTechnologyDiscoverSections = new List<DiscoverSection>()
      {
        {
          new DiscoverSection {
            Title = "History of technology",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Inventions that changed the world", CategoryId = categoryTechnology }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Everyday technology",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Digital literacy", CategoryId = categoryTechnology },
              new DiscoverSubsection { Title = "Software applications", CategoryId = categoryTechnology },
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Operating systems",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Desktop operating systems", CategoryId = categoryTechnology }
            }
          }
        }
      };

      // Trivia
      List<DiscoverSection> newTriviaDiscoverSections = new List<DiscoverSection>()
      {
        {
          new DiscoverSection {
            Title = "Science & nature",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Natural wonders", CategoryId = categoryTrivia }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Human curiosities",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Human body trivia", CategoryId = categoryTrivia },
              new DiscoverSubsection { Title = "Human behavior", CategoryId = categoryTrivia },
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Space trivia",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "Space curiosities", CategoryId = categoryTrivia }
            }
          }
        },
        {
          new DiscoverSection {
            Title = "Random fun facts",
            Subsections = new List<DiscoverSubsection>()
            {
              new DiscoverSubsection { Title = "General trivia", CategoryId = categoryTrivia },
              new DiscoverSubsection { Title = "Fun records & games", CategoryId = categoryTrivia }
            }
          }
        }
      };

      _dbContext.DiscoverSection.AddRange(newMathDiscoverSections);
      _dbContext.DiscoverSection.AddRange(newGeographyDiscoverSections);
      _dbContext.DiscoverSection.AddRange(newScienceDiscoverSections);
      _dbContext.DiscoverSection.AddRange(newLanguageDiscoverSections);
      _dbContext.DiscoverSection.AddRange(newTechnologyDiscoverSections);
      _dbContext.DiscoverSection.AddRange(newTriviaDiscoverSections);

      await _dbContext.SaveChangesAsync();
    }
  }
}
