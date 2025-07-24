using API.Data.Seeds;

namespace API.Data
{
  public class DatabaseSeeder
  {
    private readonly UserSeeder _userSeeder;
    private readonly KahootSeeder _kahootSeeder;
    private readonly CategorySeeder _categorySeeder;

    public DatabaseSeeder(UserSeeder userSeeder, KahootSeeder kahootSeeder, CategorySeeder categorySeeder)
    {
      _userSeeder = userSeeder;
      _kahootSeeder = kahootSeeder;
      _categorySeeder = categorySeeder;
    }

    public async Task Seed()
    {
      Console.WriteLine($"[Info]: Seeding data");
      await _userSeeder.Seed();
      await _kahootSeeder.Seed();
      await _categorySeeder.Seed();
    }
  }
}
