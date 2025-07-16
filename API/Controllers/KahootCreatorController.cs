using API.Data;
using API.Data.Server.KahootCreator;
using API.Models;
using API.Models.Creator;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [ApiController]
  [Route("/api/[controller]")]
  public class KahootCreatorController : ControllerBase
  {
    private readonly DataContext _dbContext;
    private readonly KahootValidationService _kahootValidationService;

    public KahootCreatorController(DataContext dbContext, KahootValidationService kahootValidationService)
    {
      _dbContext = dbContext;
      _kahootValidationService = kahootValidationService;
    }

    /// <summary>
    /// This method will save the entire kahoot
    /// </summary>
    /// <returns></returns>
    [HttpPut("drafts")]
    public async Task<ActionResult> Drafts(KahootCreatorFormDraftDTO kahootDraft)
    {
      // Retrieving the kahoot from database
      Kahoot kahootToUpd = await _dbContext.Kahoots
                            .Where(k => k.Id == kahootDraft.Id)
                            .Include(k => k.Questions)
                              .ThenInclude(q => q.Answers)
                            .FirstOrDefaultAsync();

      if (kahootToUpd == null)
      {
        return NotFound();
      }

      // Updating the kahoot header information
      kahootToUpd.Title = kahootDraft.Title;
      kahootToUpd.Description = kahootDraft.Description;
      kahootToUpd.UpdatedAt = new DateTime();

      // We get the IDs from the questions that exists on the kahoot object (kahootDraft)
      List<int> updatedQuestionIds = kahootDraft.Questions.Select(q => q.Id).ToList();

      // We detect which question IDs (from database) are no longer present on the question IDs from the kahoot object (kahootDraft)
      List<Question> questionsToDelete = kahootToUpd.Questions
                                .Where(q => !updatedQuestionIds.Contains(q.Id))
                                .ToList();

      // Iterate each question that we are going to delete to validate if they contain a media resource (picture), and, if so, delete the picture froms server
      foreach (Question question in questionsToDelete)
      {
        if (!string.IsNullOrEmpty(question.MediaUrl))
        {
          var mediaPath = Path.Combine(Directory.GetCurrentDirectory(), question.MediaUrl.TrimStart('/'));

          if (System.IO.File.Exists(mediaPath))
          {
            System.IO.File.Delete(mediaPath);
          }
        }
      }

      // We delete the questions from client-side
      _dbContext.Questions.RemoveRange(questionsToDelete);

      // Updating the kahoot's questions
      foreach (var updatedQuestion in kahootDraft.Questions)
      {
        // If the questions is new (from client-side)
        if (updatedQuestion.Id == 0)
        {
          // Create a new question and add it to the Questions collection
          var newQuestion = new Question
          {
            KahootId = kahootDraft.Id,
            Title = updatedQuestion.Title,
            Layout = updatedQuestion.Layout,
            TimeLimit = updatedQuestion.TimeLimit,
            PointsMultiplier = updatedQuestion.PointsMultiplier,
            MediaUrl = updatedQuestion.MediaUrl,
            Answers = updatedQuestion.Answers.Select(a => new Answer
            {
              Text = a.Text,
              IsCorrect = a.IsCorrect
            }).ToList()
          };

          kahootToUpd.Questions.Add(newQuestion);
          continue;
        }

        // Select the already existing question from database
        var existingQuestion = kahootToUpd.Questions
                                .FirstOrDefault(q => q.Id == updatedQuestion.Id);

        // If the questions exists
        if (existingQuestion != null)
        {
          // Update the question data
          existingQuestion.Title = updatedQuestion.Title;
          existingQuestion.Layout = updatedQuestion.Layout;
          existingQuestion.TimeLimit = updatedQuestion.TimeLimit;
          existingQuestion.PointsMultiplier = updatedQuestion.PointsMultiplier;
          existingQuestion.MediaUrl = updatedQuestion.MediaUrl;

          // Updating the kahoot's answers information
          foreach (var updatedAnswer in updatedQuestion.Answers)
          {
            var existingAnswer = existingQuestion.Answers
                                  .FirstOrDefault(a => a.Id == updatedAnswer.Id);

            if (existingAnswer != null)
            {
              existingAnswer.Text = updatedAnswer.Text;
              existingAnswer.IsCorrect = updatedAnswer.IsCorrect;
            }
          }
        }
      }

      // Create the Kahoot object for the client-side
      var kahootDTO = new KahootClient
      {
        Id = kahootToUpd.Id,
        Title = kahootToUpd.Title,
        Description = kahootToUpd.Description,
        CreatedAt = kahootToUpd.CreatedAt,
        UpdatedAt = kahootToUpd.UpdatedAt,
        Questions = kahootToUpd.Questions.Select(q => new QuestionClient
        {
          Id = q.Id,
          Title = q.Title,
          Layout = q.Layout,
          TimeLimit = q.TimeLimit,
          PointsMultiplier = q.PointsMultiplier,
          MediaUrl = q.MediaUrl,
          Answers = q.Answers.Select(a => new AnswerClient
          {
            Id = a.Id,
            Text = a.Text,
            IsCorrect = a.IsCorrect
          }).ToList()
        }).ToList()
      };

      bool isKahootPlayable = _kahootValidationService.ValidateKahoot(kahootDTO);

      kahootToUpd.IsPlayable = isKahootPlayable;
      kahootDTO.IsPlayable = isKahootPlayable;

      // Save changes into the database
      await _dbContext.SaveChangesAsync();

      return Ok(kahootDTO);
    }

    /// <summary>
    /// Uploads an image in the following server path: "/Uploads/Questions".
    /// The use of the "/Uploads/Questions" directory is for the Kahoot questions that has media attached to them.
    /// </summary>
    /// <param name="file"></param>
    /// <returns></returns>
    [HttpPost("upload-question-media")]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB
    public async Task<ActionResult> UploadQuestionMedia(IFormFile file)
    {
      if (file == null || file.Length == 0)
      {
        return BadRequest("No file uploaded");
      }

      var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Questions");

      if (!Directory.Exists(uploadsFolder))
      {
        Directory.CreateDirectory(uploadsFolder);
      }

      var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
      var filePath = Path.Combine(uploadsFolder, uniqueFileName);

      using (var stream = new FileStream(filePath, FileMode.Create))
      {
        await file.CopyToAsync(stream);
      }

      var relativeUrl = $"/Uploads/Questions/{uniqueFileName}";

      return Ok(new { relativeUrl });
    }
  }
}
