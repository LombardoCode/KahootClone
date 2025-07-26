using Microsoft.EntityFrameworkCore;

namespace API.Data
{
  public class DatabaseDataDeleter
  {
    private readonly DataContext _dbContext;

    public DatabaseDataDeleter(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    public async Task Delete()
    {
      Console.WriteLine("\n\n\n\n");
      Console.WriteLine($"[Info]: Deleting all the data (except users)");
      Console.WriteLine("\n");

      // Table: Kahoots
      Console.WriteLine($"[Info]: In the process of deleting: Kahoots");
      var allKahoots = await _dbContext.Kahoots.ToListAsync();
      _dbContext.Kahoots.RemoveRange(allKahoots);
      Console.WriteLine("\n");

      // Table: Categories
      Console.WriteLine($"[Info]: In the process of deleting: Categories");
      var allCategories = await _dbContext.Categories.ToListAsync();
      _dbContext.Categories.RemoveRange(allCategories);
      Console.WriteLine("\n");

      // Table: DiscoverSection
      Console.WriteLine($"[Info]: In the process of deleting: DiscoverSection");
      var allDiscoverSection = await _dbContext.DiscoverSection.ToListAsync();
      _dbContext.DiscoverSection.RemoveRange(allDiscoverSection);
      Console.WriteLine("\n");

      // Table: DiscoverSubsection
      Console.WriteLine($"[Info]: In the process of deleting: DiscoverSubsection");
      var allDiscoverSubsection = await _dbContext.DiscoverSubsection.ToListAsync();
      _dbContext.DiscoverSubsection.RemoveRange(allDiscoverSubsection);
      Console.WriteLine("\n");

      // Table: DiscoverSubsectionKahoots
      Console.WriteLine($"[Info]: In the process of deleting: DiscoverSubsectionKahoots");
      var allDiscoverSubsectionKahoots = await _dbContext.DiscoverSubsectionKahoots.ToListAsync();
      _dbContext.DiscoverSubsectionKahoots.RemoveRange(allDiscoverSubsectionKahoots);
      Console.WriteLine("\n");

      // Table: FeaturedKahoots
      Console.WriteLine($"[Info]: In the process of deleting: FeaturedKahoots");
      var allFeaturedKahoots = await _dbContext.FeaturedKahoots.ToListAsync();
      _dbContext.FeaturedKahoots.RemoveRange(allFeaturedKahoots);
      Console.WriteLine("\n");

      // Table: KahootCategories
      Console.WriteLine($"[Info]: In the process of deleting: KahootCategories");
      var allKahootCategories = await _dbContext.KahootCategories.ToListAsync();
      _dbContext.KahootCategories.RemoveRange(allKahootCategories);
      Console.WriteLine("\n");

      // Table: KahootsPlayedByUser
      Console.WriteLine($"[Info]: In the process of deleting: KahootsPlayedByUser");
      var allKahootsPlayedByUser = await _dbContext.KahootsPlayedByUser.ToListAsync();
      _dbContext.KahootsPlayedByUser.RemoveRange(allKahootsPlayedByUser);
      Console.WriteLine("\n");

      // Table: PlayedKahoots
      Console.WriteLine($"[Info]: In the process of deleting: PlayedKahoots");
      var allPlayedKahoots = await _dbContext.PlayedKahoots.ToListAsync();
      _dbContext.PlayedKahoots.RemoveRange(allPlayedKahoots);
      Console.WriteLine("\n");

      await _dbContext.SaveChangesAsync();

      Console.WriteLine($"[Info]: All the database data was deleted successfully.");
    }
  }
}
