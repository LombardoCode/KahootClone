using System.Text.Json;
using API.Data.ClassesForSeeds.Kahoot;
using API.Models;
using API.Models.Classification;
using API.Models.Creator;
using API.Models.Discover.Section;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Seeds
{
  public class KahootJsonSeeder
  {
    private readonly DataContext _dbContext;

    public KahootJsonSeeder(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    public async Task Seed()
    {
      Console.WriteLine("\n\n\n\n");
      Console.WriteLine($"[Info]: Seeding KahootJsonSeeder");

      if (_dbContext.Kahoots.Any())
      {
        Console.WriteLine("[Info]: KahootJsonSeeder already seeded, skipping.");
        return;
      }

      string kahootJsonPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Seeds", "JSONs") + "/kahoots.jsonc";

      if (!File.Exists(kahootJsonPath))
      {
        Console.WriteLine($"[Error]: JSON file not found at path: {kahootJsonPath}");
        return;
      }

      var jsonContent = await File.ReadAllTextAsync(kahootJsonPath);
      var kahootSeedList = JsonSerializer.Deserialize<List<KahootSeedModel>>(jsonContent, new JsonSerializerOptions
      {
        PropertyNameCaseInsensitive = true
      });

      if (kahootSeedList == null || kahootSeedList.Count == 0)
      {
        Console.WriteLine($"[Warning]: JSON contained no kahoots");
        return;
      }

      var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == "lombardo");

      if (user == null)
      {
        Console.WriteLine($"[Error]: User 'lombardo' was not found");
        return;
      }

      DateTime now = DateTime.UtcNow;

      foreach (var seed in kahootSeedList)
      {
        // Creating kahoot
        var kahoot = new Kahoot
        {
          Id = Guid.NewGuid(),
          Title = seed.Title,
          Description = seed.Description,
          MediaUrl = seed.MediaUrl,
          UserId = user.Id,
          IsPlayable = true,
          CreatedAt = now,
          UpdatedAt = now,
          Questions = seed.Questions.Select(q => new Question
          {
            Title = q.Title,
            Layout = q.Layout,
            TimeLimit = q.TimeLimit,
            PointsMultiplier = q.PointsMultiplier,
            MediaUrl = q.MediaUrl,
            Answers = q.Answers.Select(a => new Answer
            {
              Text = a.Text,
              IsCorrect = a.IsCorrect
            }).ToList()
          }).ToList()
        };

        _dbContext.Kahoots.Add(kahoot);

        // KahootCategory
        var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Name == seed.Category);

        if (category != null)
        {
          var kahootCategory = new KahootCategory
          {
            KahootId = kahoot.Id,
            CategoryId = category.Id
          };

          _dbContext.KahootCategories.Add(kahootCategory);
        }

        // DiscoverSubsection
        foreach (var subsectionTitle in seed.Subsections)
        {
          var subsection = await _dbContext.DiscoverSubsection.FirstOrDefaultAsync(ds => ds.Title == subsectionTitle);

          if (subsection == null)
          {
            Console.WriteLine($"[Error]: Subsection with name '{subsectionTitle}' was not found.");
            return;
          }

          var discoverSubsectionKahoot = new DiscoverSubsectionKahoot
          {
            DiscoverSubsectionId = subsection.Id,
            KahootId = kahoot.Id
          };

          _dbContext.DiscoverSubsectionKahoots.Add(discoverSubsectionKahoot);
        }
      }

      await _dbContext.SaveChangesAsync();
    }
  }
}
