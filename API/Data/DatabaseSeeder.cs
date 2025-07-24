using API.Data.Seeds;

namespace API.Data
{
  public class DatabaseSeeder
  {
    private readonly CategorySeeder _categorySeeder;
    private readonly UserSeeder _userSeeder;

    public DatabaseSeeder(CategorySeeder categorySeeder, UserSeeder userSeeder)
    {
      _categorySeeder = categorySeeder;
      _userSeeder = userSeeder;
    }

    public async Task Seed()
    {
      Console.WriteLine($"[Info]: Seeding data");
      await _categorySeeder.Seed();
      await _userSeeder.Seed();
    }
  }
}
