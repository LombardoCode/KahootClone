using API.Data.Seeds;
using API.Models.Statistics;

namespace API.Data
{
  public class DatabaseSeeder
  {
    private readonly UserSeeder _userSeeder;
    private readonly KahootSeeder _kahootSeeder;
    private readonly PlayedKahootsSeeder _playedKahootsSeeder;
    private readonly CategorySeeder _categorySeeder;

    public DatabaseSeeder(UserSeeder userSeeder, KahootSeeder kahootSeeder, PlayedKahootsSeeder playedKahootsSeeder, CategorySeeder categorySeeder)
    {
      _userSeeder = userSeeder;
      _kahootSeeder = kahootSeeder;
      _playedKahootsSeeder = playedKahootsSeeder;
      _categorySeeder = categorySeeder;
    }

    public async Task Seed()
    {
      Console.WriteLine($"[Info]: Seeding data");
      await _userSeeder.Seed();
      await _kahootSeeder.Seed();
      await _playedKahootsSeeder.Seed();
      await _categorySeeder.Seed();
    }
  }
}
