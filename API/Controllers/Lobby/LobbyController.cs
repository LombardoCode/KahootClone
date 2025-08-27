using API.Data;
using API.Data.ForClient.Play;
using API.DTOs.Lobby;
using API.Models.Play;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.Play
{
  [ApiController]
  [Route("/api/[controller]")]
  public class LobbyController : ControllerBase
  {
    private readonly DataContext _dbContext;
    private readonly LobbyService _lobbyService;
    private readonly UserService _userService;

    public LobbyController(DataContext dbContext, LobbyService lobbyService, UserService userService)
    {
      _dbContext = dbContext;
      _lobbyService = lobbyService;
      _userService = userService;
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<ActionResult> Create(CreateLobbyDTO data)
    {
      var userId = await _userService.GetUserId();

      Lobby lobby = new Lobby
      {
        CurrentState = GameState.WaitingForPlayers,
        GamePIN = await _lobbyService.GenerateUniquePIN(),
        KahootId = data.KahootId,
        UserId = userId
      };

      _dbContext.Lobbies.Add(lobby);

      await _dbContext.SaveChangesAsync();

      return Ok(new {
        GamePIN = lobby.GamePIN
      });
    }

    [HttpPost("checkIfValidLobby")]
    public async Task<ActionResult<bool>> CheckIfValidLobby(ValidLobbyDTO lobbyData)
    {
      string lobbyId = lobbyData.LobbyId;

      var lobby = await _dbContext.Lobbies
        .Where(l => l.GamePIN == lobbyId)
        .FirstOrDefaultAsync();
      
      if (lobby == null)
      {
        return Ok(false);
      }

      if (lobby.CurrentState != GameState.WaitingForPlayers)
      {
        return Ok(false);
      }

      return Ok(true);
    }

    [HttpGet("checkIfTheUserIsHostFromTheGame")]
    public async Task<ActionResult> CheckIfUserIsHostFromTheGame(string lobbyId)
    {
      bool lobbyExists = await _dbContext.Lobbies.AnyAsync(l => l.GamePIN == lobbyId);

      if (!lobbyExists)
      {
        return NotFound("Lobby was not found");
      }

      bool IsHost = false;
      var userId = await _userService.GetUserId();

      if (!String.IsNullOrEmpty(userId))
      {
        string hostIdFromTheGame = await _dbContext.Lobbies
          .Where(l => l.GamePIN == lobbyId)
          .Select(l => l.UserId)
          .FirstOrDefaultAsync();
        
        if (!String.IsNullOrEmpty(hostIdFromTheGame) && userId == hostIdFromTheGame)
        {
          IsHost = true;
        }
      }

      return Ok(new { IsHost });
    }

    [HttpPost("startTheGame")]
    public async Task<ActionResult<bool>> StartTheGame(StartTheGameDTO gameData)
    {
      string lobbyId = gameData.LobbyId;
      string userId = await _userService.GetUserId();
      bool gameStarted = false;

      var hostIdFromTheGame = await _dbContext.Lobbies
        .Where(l => l.GamePIN == lobbyId)
        .Select(l => l.UserId)
        .FirstOrDefaultAsync();
      
      if (!String.IsNullOrEmpty(userId) && userId == hostIdFromTheGame)
      {
        var lobby = await _dbContext.Lobbies
          .Where(l => l.GamePIN == lobbyId)
          .FirstOrDefaultAsync();
        
        if (lobby != null)
        {
          lobby.CurrentState = GameState.InProgress;
          gameStarted = true;
          await _dbContext.SaveChangesAsync();
        }
      }

      return Ok(gameStarted);
    }

    [HttpGet("getKahootTitleAndQuestions")]
    public async Task<ActionResult> getKahootTitleAndQuestions(string lobbyId)
    {
      string userId = await _userService.GetUserId();

      var hostIdFromTheGame = await _dbContext.Lobbies
        .Where(l => l.GamePIN == lobbyId)
        .Select(l => l.UserId)
        .FirstOrDefaultAsync();
      
      if (!String.IsNullOrEmpty(userId) && userId == hostIdFromTheGame)
      {
        var kahootId = await _dbContext.Lobbies
          .Where(l => l.GamePIN == lobbyId)
          .Select(l => l.KahootId)
          .FirstOrDefaultAsync();
        
        if (!String.IsNullOrEmpty(kahootId.ToString()))
        {
          var kahoot = await _dbContext.Kahoots
                      .Where(k => k.Id == kahootId)
                      .Include(k => k.Questions)
                        .ThenInclude(q => q.Answers)
                      .FirstOrDefaultAsync();
          
          if (kahoot == null)
          {
            return NotFound();
          }

          string kahootTitle = kahoot.Title;
          var questionsToBePlayed = kahoot.Questions.Select(q => new QuestionPlayClient
          {
            Id = q.Id,
            Title = q.Title,
            Layout = q.Layout,
            TimeLimit = q.TimeLimit,
            PointsMultiplier = q.PointsMultiplier,
            MediaUrl = q.MediaUrl,
            Answers = q.Answers.Select(a => new AnswerPlayClient
            {
              Id = a.Id,
              Text = a.Text,
              IsCorrect = a.IsCorrect,
              IsSelected = false
            }).ToList()
          }).ToList();

          var kahootToBePlayed = new KahootPlayClient
          {
            KahootId = kahootId,
            Title = kahootTitle,
            Questions = questionsToBePlayed
          };

          return Ok(kahootToBePlayed);
        }
      }

      return NotFound("Lobby was not found");
    }
  }
}
