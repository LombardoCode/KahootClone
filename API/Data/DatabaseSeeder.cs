using API.Data.Seeds;
using API.Data.Seeds.Sections;

namespace API.Data
{
  public class DatabaseSeeder
  {
    private readonly UserSeeder _userSeeder;
    private readonly PlayedKahootsSeeder _playedKahootsSeeder;
    private readonly KahootsPlayedByUserSeeder _kahootsPlayedByUserSeeder;
    private readonly FeaturedKahootSeeder _featuredKahootsSeeder;
    private readonly DiscoverSectionSeeder _discoverSectionSeeder;
    private readonly CategorySeeder _categorySeeder;
    private readonly KahootJsonSeeder _kahootJsonSeeder;

    public DatabaseSeeder(
      UserSeeder userSeeder,
      PlayedKahootsSeeder playedKahootsSeeder,
      KahootsPlayedByUserSeeder kahootsPlayedByUserSeeder,
      FeaturedKahootSeeder featuredKahootSeeder,
      DiscoverSectionSeeder discoverSectionSeeder,
      KahootJsonSeeder kahootJsonSeeder,
      CategorySeeder categorySeeder)
    {
      _userSeeder = userSeeder;
      _playedKahootsSeeder = playedKahootsSeeder;
      _kahootsPlayedByUserSeeder = kahootsPlayedByUserSeeder;
      _featuredKahootsSeeder = featuredKahootSeeder;
      _discoverSectionSeeder = discoverSectionSeeder;
      _kahootJsonSeeder = kahootJsonSeeder;
      _categorySeeder = categorySeeder;
    }

    public async Task Seed()
    {
      Console.WriteLine("\n\n\n\n\n\n\n\n");
      Console.WriteLine($"[Info]: Seeding data");

      // Data that doesn't require kahoots to exist
      await _userSeeder.Seed();
      await _categorySeeder.Seed();
      await _discoverSectionSeeder.Seed();

      // Creating kahoots
      await _kahootJsonSeeder.Seed();

      // Data that requires kahoots to exist
      await _kahootsPlayedByUserSeeder.Seed();
      await _playedKahootsSeeder.Seed();
      await _featuredKahootsSeeder.Seed();

      Console.WriteLine($"[Info]: Seeding finished");
    }
  }
}
