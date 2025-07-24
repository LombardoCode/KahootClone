using API.Models.Statistics;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Seeds
{
  public class KahootsPlayedByUserSeeder
  {
    private readonly DataContext _dbContext;

    public KahootsPlayedByUserSeeder(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    public async Task Seed()
    {
      Console.WriteLine($"[Info]: Seeding KahootsPlayedByUser");

      if (_dbContext.KahootsPlayedByUser.Any())
      {
        Console.WriteLine($"[Info]: KahootsPlayedByUser already seeded, skipping.");
      }

      var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == "lombardo");

      if (user == null)
      {
        Console.WriteLine($"[Error]: User not found.");
        return;
      }

      string userId = user.Id;

      List<Guid> kahootIds = await _dbContext.Kahoots
                                    .Select(k => k.Id)
                                    .ToListAsync();

      var kahootsPlayedByUser = new List<KahootsPlayedByUser>();
      var now = DateTime.UtcNow;

      foreach (Guid kahootId in kahootIds)
      {
        kahootsPlayedByUser.Add(new KahootsPlayedByUser { KahootId = kahootId, UserId = userId, PlayedAt = now });
      }

      _dbContext.KahootsPlayedByUser.AddRange(kahootsPlayedByUser);
      await _dbContext.SaveChangesAsync();
    }
  }
}
