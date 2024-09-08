using API.Data;
using API.DTOs.Lobby;
using API.Models.Play;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
  }
}