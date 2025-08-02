using API.Data;
using API.Data.Server.KahootCreator;
using API.DTOs.Kahoot;
using API.Interfaces;
using API.Models;
using API.Models.Creator;
using API.Services;
using Microsoft.AspNetCore.Authorization;
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
    private readonly UserService _userService;

    public KahootCreatorController(DataContext dbContext, KahootValidationService kahootValidationService, UserService userService)
    {
      _dbContext = dbContext;
      _kahootValidationService = kahootValidationService;
      _userService = userService;
    }

    [HttpPost("create")]
    [Authorize]
    public async Task<ActionResult> CreateKahoot(CreateKahootQuizDTO data)
    {
      var userId = await _userService.GetUserId();

      Kahoot newKahootQuiz = new Kahoot
      {
        Id = Guid.NewGuid(),
        UserId = userId,
        Title = data.NewKahootName,
        Description = null,
        CreatedAt = DateTime.Now,
        UpdatedAt = DateTime.Now,
        IsPlayable = false
      };

      // Create a Kahoot and a new empty question
      Question newQuestion = createQuestion(newKahootQuiz.Id);
      newKahootQuiz.Questions = new List<Question>() { newQuestion };

      _dbContext.Add(newKahootQuiz);

      try
      {
        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
          NewKahootId = newKahootQuiz.Id
        });
      }
      catch (Exception ex)
      {
        return StatusCode(500);
      }
    }

    /// <summary>
    /// This method will save the entire kahoot
    /// </summary>
    /// <returns></returns>
    [Authorize]
    [HttpPut("drafts")]
    public async Task<ActionResult> Drafts(KahootCreatorFormDraftDTO kahootDraft)
    {
      if (kahootDraft.Questions.Count == 0)
      {
        return BadRequest("You can't delete the last remaining question.");
      }

      var user = await _userService.GetCurrentUserAsync();

      // Retrieving the kahoot from database
      Kahoot kahootFromDB = await _dbContext.Kahoots
                            .Where(k => k.Id == kahootDraft.Id)
                            .Include(k => k.Questions)
                              .ThenInclude(q => q.Answers)
                            .FirstOrDefaultAsync();

      if (kahootFromDB == null)
      {
        return NotFound();
      }

      if (kahootFromDB.UserId != user.Id)
      {
        return Forbid();
      }

      // Updating the kahoot header information
      kahootFromDB.Title = kahootDraft.Title;
      kahootFromDB.Description = kahootDraft.Description;
      kahootFromDB.UpdatedAt = new DateTime();
      kahootFromDB.IsPublic = kahootDraft.IsPublic;
      kahootFromDB.MediaUrl = kahootDraft.MediaUrl;

      // We get the IDs from the questions that exists on the kahoot object (kahootDraft)
      List<int> updatedQuestionIds = kahootDraft.Questions.Select(q => q.Id).ToList();

      // We detect which question IDs (from database) are no longer present on the question IDs from the kahoot object (kahootDraft)
      List<Question> questionsToDelete = kahootFromDB.Questions
                                .Where(q => !updatedQuestionIds.Contains(q.Id))
                                .ToList();

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

          kahootFromDB.Questions.Add(newQuestion);
          continue;
        }

        // Select the already existing question from database
        var existingQuestion = kahootFromDB.Questions
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

          bool allTheAnswersAreNew = updatedQuestion.Answers.All(a => a.Id == 0);

          if (allTheAnswersAreNew)
          {
            existingQuestion.Answers.Clear();

            foreach (var newAnswer in updatedQuestion.Answers)
            {
              existingQuestion.Answers.Add(new Answer
              {
                Text = newAnswer.Text,
                IsCorrect = newAnswer.IsCorrect
              });
            }
          }
          else
          {
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
      }

      // Create the Kahoot object for the client-side
      var kahootDTO = new KahootClient
      {
        Id = kahootFromDB.Id,
        Title = kahootFromDB.Title,
        Description = kahootFromDB.Description,
        CreatedAt = kahootFromDB.CreatedAt,
        UpdatedAt = kahootFromDB.UpdatedAt,
        Questions = kahootFromDB.Questions.Select(q => new QuestionClient
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

      kahootFromDB.IsPlayable = isKahootPlayable;
      kahootDTO.IsPlayable = isKahootPlayable;

      // Save changes into the database
      await _dbContext.SaveChangesAsync();

      return Ok(kahootDTO);
    }

    #region Private functions

    private Question createQuestion(Guid kahootId)
    {
      List<Answer> newAnswers = new List<Answer>();

      for (int i = 0; i < 4; i++)
      {
        newAnswers.Add(new Answer
        {
          Text = "",
          IsCorrect = false
        });
      }

      Question newQuestion = new Question
      {
        KahootId = kahootId,
        Title = "",
        Layout = QuizQuestionLayoutTypes.CLASSIC,
        TimeLimit = TimeLimits.THIRTY_S,
        PointsMultiplier = PointsMultiplier.STANDARD,
        MediaUrl = "",
        Answers = newAnswers
      };

      return newQuestion;
    }
    
    #endregion
  }
}
