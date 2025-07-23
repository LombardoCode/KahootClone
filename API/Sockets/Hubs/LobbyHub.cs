using System.Collections.Concurrent;
using API.Data.ForClient.Play;
using Microsoft.AspNetCore.SignalR;
using API.Data;
using Microsoft.EntityFrameworkCore;
using API.Services;

namespace API.Sockets.Hubs
{
  public class LobbyHub : Hub
  {
    /// <summary>
    /// Maps a lobby ID to a list of players currently in that lobby
    /// </summary>
    private static ConcurrentDictionary<string, List<Player>> playersInLobby = new ConcurrentDictionary<string, List<Player>>();

    /// <summary>
    /// Maps a question ID to a list of player IDs that have responded to that specific question
    /// </summary>
    private static ConcurrentDictionary<(string lobbyId, int questionId), HashSet<string>> playerResponses = new ConcurrentDictionary<(string, int), HashSet<string>>();

    /// <summary>
    /// Maps a question ID to the total count of responses received for that question ID
    /// </summary>
    private static ConcurrentDictionary<(string lobbyId, int questionId), int> responseCount = new ConcurrentDictionary<(string, int), int>();

    /// <summary>
    /// Maps a player ID to the lobby ID
    /// </summary>
    private static ConcurrentDictionary<string, string> playerLobbyMapping = new ConcurrentDictionary<string, string>();

    /// <summary>
    /// Maps a lobby ID to a set of question IDs for a specific lobbyId
    /// </summary>
    private static ConcurrentDictionary<string, HashSet<int>> questionIdsPerLobby = new ConcurrentDictionary<string, HashSet<int>>();

    /// <summary>
    /// Maps the current question ID by lobbyId
    /// </summary>
    private static ConcurrentDictionary<string, int> currentQuestionPerLobby = new ConcurrentDictionary<string, int>();

    /// <summary>
    /// Maps the current question ID by lobbyId
    /// </summary>
    private static ConcurrentDictionary<string, string> hostConnectionPerLobby = new ConcurrentDictionary<string, string>();

    /// <summary>
    /// Provides access to the database
    /// </summary>
    private readonly DataContext _dbContext;

    /// <summary>
    /// User service helper class
    /// </summary>
    private readonly UserService _userService;

    public LobbyHub(DataContext dbContext, UserService userService)
    {
      _dbContext = dbContext;
      _userService = userService;
    }

    /// <summary>
    /// Code that gets executed when SignalR connection from client gets disconnected
    /// </summary>
    /// <param name="exception"></param>
    /// <returns></returns>
    public override async Task OnDisconnectedAsync(Exception exception)
    {
      string playerConnId = Context.ConnectionId;
      string? lobbyId;

      // Detect if the host is leaving the game
      bool isHostLeavingTheGame = hostConnectionPerLobby.Any(l => l.Value == playerConnId);

      if (isHostLeavingTheGame)
      {
        lobbyId = hostConnectionPerLobby.FirstOrDefault(l => l.Value == playerConnId).Key;

        if (lobbyId != null)
        {
          bool lobbyStillHasPlayers = playersInLobby.TryGetValue(lobbyId, out var players) && players.Count > 0;

          if (lobbyStillHasPlayers)
          {
            await Clients.Group(lobbyId).SendAsync("OnHostAbandonedTheGame");
          }

          hostConnectionPerLobby.TryRemove(lobbyId, out _);

          // Since the host is leaving the lobby, we will start destroying the lobby data. The connected guests will be notified and redirected via "OnHostAbandonedTheGame".
          await DestroyLobbyData(lobbyId);
        }
      }

      // Try to remove the player that is trying to get disconnected and get the lobbyId
      if (playerLobbyMapping.TryRemove(playerConnId, out lobbyId))
      {
        // Get the list of the current players based on the lobbyId
        if (playersInLobby.TryGetValue(lobbyId, out var players))
        {
          // Find the player that is going to be disocnnected based on their ConnectionId
          var removedPlayer = players.FirstOrDefault(p => p.ConnectionId == playerConnId);

          if (removedPlayer != null)
          {
            players.Remove(removedPlayer);

            // Get the current questionId of the lobby
            if (currentQuestionPerLobby.TryGetValue(lobbyId, out var currentQuestionId))
            {
              var key = (lobbyId, currentQuestionId);

              // Check if the player that is going to be disconnected has answered to the current question that is being played
              if (playerResponses.TryGetValue(key, out var playerSet) && playerSet.Remove(playerConnId))
              {
                // Refresh the answers count for the current question
                responseCount[key] = playerSet.Count;
                int numberOfPeopleWhoHaveAnsweredTheCurrentQuestionRightNow = responseCount[key];

                await Clients.Group(lobbyId).SendAsync("OnUpdateTotalOfProvidedAnswersForCurrentQuestion", numberOfPeopleWhoHaveAnsweredTheCurrentQuestionRightNow);
              }
            }

            await Clients.Group(lobbyId).SendAsync("PlayerHasLeft", playerConnId);
          }
        }
      }

      // Destroy the lobby data when there are no more active players
      if (!string.IsNullOrEmpty(lobbyId))
      {
        bool lobbyHasNoPlayers = !playersInLobby.ContainsKey(lobbyId) || playersInLobby[lobbyId].Count == 0;
        bool hostIsGone = !hostConnectionPerLobby.ContainsKey(lobbyId);

        if (lobbyHasNoPlayers && hostIsGone)
        {
          await DestroyLobbyData(lobbyId);
        }
      }

      await base.OnDisconnectedAsync(exception);
    }

