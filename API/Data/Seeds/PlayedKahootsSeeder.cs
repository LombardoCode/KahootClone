using API.Models.Classification;
using API.Models.Statistics;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Seeds
{
  public class PlayedKahootsSeeder
  {
    private readonly DataContext _dbContext;

    public PlayedKahootsSeeder(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    public async Task Seed()
    {
      Console.WriteLine("\n\n\n\n");
      Console.WriteLine($"[Info]: Seeding PlayedKahoots");

      if (_dbContext.PlayedKahoots.Any())
      {
        Console.WriteLine("[Info]: PlayedKahoots already seeded, skipping.");
        return;
      }

      if (!_dbContext.Kahoots.Any())
      {
        Console.WriteLine("[Info]: There were no Kahoots to seed PlayedKahoots records, skipping.");
        return;
      }

      DateTime now = DateTime.UtcNow;
      var random = new Random();

      List<Guid> kahootIds = await _dbContext.Kahoots
                            .Select(k => k.Id)
                            .ToListAsync();

      var playedKahoots = new List<PlayedKahoots>();

      for (int i = 0; i < kahootIds.Count(); i++)
      {
        int randomNumberOfPlayedTimes = random.Next(10, 51);

        for (int j = 0; j < randomNumberOfPlayedTimes; j++)
        {
          playedKahoots.Add(new PlayedKahoots { KahootId = kahootIds[i], PlayedAt = now });
        }
      }

      _dbContext.PlayedKahoots.AddRange(playedKahoots);
      await _dbContext.SaveChangesAsync();
    }
  }
}
