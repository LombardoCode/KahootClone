using API.Data;
using API.Data.ForClient.Dashboard.Kahoot;
using API.Data.Server.KahootCreator;
using API.DTOs.Statistics;
using API.Models.Statistics;
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
                        TimesPlayed = _dbContext.PlayedKahoots.Count(a => a.KahootId == k.Id),
                        IsPlayable = k.IsPlayable,
                        CreatedAt = k.CreatedAt,
                        UpdatedAt = k.UpdatedAt,
                      })
                      .ToListAsync();

      return Ok(kahoots);
    }

    [HttpDelete("delete/{kahootId}")]
    [Authorize]
    public async Task<ActionResult> DeleteKahoot(Guid kahootId)
    {
      var userId = await _userService.GetUserId();

      var kahoot = await _dbContext.Kahoots.FirstOrDefaultAsync(k => k.Id == kahootId);


      if (kahoot != null)
      {
        bool isUserTheOwnerOfTheKahoot = userId == kahoot.UserId;

        if (!isUserTheOwnerOfTheKahoot)
        {
          return StatusCode(403);
        }

        try
        {
          _dbContext.Kahoots.Remove(kahoot);
          await _dbContext.SaveChangesAsync();

          return Ok();
        }
        catch (Exception)
        {
          return StatusCode(500);
        }
      }
      else
      {
        return StatusCode(404);
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
        IsPlayable = kahoot.IsPlayable,
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

    [HttpPost("RegisterPlayCount")]
    public async Task<ActionResult> RegisterPlayCount(PlayedKahootDTO playedKahootData)
    {
      var newPlayedKahoot = new PlayedKahoots
      {
        KahootId = playedKahootData.KahootId
      };

      _dbContext.PlayedKahoots.Add(newPlayedKahoot);

      try
      {
        await _dbContext.SaveChangesAsync();

        return Ok();
      }
      catch (Exception ex)
      {
        return StatusCode(500);
      }
    }
  }
}