    public async Task IntegrateConnectionIdToTheLobbyGroup(string lobbyId, bool isHost)
    {
      if (isHost)
      {
        hostConnectionPerLobby[lobbyId] = Context.ConnectionId;
      }

      await Groups.AddToGroupAsync(Context.ConnectionId, lobbyId);
    }

    public async Task PutUserInLobbyQueue(string lobbyId, Player newPlayerData)
    {
      var userId = await _userService.GetUserId();

      // First, we create our player
      var newPlayer = new Player
      {
        ConnectionId = Context.ConnectionId,
        UserId = string.IsNullOrEmpty(userId) ? null : userId,
        Name = newPlayerData.Name,
        EarnedPoints = 0
      };

      // Then add it into our dictionary, mapping the player's ConnectionId -> to the lobbyId they are connected to
      playerLobbyMapping.TryAdd(newPlayer.ConnectionId, lobbyId);

      // Then add that player's info into our lobby dictionary
      if (playersInLobby.ContainsKey(lobbyId))
      {
        playersInLobby[lobbyId].Add(newPlayer);
      }
      else
      {
        playersInLobby[lobbyId] = new List<Player> { newPlayer };
      }

      await Clients.Group(lobbyId).SendAsync("AddNewPlayer", newPlayer);
    }

    public async Task SetCurrentQuestionIdForLobby(string lobbyId, int currentQuestionId)
    {
      if (currentQuestionPerLobby.ContainsKey(lobbyId))
      {
        currentQuestionPerLobby[lobbyId] = currentQuestionId;
      }
      else
      {
        currentQuestionPerLobby.TryAdd(lobbyId, currentQuestionId);
      }
    }

    public async Task KickPlayer(string lobbyId, string playerId)
    {
      string playerConnId = playerId;

      // Gets the lobbyId from the user that host is trying to kick out
      if (playerLobbyMapping.TryRemove(playerConnId, out var existingLobbyId) && existingLobbyId == lobbyId)
      {
        // Gets the list of players from the current lobby
        if (playersInLobby.TryGetValue(lobbyId, out var players))
        {
          players.RemoveAll(p => p.ConnectionId == playerConnId);

          await Clients.Group(lobbyId).SendAsync("PlayerHasLeft", playerConnId);
        }

        await Clients.Client(playerConnId).SendAsync("DisconnectPlayer");
      }
    }

    public async Task ShareQuestionsWithEveryone(KahootPlayClient kahootInfo)
    {
      await Clients.Others.SendAsync("ReceiveAllQuestionsFromHost", kahootInfo);
    }

    public async Task StartingGame(string lobbyId)
    {
      // Notify players that the game has started
      await Clients.Group(lobbyId).SendAsync("GameHasStarted");
    }

    public async Task SendGuestsToTheGetReadyPage(string lobbyId, int questionIndex)
    {
      await Clients.OthersInGroup(lobbyId).SendAsync("OnRedirectToTheGetReadyPage", questionIndex);
    }

    public async Task NotifyGuestsThatTheQuestionHasStarted(string lobbyId)
    {
      await Clients.OthersInGroup(lobbyId).SendAsync("GuestsAreNotifiedThatQuestionHasStarted");
    }

    public async Task NotifyAnswerReceived(string lobbyId, int questionId, int answerId)
    {
      string playerConnId = Context.ConnectionId;
      var key = (lobbyId, questionId);

      if (!playerResponses.ContainsKey(key))
      {
        playerResponses[key] = new HashSet<string>();
      }

      if (playerResponses[key].Add(playerConnId))
      {
        responseCount[key] = playerResponses[key].Count;
        int numberOfPeopleWhoHaveAnsweredTheCurrentQuestionRightNow = responseCount[key];

        if (!questionIdsPerLobby.ContainsKey(lobbyId))
        {
          questionIdsPerLobby[lobbyId] = new HashSet<int>();
        }
        questionIdsPerLobby[lobbyId].Add(questionId);

        string hostConnIdFromLobby = hostConnectionPerLobby[lobbyId];

        await Clients.Client(hostConnIdFromLobby).SendAsync("OnUpdateTotalOfProvidedAnswersForCurrentQuestion", numberOfPeopleWhoHaveAnsweredTheCurrentQuestionRightNow);

        await Clients.Client(hostConnIdFromLobby).SendAsync("UpdateAnswerBoard", playerConnId, answerId);
      }
    }

