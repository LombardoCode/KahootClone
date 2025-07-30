using API.Data;
using API.Data.ForClient.Dashboard.Discover.Sections;
using API.Data.ForClient.Dashboard.Kahoot;
using API.Data.Server.KahootCreator;
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
                        MediaUrl = k.MediaUrl,
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
      List<Guid> featuredKahootsIds = await _dbContext.FeaturedKahoots
                                              .Select(k => k.KahootId)
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
  }
}