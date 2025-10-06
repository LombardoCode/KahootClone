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
      Console.WriteLine("\n\n\n\n");
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
            MediaUrl = "https://images.unsplash.com/photo-1600493033157-eed3fbe95d96?ixid=M3w3ODI4NjV8MHwxfHNlYXJjaHw1fHxtYXRoJTIwY2FsY3VsYXRvcnxlbnwwfHx8fDE3NTk3MTAzMzB8MA&ixlib=rb-4.1.0&fit=crop&w=350&h=233.33"
          },
          new Category {
            Id = 2,
            Name = "Geography",
            Slug = "geography",
            IsVisible = true,
            MediaUrl = "https://images.pexels.com/photos/335393/pexels-photo-335393.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=350&h=233.33"
          },
          new Category {
            Id = 3,
            Name = "Science",
            Slug = "science",
            IsVisible = true,
            MediaUrl = "https://images.unsplash.com/photo-1628595351029-c2bf17511435?ixid=M3w3ODI4NjV8MHwxfHNlYXJjaHwzfHxTY2llbmNlfGVufDB8fHx8MTc1OTcxMDUxNHww&ixlib=rb-4.1.0&fit=crop&w=350&h=233.33"
          },
          new Category {
            Id = 4,
            Name = "Language",
            Slug = "language",
            IsVisible = true,
            MediaUrl = "https://images.pexels.com/photos/247819/pexels-photo-247819.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=350&h=233.33"
          },
          new Category {
            Id = 5,
            Name = "Technology",
            Slug = "technology",
            IsVisible = true,
            MediaUrl = "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=350&h=233.33"
          },
          new Category {
            Id = 6,
            Name = "Trivia",
            Slug = "trivia",
            IsVisible = true,
            MediaUrl = "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?ixid=M3w3ODI4NjV8MHwxfHNlYXJjaHwxfHxnZW9ncmFwaHl8ZW58MHx8fHwxNzU5NzEwNjQzfDA&ixlib=rb-4.1.0&fit=crop&w=350&h=233.33"
          },
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
