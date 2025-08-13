using API.Data;
using API.Data.ForClient.Dashboard.Discover.Sections;
using API.Data.ForClient.Dashboard.Kahoot;
using API.Data.Server.KahootCreator;
using API.DTOs.Dashboard;
using API.DTOs.Discover;
using API.DTOs.Statistics;
using API.Models.Statistics;
using API.Services;
using API.Sockets.Hubs;
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
    private readonly KahootService _kahootService;

    public KahootController(DataContext dbContext, UserService userService, KahootService kahootService)
    {
      _dbContext = dbContext;
      _userService = userService;
      _kahootService = kahootService;
    }

    [HttpGet("getBasicInfoFromUsersKahoots")]
    [Authorize]
    public async Task<ActionResult> GetBasicInfoFromUsersKahoots([FromQuery] int pageSize, int currentPage)
    {
      var userId = await _userService.GetUserId();

      int numberOfTotalKahootThatTheUserHas = await _kahootService.GetKahootCountFromUserId(userId);

      // offset: We are receiving the currentPage value as a 1-based, we need to decrease it by 1, so we don't skip results on the first page.
      int offset = (currentPage - 1) * pageSize;
      int limit = pageSize;

      var kahoots = await _dbContext.Kahoots
                      .Where(k => k.UserId == userId)
                      .Select(k => new KahootDashboardList
                      {
                        Id = k.Id,
                        Title = k.Title,
                        Description = k.Description,
                        MediaUrl = k.MediaUrl,
                        TimesPlayed = _dbContext.PlayedKahoots.Count(a => a.KahootId == k.Id),
                        IsPlayable = k.IsPlayable,
                        CreatedAt = k.CreatedAt,
                        UpdatedAt = k.UpdatedAt,
                      })
                      .Skip(offset)
                      .Take(limit)
                      .ToListAsync();

      return Ok(new
      {
        Kahoots = kahoots,
        TotalResults = numberOfTotalKahootThatTheUserHas
      });
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
      bool doesKahootExists = await _kahootService.checkIfKahootExistsById(id);

      if (!doesKahootExists)
      {
        return NotFound();
      }

      return Ok();
    }

    [HttpGet("VerifyOwnership/{id}")]
    public async Task<ActionResult> VerifyOwnership(Guid id)
    {
      string loggedUserId = await _userService.GetUserId();
      string kahootOwnerUserId = await _kahootService.getUserIdByKahootId(id);

      if (loggedUserId != kahootOwnerUserId)
      {
        return Forbid();
      }

      return Ok();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<KahootClient>> GetKahootInformation(Guid id)
    {
      bool kahootExists = await _kahootService.checkIfKahootExistsById(id);
      if (!kahootExists)
      {
        return NotFound();
      }

      var loggedUserId = await _userService.GetUserId();
      bool isOwner = await _kahootService.IsOwner(id, loggedUserId);
      if (!isOwner)
      {
        return Forbid();
      }

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
        MediaUrl = kahoot.MediaUrl,
        IsPlayable = kahoot.IsPlayable,
        IsPublic = kahoot.IsPublic,
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

      var loggedUsersThatPlayedTheKahoot = new List<KahootsPlayedByUser>();

      foreach (Player player in playedKahootData.Players)
      {
        if (string.IsNullOrEmpty(player.UserId))
        {
          continue;
        }

        loggedUsersThatPlayedTheKahoot.Add(new KahootsPlayedByUser
        {
          KahootId = playedKahootData.KahootId,
          UserId = player.UserId,
          PlayedAt = DateTime.UtcNow
        });
      }

      _dbContext.PlayedKahoots.Add(newPlayedKahoot);
      _dbContext.KahootsPlayedByUser.AddRange(loggedUsersThatPlayedTheKahoot);

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

    [Authorize]
    [HttpGet("getRecentlyPlayedKahoots")]
    public async Task<ActionResult<List<DiscoverKahootCardInfoDTO>>> GetRecentlyPlayedKahoots()
    {
      var userId = await _userService.GetUserId();

      var recentKahootIds = await _dbContext.KahootsPlayedByUser
                              .Where(k => k.UserId == userId)
                              .OrderByDescending(k => k.PlayedAt)
                              .Select(k => k.KahootId)
                              .Distinct()
                              .Take(7)
                              .ToListAsync();

      var kahoots = await _dbContext.Kahoots
                        .Where(k => recentKahootIds.Contains(k.Id))
                        .Select(k => new DiscoverKahootCardInfoDTO
                        {
                          KahootId = k.Id,
                          Title = k.Title,
                          MediaUrl = k.MediaUrl
                        })
                        .ToListAsync();

      return Ok(kahoots);
    }

    [Authorize]
    [HttpGet("getCategories")]
    public async Task<ActionResult<List<DiscoverCategoryCardInfoDTO>>> getCategories()
    {
      var categories = await _dbContext.Categories
                                .Where(k => k.IsVisible == true)
                                .Select(k => new DiscoverCategoryCardInfoDTO
                                {
                                  Title = k.Name,
                                  Slug = k.Slug,
                                  MediaUrl = k.MediaUrl
                                })
                                .ToListAsync();

      return Ok(categories);
    }

    [Authorize]
    [HttpGet("getFeaturedKahoots")]
    public async Task<ActionResult<List<DiscoverFeaturedCardInfoDTO>>> getFeaturedKahoots()
    {
      const int FIXED_AMOUNT_OF_KAHOOT_TO_RETRIEVE = 9;

      List<Guid> featuredKahootsIds = await _dbContext.FeaturedKahoots
                                              .Select(k => k.KahootId)
                                              .Skip(0)
                                              .Take(FIXED_AMOUNT_OF_KAHOOT_TO_RETRIEVE)
                                              .ToListAsync();

      List<DiscoverFeaturedCardInfoDTO> kahoots = await _dbContext.Kahoots
                                        .Where(k => featuredKahootsIds.Contains(k.Id))
                                        .Select(k => new DiscoverFeaturedCardInfoDTO
                                        {
                                          KahootId = k.Id,
                                          Title = k.Title,
                                          MediaUrl = k.MediaUrl,
                                          NumberOfQuestions = k.Questions.Count()
                                        })
                                        .ToListAsync();

      return Ok(kahoots);
    }

    [Authorize]
    [HttpGet("getSections")]
    public async Task<ActionResult> getSections()
    {
      var sectionsWithSubsectionAndItsRelatedKahoots = await _dbContext.DiscoverSection
                                                        .Include(s => s.Subsections)
                                                          .ThenInclude(ss => ss.DiscoverSubsectionKahoots)
                                                            .ThenInclude(dsk => dsk.Kahoot)
                                                        .Select(section => new DiscoverSectionClient
                                                        {
                                                          Title = section.Title,
                                                          Subsections = section.Subsections
                                                            .Where(sub => sub.DiscoverSubsectionKahoots.Any(dsk => dsk.Kahoot != null))
                                                            .Select(sub => new DiscoverSubsectionClient
                                                            {
                                                              Title = sub.Title,
                                                              Kahoots = sub.DiscoverSubsectionKahoots
                                                                .Select(dsk => new DiscoverKahootsFromSubsectionClient
                                                                {
                                                                  KahootId = dsk.Kahoot.Id,
                                                                  Title = dsk.Kahoot.Title,
                                                                  MediaUrl = dsk.Kahoot.MediaUrl
                                                                }).ToList()
                                                            }).ToList()
                                                        })
                                                        .Where(section => section.Subsections.Any())
                                                        .ToListAsync();

      return Ok(sectionsWithSubsectionAndItsRelatedKahoots);
    }

    [Authorize]
    [HttpGet("getKahootMetadata")]
    public async Task<ActionResult> getKahootMetadata(Guid kahootId)
    {
      var kahootMetadata = await _dbContext.Kahoots
                                    .Where(k => k.Id == kahootId)
                                    .Select(k => new KahootMetadataClient
                                    {
                                      KahootId = k.Id,
                                      Title = k.Title,
                                      Description = k.Description,
                                      MediaUrl = k.MediaUrl,
                                      TimesPlayed = _dbContext.PlayedKahoots.Count(pk => pk.KahootId == kahootId),
                                      Participants = _dbContext.KahootsPlayedByUser.Count(kpbu => kpbu.KahootId == kahootId),
                                      IsPlayable = k.IsPlayable
                                    })
                                    .FirstOrDefaultAsync();

      return Ok(kahootMetadata);
    }

    /// <summary>
    /// This public method's responsability is to search public and playable kahoots based that matches either their title or description
    /// </summary>
    /// <param name="data"></param>
    /// <returns></returns>
    [Authorize]
    [HttpPost("search")]
    public async Task<ActionResult<List<DiscoverKahootCardInfoDTO>>> SearchKahoots(SearchKahootDTO data)
    {
      string text = data.Query;

      if (string.IsNullOrEmpty(text))
      {
        return BadRequest("Search cannot be empty.");
      }

      var kahoots = await _dbContext.Kahoots
                                  .Where(k =>
                                    (k.Title.Contains(text) || k.Description.Contains(text))
                                    && k.IsPublic == true
                                    && k.IsPlayable == true)
                                  .Select(k => new DiscoverKahootCardInfoDTO
                                  {
                                    KahootId = k.Id,
                                    Title = k.Title,
                                    MediaUrl = k.MediaUrl
                                  })
                                  .ToListAsync();

      return Ok(kahoots);
    }
  }
}