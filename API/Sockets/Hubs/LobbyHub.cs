using System.Collections.Concurrent;
using API.Data.ForClient.Play;
using Microsoft.AspNetCore.SignalR;

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
    private static ConcurrentDictionary<int, HashSet<string>> playerResponsesPerQuestion = new ConcurrentDictionary<int, HashSet<string>>();

    /// <summary>
    /// Maps a question ID to the total count of responses received for that question ID
    /// </summary>
    private static ConcurrentDictionary<int, int> responseCountPerQuestion = new ConcurrentDictionary<int, int>();

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
    /// Code that gets executed when SignalR connection from client gets disconnected
    /// </summary>
    /// <param name="exception"></param>
    /// <returns></returns>
    public override async Task OnDisconnectedAsync(Exception exception)
    {
      string playerConnId = Context.ConnectionId;

      // Try to remove the player that is trying to get disconnected and get the lobbyId
      if (playerLobbyMapping.TryRemove(playerConnId, out var lobbyId))
      {
        // Get the list of the current players based on the lobbyId
        if (playersInLobby.TryGetValue(lobbyId, out var players))
        {
          // Find the player that is going to be disocnnected based on their ConnectionId
          var removedPlayer = players.FirstOrDefault(p => p.Id == playerConnId);

          if (removedPlayer != null)
          {
            players.Remove(removedPlayer);

            // Get the current questionId of the lobby
            if (currentQuestionPerLobby.TryGetValue(lobbyId, out var currentQuestionId))
            {
              // Check if the player that is going to be disconnected has answered to the current question that is being played
              if (playerResponsesPerQuestion.TryGetValue(currentQuestionId, out var playerSet) && playerSet.Remove(playerConnId))
              {
                // Refresh the answers count for the current question
                responseCountPerQuestion[currentQuestionId] = playerSet.Count;
                await Clients.Group(lobbyId).SendAsync("UpdateAnswerCount", responseCountPerQuestion[currentQuestionId]);
              }
            }

            await Clients.Group(lobbyId).SendAsync("PlayerHasLeft", playerConnId);
          }
        }
      }

      await base.OnDisconnectedAsync(exception);
    }

    public async Task IntegrateGuestToTheLobbyGroup(string lobbyId)
    {
      await Groups.AddToGroupAsync(Context.ConnectionId, lobbyId);
    }

    public async Task GetAllPlayersFromLobby(string lobbyId)
    {
      if (!playersInLobby.ContainsKey(lobbyId))
      {
        playersInLobby[lobbyId] = new List<Player>();
      }

      await Clients.Caller.SendAsync("ReceiveAllPlayers", playersInLobby[lobbyId]);
    }

    public async Task PutUserInLobbyQueue(string lobbyId, Player newPlayerData)
    {
      // First, we create our player
      var newPlayer = new Player
      {
        Id = Context.ConnectionId,
        Name = newPlayerData.Name,
        EarnedPoints = 0
      };

      // Then add it into our dictionary, mapping the player's ConnectionId -> to the lobbyId they are connected to
      playerLobbyMapping.TryAdd(newPlayer.Id, lobbyId);

      // Then add that player's info into our lobby dictionary
      if (playersInLobby.ContainsKey(lobbyId))
      {
        playersInLobby[lobbyId].Add(newPlayer);
      }
      else
      {
        playersInLobby[lobbyId] = new List<Player> { newPlayer };
      }

      // Make sure that the player's ConnectionId is added to the group (lobbyId), so players can receive data as a group
      await Clients.Caller.SendAsync("ReceiveAllPlayers", playersInLobby[lobbyId]);

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
          players.RemoveAll(p => p.Id == playerConnId);

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
      // Reset all game data from current lobby before playing
      ResetAllGameDataFromLobby(lobbyId);

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

      if (!playerResponsesPerQuestion.ContainsKey(questionId))
      {
        playerResponsesPerQuestion[questionId] = new HashSet<string>();
      }

      if (playerResponsesPerQuestion[questionId].Add(playerConnId))
      {
        responseCountPerQuestion[questionId] = playerResponsesPerQuestion[questionId].Count;
        int numberOfPeopleWhoHaveAnsweredTheCurrentQuestionRightNow = responseCountPerQuestion[questionId];

        if (!questionIdsPerLobby.ContainsKey(lobbyId))
        {
          questionIdsPerLobby[lobbyId] = new HashSet<int>();
        }
        questionIdsPerLobby[lobbyId].Add(questionId);

        await Clients.Group(lobbyId).SendAsync("VerifyIfEveryoneHasAnsweredTheCurrentQuestion", numberOfPeopleWhoHaveAnsweredTheCurrentQuestionRightNow);

        await Clients.Group(lobbyId).SendAsync("UpdateTotalOfProvidedAnswersCounter", playerConnId, answerId);
      }
    }

    public async Task SendPlayerFinalStatsToAllPlayers(string lobbyId, List<FinalPlayerStats> playersFinalStats)
    {
      await Clients.OthersInGroup(lobbyId).SendAsync("OnReceivePlayersFinalStats", playersFinalStats);
    }

    public async Task UpdatePlayerInfo(Player updatedPlayerInfo)
    {
      await Clients.Client(updatedPlayerInfo.Id).SendAsync("ReceiveMyUpdatedPlayerInfo", updatedPlayerInfo);
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
      await Clients.OthersInGroup(lobbyId).SendAsync("OnRedirectToSpecificPage", clientPath);
    }

    private void ResetAllGameDataFromLobby(string lobbyId)
    {
      // Clear all players from the lobby
      playersInLobby.TryRemove(lobbyId, out var _);

      // Get all the question IDs from the lobby and remove them
      questionIdsPerLobby.TryGetValue(lobbyId, out var questionIdsFromLobby);
      questionIdsPerLobby.TryRemove(lobbyId, out var _);

      // Remove all the counting for every question ID from the lobby
      if (questionIdsFromLobby != null)
      {
        foreach (var questionId in questionIdsFromLobby)
        {
          responseCountPerQuestion.TryRemove(questionId, out var _);
          playerResponsesPerQuestion.TryRemove(questionId, out var _);
        }
      }

      // Remove any entries from the current question tracking based on the lobbyId
      currentQuestionPerLobby.TryRemove(lobbyId, out var _);

      // Remove all player connections mapped to the lobbyId
      var playersToRemove = playerLobbyMapping
                              .Where(m => m.Value == lobbyId)
                              .Select(m => m.Key)
                              .ToList();

      foreach (var playerConnId in playersToRemove)
      {
        playerLobbyMapping.TryRemove(playerConnId, out var _);
      }
    }
  }

  public class Player
  {
    public string Id { get; set; }
    public string Name { get; set; }
    public int EarnedPoints { get; set; } = 0;
  }

  public class FinalPlayerStats : Player {
    public int place { get; set; }
  }

  public class PlayerNickName {
    public string Name { get; set; }
  }
}
