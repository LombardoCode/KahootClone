using API.Models.Discover;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Seeds
{
  public class FeaturedKahootSeeder
  {
    private readonly DataContext _dbContext;
    
    public FeaturedKahootSeeder(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    public async Task Seed()
    {
      Console.WriteLine($"[Info]: Seeding FeaturedKahoot");

      if (_dbContext.FeaturedKahoots.Any())
      {
        Console.WriteLine($"[Info]: FeaturedKahoot already seeded, skipping.");
      }

      List<Guid> kahootIds = await _dbContext.Kahoots
                                  .Select(k => k.Id)
                                  .ToListAsync();

      List<FeaturedKahoot> featuredKahoots = new List<FeaturedKahoot>();

      foreach (var kahootId in kahootIds)
      {
        FeaturedKahoot newFeaturedKahoot = new FeaturedKahoot
        {
          KahootId = kahootId,
          FeaturedAt = DateTime.UtcNow
        };

        featuredKahoots.Add(newFeaturedKahoot);
      }

      _dbContext.FeaturedKahoots.AddRange(featuredKahoots);

      await _dbContext.SaveChangesAsync();
    }
  }
}
