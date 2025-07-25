using API.Models.Classification;

namespace API.Data.Seeds
{
  public class CategorySeeder
  {
    private readonly DataContext _dbContext;

    public CategorySeeder(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    public async Task Seed()
    {
      Console.WriteLine($"[Info]: Seeding Categories");

      if (!_dbContext.Categories.Any())
      {
        var categories = new List<Category>()
        {
          new Category {
            Id = 1,
            Name = "Math",
            Slug = "math",
            IsVisible = true,
            MediaUrl = "https://images.unsplash.com/photo-1600493033157-eed3fbe95d96?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3ODI4NjV8MHwxfHNlYXJjaHwzfHxtYXRoJTIwbnVtYmVyc3xlbnwwfHx8fDE3NTM0MzQ2MzB8MA&ixlib=rb-4.1.0&q=85"
          },
          new Category {
            Id = 2,
            Name = "Technology",
            Slug = "technology",
            IsVisible = true,
            MediaUrl = "https://images.unsplash.com/photo-1562408590-e32931084e23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3ODI4NjV8MHwxfHNlYXJjaHwxN3x8VGVjaG5vbG9neXxlbnwwfHx8fDE3NTM0MzQ3NzB8MA&ixlib=rb-4.1.0&q=85"
          },
          new Category {
            Id = 3,
            Name = "Science",
            Slug = "science",
            IsVisible = true,
            MediaUrl = "https://images.unsplash.com/photo-1628595351029-c2bf17511435?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3ODI4NjV8MHwxfHNlYXJjaHw1fHxBRE58ZW58MHx8fHwxNzUzNDM0ODkyfDA&ixlib=rb-4.1.0&q=85"
          },
          new Category {
            Id = 4,
            Name = "Language",
            Slug = "language",
            IsVisible = true,
            MediaUrl = "https://images.pexels.com/photos/247819/pexels-photo-247819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          },
          new Category {
            Id = 5,
            Name = "General Knowledge",
            Slug = "general-knowledge",
            IsVisible = true,
            MediaUrl = "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3ODI4NjV8MHwxfHNlYXJjaHw2fHxXb3JsZHxlbnwwfHx8fDE3NTM0MzUxMTN8MA&ixlib=rb-4.1.0&q=85"
          },
          new Category {
            Id = 6,
            Name = "Coding",
            Slug = "coding",
            IsVisible = true,
            MediaUrl = "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          }
        };

        _dbContext.Categories.AddRange(categories);
        await _dbContext.SaveChangesAsync();
      }
      else
      {
        Console.WriteLine("[Info]: Categories already seeded, skipping.");
      }
    }
  }
}
