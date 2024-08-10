using API.Data;
using API.Data.Server.KahootCreator;
using API.Models;
using API.Models.Creator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [ApiController]
  [Route("/api/[controller]")]
  public class KahootCreatorController : ControllerBase
  {
    private readonly DataContext _dbContext;

    public KahootCreatorController(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    /// <summary>
    /// This method will save the entire kahoot
    /// </summary>
    /// <returns></returns>
    [HttpPut("drafts")]
    public async Task<ActionResult> Drafts(KahootCreatorFormDraftDTO kahootDraft)
    {
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

      // Updating the kahoot's questions
      foreach (var updatedQuestion in kahootDraft.Questions)
      {
        if (updatedQuestion.Id == 0)
        {
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
          await _dbContext.SaveChangesAsync();
          continue;
        }

        var existingQuestion = kahootToUpd.Questions
                                .FirstOrDefault(q => q.Id == updatedQuestion.Id);
        
        
        // If the questions exists
        if (existingQuestion != null)
        {
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

      // Save changes into the database
      await _dbContext.SaveChangesAsync();

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

      return Ok(kahootDTO);
    }
  }
}
