using API.Data.Seeds;
using API.Models.Discover;
using API.Models.Statistics;

namespace API.Data
{
  public class DatabaseSeeder
  {
    private readonly UserSeeder _userSeeder;
    private readonly KahootSeeder _kahootSeeder;
    private readonly PlayedKahootsSeeder _playedKahootsSeeder;
    private readonly KahootsPlayedByUserSeeder _kahootsPlayedByUserSeeder;
    private readonly FeaturedKahootSeeder _featuredKahootsSeeder;
    private readonly CategorySeeder _categorySeeder;

    public DatabaseSeeder(
      UserSeeder userSeeder,
      KahootSeeder kahootSeeder,
      PlayedKahootsSeeder playedKahootsSeeder,
      KahootsPlayedByUserSeeder kahootsPlayedByUserSeeder,
      FeaturedKahootSeeder featuredKahootSeeder,
      CategorySeeder categorySeeder)
    {
      _userSeeder = userSeeder;
      _kahootSeeder = kahootSeeder;
      _playedKahootsSeeder = playedKahootsSeeder;
      _kahootsPlayedByUserSeeder = kahootsPlayedByUserSeeder;
      _featuredKahootsSeeder = featuredKahootSeeder;
      _categorySeeder = categorySeeder;
    }

    public async Task Seed()
    {
      Console.WriteLine($"[Info]: Seeding data");
      await _userSeeder.Seed();
      await _kahootSeeder.Seed();
      await _playedKahootsSeeder.Seed();
      await _kahootsPlayedByUserSeeder.Seed();
      await _featuredKahootsSeeder.Seed();
      await _categorySeeder.Seed();
    }
  }
}
