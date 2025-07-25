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
          MediaUrl = "https://images.pexels.com/photos/1019470/abacus-mathematics-addition-subtraction-1019470.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
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
          MediaUrl = "https://images.unsplash.com/photo-1495149905644-c9f27692c2c3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3ODI4NjV8MHwxfHNlYXJjaHw2fHxGbGFnc3xlbnwwfHx8fDE3NTM0MzI3MDZ8MA&ixlib=rb-4.1.0&q=85",
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
          MediaUrl = "https://images.pexels.com/photos/6156448/pexels-photo-6156448.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
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
          MediaUrl = "https://images.pexels.com/photos/6503096/pexels-photo-6503096.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
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
          MediaUrl = "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
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
          MediaUrl = "https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
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
          MediaUrl = "https://images.pexels.com/photos/54097/spain-flag-flutter-spanish-54097.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
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
          MediaUrl = "https://images.pexels.com/photos/7755503/pexels-photo-7755503.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
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
          MediaUrl = "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
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
