import { usePathname, useRouter } from "next/navigation";
import useInGameStore, { FinalPlayerStats } from "../stores/Kahoot/useInGameStore";
import { useEffect } from "react";
import { Player } from "../interfaces/Play/Player.interface";
import { KahootPlay } from "../interfaces/Kahoot/Kahoot.interface";
import { isInLobbyRoute, kickingTheGuest, kickingTheHost } from "../utils/Lobby/lobbyUtils";
import { debugLog } from "../utils/debugLog";
import { HubConnectionState } from "@microsoft/signalr";

const useLobbySocketEvents = () => {
  const { signalRConnection, addPlayer, removePlayer, isHost, lobbyId, setKahoot, setCurrentPlayer, setEarnedPointsFromCurrentQuestion, setQuestionIndex, currentPlayer, setFinalPlayerData, setShowPlayerFinalStats, terminateGameSession } = useInGameStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (signalRConnection === null || isHost === null) {
      return;
    }

    registerSignalREvents(isHost);

    return () => {
      disconnectingSignalREvents();
    }
  }, [signalRConnection, isHost]);

  const registerSignalREvents = (isUserHost: boolean) => {
    if (signalRConnection === null || signalRConnection.state === HubConnectionState.Disconnected) {
      return;
    }

    disconnectingSignalREvents();

    isUserHost
      ? registerSignalREventsForHost()
      : registerSignalREventsForGuest();

    registerSignalREventsForBothHostAndGuestUsers();
  }

  const registerSignalREventsForBothHostAndGuestUsers = () => {
    if (signalRConnection === null || signalRConnection.state === HubConnectionState.Disconnected) {
      return;
    }

    debugLog("%cRegistering SignalR events for both type of users", "color: orange;");

    signalRConnection.on('GameHasStarted', () => {
      router.push('/start');
    });

    signalRConnection.on('OnRoundTransition', (questionIndex: number) => {
      if (!isHost) {
        setQuestionIndex(questionIndex);
        router.push('/getready');
      } else {
        router.push('/gameblock');
      }
    })
  }

  const registerSignalREventsForHost = () => {
    if (signalRConnection === null || signalRConnection.state === HubConnectionState.Disconnected) {
      return;
    }

    debugLog("%cRegistering SignalR events for Host", "color: green;");

    signalRConnection.on('AddNewPlayer', (newPlayer: Player) => {
      addPlayer({
        connectionId: newPlayer.connectionId,
        userId: newPlayer.userId,
        mediaUrl: newPlayer.mediaUrl,
        name: newPlayer.name,
        earnedPoints: newPlayer.earnedPoints
      });
    });

    signalRConnection.on("OnUpdateTotalOfProvidedAnswersForCurrentQuestion", (numberOfPeopleWhoHaveAnsweredTheCurrentQuestionRightNow: number) => {
      const state = useInGameStore.getState();
      state.setCountOfAnswersProvidedByGuests(numberOfPeopleWhoHaveAnsweredTheCurrentQuestionRightNow);

      const totalOfCurrentGuestPlayers: number = state.players.length;

      // Check if everyone has answered the current question
      if (numberOfPeopleWhoHaveAnsweredTheCurrentQuestionRightNow === totalOfCurrentGuestPlayers) {
        // Everyone has answered the current question
        state.setEveryoneHasAnsweredTheCurrentQuestion(true);

        // Redirect the guests to the '/result' page
        signalRConnection?.invoke('RedirectGuestsFromLobbyToSpecificPage', lobbyId, '/result');
      }
    });

    signalRConnection.on("UpdateAnswerBoard", (playerConnId: string, selectedAnswerIdFromGuest: number) => {
      const state = useInGameStore.getState();

      // Update the answer statistics for the current question
      state.increaseAnswerCountForCurrentQuestion(selectedAnswerIdFromGuest);

      // We give the correspondent points to the player who answered the question
      const remainingTime = state.remainingTime;
      state.addPointsToThePlayer(playerConnId, selectedAnswerIdFromGuest, remainingTime);
    });

    signalRConnection.on('PlayerHasLeft', (playerId: string) => {
      removePlayer(playerId);
      const currentPlayers: Player[] = useInGameStore.getState().players;

      if (isHost && currentPlayers.length === 0) {
        // The host is the only user in the game, stop host's connection and redirect the host to the discover page
        if (!isInLobbyRoute(pathname)) {
          terminateGameSession()
            .finally(() => {
              kickingTheHost(pathname, router);
          });
        }
      }
    });
  }

  const registerSignalREventsForGuest = () => {
    if (signalRConnection === null || signalRConnection.state === HubConnectionState.Disconnected) {
      return;
    }

    debugLog("%cRegistering SignalR events for guests", "color: cyan;");

    signalRConnection.on('ReceiveAllQuestionsFromHost', (kahootInfo: KahootPlay) => {
      setKahoot(kahootInfo);
    });

    signalRConnection.on('GuestsAreNotifiedThatQuestionHasStarted', () => {
      router.push('/gameblock');
    });

    signalRConnection.on('OnHostAbandonedTheGame', () => {
      // Stop the connection and redirect the user to "/", no matter if we are at the lobby of if the user is currently playing
      terminateGameSession()
        .finally(() => {
          kickingTheGuest(router);
      });
    });

    signalRConnection.on('ReceiveMyUpdatedPlayerInfo', (myUpdatedPlayerInfo: Player) => {
      setCurrentPlayer(myUpdatedPlayerInfo);
    });

    signalRConnection.on('OnRedirectGuestsToSpecificPage', (clientPath: string) => {
      router.push(clientPath);
    });

    signalRConnection.on('OnReceiveHowManyPointsPlayerEarnedFromCurrentQuestion', (pointsEarnedFromCurrentQuestion: number) => {
      setEarnedPointsFromCurrentQuestion(pointsEarnedFromCurrentQuestion);
    });

    signalRConnection.on('DisconnectPlayer', () => {
      // This SignalR is meant to be executed when the hosts clicks on the user card on the lobby waiting room
      if (isInLobbyRoute(pathname)) {
        terminateGameSession()
          .finally(() => {
            kickingTheGuest(router);
        });
      }
    });

    signalRConnection.on('OnReceivePlayersFinalStats', (playersFinalStats: FinalPlayerStats[]) => {
      if (currentPlayer === null) {
        return;
      }
      
      const individualPlayerFinalStats: FinalPlayerStats | undefined = playersFinalStats.find(p => p.connectionId === currentPlayer.connectionId);

      if (individualPlayerFinalStats !== undefined) {
        setFinalPlayerData(individualPlayerFinalStats);
      }
    });

    signalRConnection.on('OnNotifyOtherPlayersToShowTheirStats', (status: boolean) => {
      setShowPlayerFinalStats(status);
    });
  }

  const disconnectingSignalREvents = () => {
    if (!signalRConnection) {
      return;
    }

    debugLog("Disconnecting SignalR events");

    // Host events
    signalRConnection.off('AddNewPlayer');
    signalRConnection.off('OnUpdateTotalOfProvidedAnswersForCurrentQuestion');
    signalRConnection.off('UpdateAnswerBoard');
    signalRConnection.off('PlayerHasLeft');
    
    // Guest events
    signalRConnection.off('ReceiveAllQuestionsFromHost');
    signalRConnection.off('GuestsAreNotifiedThatQuestionHasStarted');
    signalRConnection.off('OnHostAbandonedTheGame');
    signalRConnection.off('ReceiveMyUpdatedPlayerInfo');
    signalRConnection.off('OnRedirectGuestsToSpecificPage');
    signalRConnection.off('OnReceiveHowManyPointsPlayerEarnedFromCurrentQuestion');
    signalRConnection.off('DisconnectPlayer');
    signalRConnection.off('OnReceivePlayersFinalStats');
    signalRConnection.off('OnNotifyOtherPlayersToShowTheirStats');

    // Host and guest events
    signalRConnection.off('GameHasStarted');
    signalRConnection.off('OnRoundTransition');
  }
}

export default useLobbySocketEvents;
