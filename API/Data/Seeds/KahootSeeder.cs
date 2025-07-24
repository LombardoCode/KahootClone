using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Seeds
{
  public class KahootSeeder
  {
    private readonly DataContext _dbContext;

    public KahootSeeder(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    public async Task Seed()
    {
      Console.WriteLine($"[Info]: Seeding Kahoots");

      if (_dbContext.Kahoots.Any())
      {
        Console.WriteLine($"[Info]: Kahoots already seeded, skipping.");
        return;
      }

      AppUser user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == "lombardo");

      if (user == null)
      {
        Console.WriteLine("[Error]: Username 'lombardo' was not found.");
        return;
      }

      string userId = user.Id;
      DateTime now = DateTime.UtcNow;


      var kahoots = new List<Kahoot>
      {
        new Kahoot
        {
          Id = Guid.NewGuid(),
          Title = "Basic Math Challenge",
          Description = "Test your skills in addition, subtraction, and multiplication.",
          UserId = userId,
          MediaUrl = null,
          IsPlayable = true,
          CreatedAt = now,
          UpdatedAt = now
        },
        new Kahoot
        {
          Id = Guid.NewGuid(),
          Title = "World Flags Quiz",
          Description = "Can you identify the countries by their flags?",
          UserId = userId,
          MediaUrl = null,
          IsPlayable = true,
          CreatedAt = now,
          UpdatedAt = now
        },
        new Kahoot
        {
          Id = Guid.NewGuid(),
          Title = "Introduction to Biology",
          Description = "Learn basic cell structure and functions.",
          UserId = userId,
          MediaUrl = null,
          IsPlayable = false,
          CreatedAt = now,
          UpdatedAt = now
        },
        new Kahoot
        {
          Id = Guid.NewGuid(),
          Title = "English Grammar Basics",
          Description = "Identify verbs, nouns, adjectives and more!",
          UserId = userId,
          MediaUrl = null,
          IsPlayable = true,
          CreatedAt = now,
          UpdatedAt = now
        },
        new Kahoot
        {
          Id = Guid.NewGuid(),
          Title = "Tech History Timeline",
          Description = "Test your knowledge of key milestones in technology history.",
          UserId = userId,
          MediaUrl = null,
          IsPlayable = true,
          CreatedAt = now,
          UpdatedAt = now
        },
        new Kahoot
        {
          Id = Guid.NewGuid(),
          Title = "Famous Landmarks Around the World",
          Description = "Guess the name or location of these iconic structures.",
          UserId = userId,
          MediaUrl = null,
          IsPlayable = true,
          CreatedAt = now,
          UpdatedAt = now
        },
        new Kahoot
        {
          Id = Guid.NewGuid(),
          Title = "Basic Spanish Vocabulary",
          Description = "Match common Spanish words with their English meanings.",
          UserId = userId,
          MediaUrl = null,
          IsPlayable = true,
          CreatedAt = now,
          UpdatedAt = now
        },
        new Kahoot
        {
          Id = Guid.NewGuid(),
          Title = "Periodic Table Challenge",
          Description = "Test your knowledge of chemical elements and their symbols.",
          UserId = userId,
          MediaUrl = null,
          IsPlayable = true,
          CreatedAt = now,
          UpdatedAt = now
        },
        new Kahoot
        {
          Id = Guid.NewGuid(),
          Title = "Internet Safety 101",
          Description = "Learn how to stay safe online with this digital literacy quiz.",
          UserId = userId,
          MediaUrl = null,
          IsPlayable = false,
          CreatedAt = now,
          UpdatedAt = now
        }
      };

      _dbContext.Kahoots.AddRange(kahoots);
      await _dbContext.SaveChangesAsync();
    }
  }
}
