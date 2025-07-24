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
          new Category { Id = 1, Name = "Math", Slug = "math", IsVisible = true },
          new Category { Id = 2, Name = "Technology", Slug = "technology", IsVisible = true },
          new Category { Id = 3, Name = "Science", Slug = "science", IsVisible = true },
          new Category { Id = 4, Name = "Language", Slug = "language", IsVisible = true },
          new Category { Id = 5, Name = "Food", Slug = "food", IsVisible = true },
          new Category { Id = 6, Name = "Games", Slug = "games", IsVisible = true }
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