    public async Task SendPlayerFinalStatsToAllPlayers(string lobbyId, List<FinalPlayerStats> playersFinalStats)
    {
      await Clients.OthersInGroup(lobbyId).SendAsync("OnReceivePlayersFinalStats", playersFinalStats);
    }

    public async Task UpdatePlayerInfo(Player updatedPlayerInfo)
    {
      await Clients.Client(updatedPlayerInfo.ConnectionId).SendAsync("ReceiveMyUpdatedPlayerInfo", updatedPlayerInfo);
    }

    public async Task NotifyPlayerHowManyPointsTheyGotFromCurrentQuestion(string playerConnId, int pointsEarnedFromCurrentQuestion)
    {
      await Clients.Client(playerConnId).SendAsync("OnReceiveHowManyPointsPlayerEarnedFromCurrentQuestion", pointsEarnedFromCurrentQuestion);
    }

    public async Task NotifyOtherPlayersToShowTheirStats(string lobbyId)
    {
      await Clients.OthersInGroup(lobbyId).SendAsync("OnNotifyOtherPlayersToShowTheirStats", true);
    }

    public async Task RedirectGuestsFromLobbyToSpecificPage(string lobbyId, string clientPath)
    {
      await Clients.OthersInGroup(lobbyId).SendAsync("OnRedirectGuestsToSpecificPage", clientPath);
    }

    public async Task DestroyLobbyData(string lobbyId)
    {
      RemoveAllPlayersFromSpecificLobby(lobbyId);
      RemoveAllPlayerReponsesFromSpecificLobby(lobbyId);
      RemoveAllResponsesCountFromSpecificLobby(lobbyId);
      RemoveAllPlayerToLobbyMappingFromSpecificLobby(lobbyId);
      RemoveAllQuestionIdsToLobbyMappingFromSpecificLobby(lobbyId);
      RemoveTheCurrentQuestionIdFromSpecificLobby(lobbyId);
      await RemoveLobbyRecordFromDatabase(lobbyId);
    }

    private void RemoveAllPlayersFromSpecificLobby(string lobbyId)
    {
      // Remove all players from our local lobby <-> player tracking variable "playersInLobby"
      playersInLobby.TryRemove(lobbyId, out _);
    }

    private void RemoveAllPlayerReponsesFromSpecificLobby(string lobbyId)
    {
      var keysToRemove = playerResponses.Keys
                          .Where(key => key.lobbyId == lobbyId)
                          .ToList();

      foreach (var key in keysToRemove)
      {
        playerResponses.TryRemove(key, out var _);
      }
    }

    private void RemoveAllResponsesCountFromSpecificLobby(string lobbyId)
    {
      var keysToRemove = responseCount.Keys
                          .Where(key => key.lobbyId == lobbyId)
                          .ToList();

      foreach (var key in keysToRemove)
      {
        responseCount.TryRemove(key, out var _);
      }
    }

    private void RemoveAllPlayerToLobbyMappingFromSpecificLobby(string lobbyId)
    {
      var playersToRemove = playerLobbyMapping
                            .Where(entry => entry.Value == lobbyId)
                            .Select(entry => entry.Key)
                            .ToList();

      foreach (var playerConnId in playersToRemove)
      {
        playerLobbyMapping.TryRemove(playerConnId, out _);
      }
    }

    private void RemoveAllQuestionIdsToLobbyMappingFromSpecificLobby(string lobbyId)
    {
      questionIdsPerLobby.TryRemove(lobbyId, out _);
    }

    private void RemoveTheCurrentQuestionIdFromSpecificLobby(string lobbyId)
    {
      currentQuestionPerLobby.TryRemove(lobbyId, out _);
    }

    private async Task RemoveLobbyRecordFromDatabase(string lobbyId)
    {
      if (int.TryParse(lobbyId, out var lobbyIdAsInt))
      {
        var lobby = await _dbContext.Lobbies.FirstOrDefaultAsync(l => l.GamePIN == lobbyIdAsInt);

        if (lobby != null)
        {
          _dbContext.Lobbies.Remove(lobby);
          await _dbContext.SaveChangesAsync();
        }
      }
    }
  }

  public class Player
  {
    public string ConnectionId { get; set; }
    public string? UserId { get; set; }
    public string Name { get; set; }
    public int EarnedPoints { get; set; } = 0;
  }

  public class FinalPlayerStats : Player
  {
    public int place { get; set; }
  }

  public class PlayerNickName
  {
    public string Name { get; set; }
  }
}
