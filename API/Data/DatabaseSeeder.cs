using API.Data.Seeds;

namespace API.Data
{
  public class DatabaseSeeder
  {
    private readonly CategorySeeder _categorySeeder;

    public DatabaseSeeder(CategorySeeder categorySeeder)
    {
      _categorySeeder = categorySeeder;
    }

    public async Task Seed()
    {
      Console.WriteLine($"[Info]: Seeding data");
      await _categorySeeder.Seed();
    }
  }
}
