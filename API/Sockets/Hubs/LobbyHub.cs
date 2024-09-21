using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;

namespace API.Sockets.Hubs
{
  public class LobbyHub : Hub
  {
    private static ConcurrentDictionary<string, Player> connectedPlayers = new ConcurrentDictionary<string, Player>();
    private static ConcurrentDictionary<string, List<Player>> lobbyPlayers = new ConcurrentDictionary<string, List<Player>>();

    public async Task PutUserInLobbyQueue(string lobbyId, Player newPlayerData)
    {
      var newPlayer = new Player
      {
        Id = Context.ConnectionId,
        Name = newPlayerData.Name
      };

      connectedPlayers.TryAdd(newPlayer.Id, newPlayer);

      if (lobbyPlayers.ContainsKey(lobbyId))
      {
        lobbyPlayers[lobbyId].Add(newPlayer);
      }
      else
      {
        lobbyPlayers[lobbyId] = new List<Player> { newPlayer };
      }

      await Groups.AddToGroupAsync(Context.ConnectionId, lobbyId);

      await Clients.Caller.SendAsync("ReceiveAllPlayers", lobbyPlayers[lobbyId]);

      await Clients.Group(lobbyId).SendAsync("AddNewPlayer", newPlayer);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
      string playerId = Context.ConnectionId;

      if (connectedPlayers.TryRemove(playerId, out var removedPlayer))
      {
        foreach (var lobby in lobbyPlayers)
        {
          if (lobby.Value.Remove(removedPlayer))
          {
            await Clients.Group(lobby.Key).SendAsync("PlayerHasLeft", playerId);
            break;
          }
        }
      }

      await base.OnDisconnectedAsync(exception);
    }

    public async Task KickPlayer(string lobbyId, string playerId)
    {
      if (connectedPlayers.TryRemove(playerId, out var _))
      {
        lobbyPlayers[lobbyId].RemoveAll(p => p.Id == playerId);

        await Clients.Group(lobbyId).SendAsync("PlayerHasLeft", playerId);
        await Clients.Client(playerId).SendAsync("DisconnectPlayer");
      }
    }

    public async Task StartingGame(string lobbyId)
    {
      await Clients.Group(lobbyId).SendAsync("GameHasStarted");
    }
  }

  public class Player
  {
    public string Id { get; set; }
    public string Name { get; set; }
  }

  public class PlayerNickName {
    public string Name { get; set; }
  }
}