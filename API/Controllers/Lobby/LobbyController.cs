using API.Data;
using API.DTOs.Lobby;
using API.Models.Play;
using API.Services;
using Microsoft.AspNetCore.Authorization;
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

    [HttpGet("checkIfTheUserIsHostFromTheGame")]
    public async Task<ActionResult> CheckIfUserIsHostFromTheGame(int lobbyId)
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
  }
}