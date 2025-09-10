using System.Text.Json;
using API.Data.ClassesForSeeds.Kahoot;
using API.Interfaces;
using API.Models;
using API.Models.Classification;
using API.Models.Creator;
using API.Models.Discover.Section;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Seeds
{
  public class KahootJsonSeeder
  {
    private readonly DataContext _dbContext;
    private AppUser user;

    public KahootJsonSeeder(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    public async Task Seed()
    {
      Console.WriteLine("\n\n\n\n");
      Console.WriteLine($"[Info]: Seeding KahootJsonSeeder");

      if (_dbContext.Kahoots.Any())
      {
        Console.WriteLine("[Info]: KahootJsonSeeder already seeded, skipping.");
        return;
      }

      user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == "lombardo");

      if (user == null)
      {
        Console.WriteLine($"[Error]: User 'lombardo' was not found");
        return;
      }

      string jsonsBasePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Seeds", "JSONs");
      List<string> kahootJsonPaths = new List<string>();

      // JSON files for all the kahoots that we are going to create
      string mathJson = jsonsBasePath + "/math.kahoots.jsonc";
      string geographyJson = jsonsBasePath + "/geography.kahoots.jsonc";
      string scienceJson = jsonsBasePath + "/science.kahoots.jsonc";
      string languageJson = jsonsBasePath + "/language.kahoots.jsonc";
      string technologyJson = jsonsBasePath + "/technology.kahoots.jsonc";
      string triviaJson = jsonsBasePath + "/trivia.kahoots.jsonc";

      // Add all the JSON paths
      kahootJsonPaths.Add(mathJson);
      kahootJsonPaths.Add(geographyJson);
      kahootJsonPaths.Add(scienceJson);
      kahootJsonPaths.Add(languageJson);
      kahootJsonPaths.Add(technologyJson);
      kahootJsonPaths.Add(triviaJson);

      bool wereAllJsonFilesFound = true;

      foreach (string path in kahootJsonPaths)
      {
        if (!File.Exists(path))
        {
          wereAllJsonFilesFound = false;
          Console.WriteLine($"[Error]: JSON file not found at path: {path}");
          return;
        }

        var jsonContent = await File.ReadAllTextAsync(path);
        var kahootSeedList = JsonSerializer.Deserialize<List<KahootSeedModel>>(jsonContent, new JsonSerializerOptions
        {
          PropertyNameCaseInsensitive = true
        });

        if (kahootSeedList == null || kahootSeedList.Count == 0)
        {
          Console.WriteLine($"[Warning]: JSON contained no kahoots");
          return;
        }

        await processKahoots(path, kahootSeedList);
      }

      await _dbContext.SaveChangesAsync();
    }

    private async Task processKahoots(string path, List<KahootSeedModel> kahootList)
    {
      Console.WriteLine("[KahootJsonSeeder] - Processing Kahoots");

      int validCount = 0;
      int invalidCount = 0;

      for (int index = 0; index < kahootList.Count; index++)
      {
        KahootSeedModel kahoot = kahootList[index];

        List<string> errors = validateKahoot(kahoot, index);

        if (errors.Count > 0)
        {
          invalidCount++;
          Console.ForegroundColor = ConsoleColor.Red;
          Console.WriteLine($"[KahootJsonSeeder]: path: {path} | index = {index} - {errors.Count} errors(s):");

          foreach (string error in errors)
          {
            Console.WriteLine($"\n{error}");
          }

          Console.ResetColor();
          continue;
        }

        validCount++;

        await createKahoot(kahoot);
      }

      Console.WriteLine($"[KahootJsonSeeder] Done. Valid: {validCount} | Invalid: {invalidCount}");
    }

    private List<string> validateKahoot(KahootSeedModel kahoot, int kahootIndex)
    {
      List<string> errors = new List<string>();
      string whereK = $"Kahoot[{kahootIndex}]";

      Console.WriteLine($"Evaluating Kahoot at JSON index position: {kahootIndex}");

      // Kahoot header information
      if (string.IsNullOrEmpty(kahoot.Title))
      {
        errors.Add($"{whereK}: 'Title' cannot be empty.");
      }

      if (string.IsNullOrEmpty(kahoot.Description))
      {
        errors.Add($"{whereK}: 'Description' cannot be empty.");
      }

      if (string.IsNullOrEmpty(kahoot.MediaUrl))
      {
        errors.Add($"{whereK}: 'MediaUrl' cannot be empty.");
      }

      if (string.IsNullOrEmpty(kahoot.Category))
      {
        errors.Add($"{whereK}: 'Category' cannot be empty.");
      }

      // Subsections
      if (kahoot.Subsections == null || kahoot.Subsections.Count == 0)
      {
        errors.Add($"{whereK}: 'Subsections' must contain at least 1 item.");
      }
      else
      {
        for (int sub = 0; sub < kahoot.Subsections.Count; sub++)
        {
          if (string.IsNullOrEmpty(kahoot.Subsections[sub]))
          {
            errors.Add($"{whereK}: 'Subsections[{sub}]' cannot be empty.");
          }
        }
      }

      // Questions
      if (kahoot.Questions == null || kahoot.Questions.Count == 0)
      {
        errors.Add($"{whereK}: 'Questions' must contain at least 1 item.");
        return errors;
      }

      for (int q = 0; q < kahoot.Questions.Count; q++)
      {
        var question = kahoot.Questions[q];
        string whereQ = $"{whereK}.Questions[{q}]";

        // Title
        if (string.IsNullOrEmpty(question.Title))
        {
          errors.Add($"{whereQ}: 'Title' cannot be empty.");
        }

        // Answers
        if (question.Answers == null || question.Answers.Count == 0)
        {
          errors.Add($"{whereQ}: 'Answers' cannot be null.");
          continue;
        }

        // Layout
        if (string.IsNullOrEmpty(question.Layout))
        {
          errors.Add($"{whereQ}: 'Layout' cannot be empty.");
        }
        else
        {
          if (!Enum.TryParse(question.Layout, true, out QuizQuestionLayoutTypes parsedLayout) || !Enum.IsDefined(typeof(QuizQuestionLayoutTypes), parsedLayout))
          {
            errors.Add($"{whereQ}: 'Layout' has an invalid value.");
          }
          else
          {
            if (parsedLayout == QuizQuestionLayoutTypes.CLASSIC && question.Answers.Count != 4)
            {
              errors.Add($"{whereQ}: 'Answers' must contain exactly 4 items for CLASSIC questions.");
            }

            if (parsedLayout == QuizQuestionLayoutTypes.TRUE_OR_FALSE && question.Answers.Count != 2)
            {
              errors.Add($"{whereQ}: 'Answers' must contain exactly 2 items for TRUE_OR_FALSE questions.");
            }
          }
        }

        // TimeLimit
        if (question.TimeLimit == null || !Enum.IsDefined(typeof(TimeLimits), question.TimeLimit.Value))
        {
          errors.Add($"{whereQ}: 'TimeLimit' is empty or invalid.");
        }

        // PointsMultiplier
        if (question.PointsMultiplier == null || !Enum.IsDefined(typeof(PointsMultiplier), question.PointsMultiplier.Value))
        {
          errors.Add($"{whereQ}: 'PointsMultiplier' is empty or invalid.");
        }

        //
        // Note: We are going to skip question.MediaUrl validation, is not mandatory to have an image on every question.
        //

        if (!question.Answers.Any(a => a.IsCorrect == true))
        {
          errors.Add($"{whereQ}: At least one answer must be marked as correct.");
        }

        for (int a = 0; a < question.Answers.Count; a++)
        {
          var answer = question.Answers[a];

          if (string.IsNullOrEmpty(answer.Text))
          {
            errors.Add($"{whereQ}.Answers[{a}]: 'Text' cannot be empty.");
          }

          if (answer.IsCorrect == null)
          {
            errors.Add($"{whereQ}.Answers[{a}]: 'IsCorrect' cannot be null.");
          }
        }
      }

      return errors;
    }

    private async Task createKahoot(KahootSeedModel kahoot)
    {
      DateTime now = DateTime.UtcNow;

      // Creating kahoot
      var k = new Kahoot
      {
        Id = Guid.NewGuid(),
        Title = kahoot.Title,
        Description = kahoot.Description,
        MediaUrl = kahoot.MediaUrl,
        UserId = user.Id,
        IsPlayable = true,
        CreatedAt = now,
        UpdatedAt = now,
        Questions = kahoot.Questions.Select(q => new Question
        {
          Title = q.Title,
          Layout = Enum.Parse<QuizQuestionLayoutTypes>(q.Layout, true),
          TimeLimit = q.TimeLimit!.Value,
          PointsMultiplier = q.PointsMultiplier!.Value,
          MediaUrl = q.MediaUrl,
          Answers = q.Answers.Select(a => new Answer
          {
            Text = a.Text,
            IsCorrect = a.IsCorrect!.Value
          }).ToList()
        }).ToList()
      };

      _dbContext.Kahoots.Add(k);

      // KahootCategory
      var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Name == kahoot.Category);

      if (category != null)
      {
        var kahootCategory = new KahootCategory
        {
          KahootId = k.Id,
          CategoryId = category.Id
        };

        _dbContext.KahootCategories.Add(kahootCategory);
      }

      // DiscoverSubsection
      foreach (var subsectionTitle in kahoot.Subsections)
      {
        var subsection = await _dbContext.DiscoverSubsection.FirstOrDefaultAsync(ds => ds.Title == subsectionTitle);

        if (subsection == null)
        {
          Console.WriteLine($"[Error]: Subsection with name '{subsectionTitle}' was not found.");
          return;
        }

        var discoverSubsectionKahoot = new DiscoverSubsectionKahoot
        {
          DiscoverSubsectionId = subsection.Id,
          KahootId = k.Id
        };

        _dbContext.DiscoverSubsectionKahoots.Add(discoverSubsectionKahoot);
      }
    }
  }
}
