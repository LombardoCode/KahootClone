using API.Data;
using API.Data.ForClient.Dashboard.Kahoot;
using API.Data.Server.KahootCreator;
using API.DTOs.Kahoot;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [ApiController]
  [Route("/api/[controller]")]
  public class KahootController : ControllerBase
  {
    private readonly DataContext _dbContext;
    private readonly UserService _userService;

    public KahootController(DataContext dbContext, UserService userService)
    {
      _dbContext = dbContext;
      _userService = userService;
    }

    [HttpGet("getBasicInfoFromUsersKahoots")]
    [Authorize]
    public async Task<ActionResult> GetBasicInfoFromUsersKahoots()
    {
      var userId = await _userService.GetUserId();

      var kahoots = await _dbContext.Kahoots
                      .Where(k => k.UserId == userId)
                      .Select(k => new KahootDashboardList
                      {
                        Id = k.Id,
                        Title = k.Title,
                        Description = k.Description,
                        CreatedAt = k.CreatedAt,
                        UpdatedAt = k.UpdatedAt
                      })
                      .ToListAsync();
      
      return Ok(kahoots);
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
        UpdatedAt = DateTime.Now
      };

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

    [HttpGet("KahootExists/{id}")]
    public async Task<ActionResult> KahootExists(Guid id)
    {
      bool kahootExists = _dbContext.Kahoots.Any(k => k.Id == id);
      return Ok(kahootExists);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<KahootClient>> GetKahootInformation(Guid id)
    {
      var kahoot = await _dbContext.Kahoots
                      .Where(k => k.Id == id)
                      .Include(k => k.Questions)
                        .ThenInclude(q => q.Answers)
                      .FirstOrDefaultAsync();  
      
      if (kahoot == null)
      {
        return NotFound();
      }

      var kahootDTO = new KahootClient
      {
        Id = kahoot.Id,
        Title = kahoot.Title,
        Description = kahoot.Description,
        CreatedAt = kahoot.CreatedAt,
        UpdatedAt = kahoot.UpdatedAt,
        Questions = kahoot.Questions.Select(q => new QuestionClient
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