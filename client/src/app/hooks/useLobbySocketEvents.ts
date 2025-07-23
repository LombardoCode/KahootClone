import { usePathname, useRouter } from "next/navigation";
import useInGameStore from "../stores/Kahoot/useInGameStore";
import { useEffect } from "react";
import { Player } from "../interfaces/Play/Player.interface";
import { KahootPlay } from "../interfaces/Kahoot/Kahoot.interface";
import { isInLobbyRoute } from "../utils/Lobby/lobbyUtils";
import { debugLog } from "../utils/debugLog";

const useLobbySocketEvents = () => {
  const { signalRConnection, addPlayer, removePlayer, isHost, setIsHost, lobbyId, setKahootInfo, setCurrentPlayer, setEarnedPointsFromCurrentQuestion } = useInGameStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!signalRConnection || isHost === null) {
      return;
    }

    registerSignalREvents(isHost);

    return () => {
      disconnectingSignalREvents();
    }
  }, [signalRConnection, isHost]);

  const registerSignalREvents = (isUserHost: boolean) => {
    if (!signalRConnection) {
      return;
    }

    disconnectingSignalREvents();

    isUserHost
      ? registerSignalREventsForHost()
      : registerSignalREventsForGuest();

    registerSignalREventsForBothHostAndGuestUsers();
  }

  const registerSignalREventsForBothHostAndGuestUsers = () => {
    if (!signalRConnection) {
      return;
    }

    debugLog("%cRegistering SignalR events for both type of users", "color: orange;");

    signalRConnection.on('GameHasStarted', () => {
      router.push('/start');
    });
  }

  const registerSignalREventsForHost = () => {
    if (!signalRConnection) {
      return;
    }

    debugLog("%cRegistering SignalR events for Host", "color: green;");

    signalRConnection.on('AddNewPlayer', (newPlayer) => {
      addPlayer({
        connectionId: newPlayer.connectionId,
        userId: newPlayer.userId,
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
        // The host is the only in the lobby, destroy the lobby data and redirect the host to "/"
        signalRConnection.invoke('DestroyLobbyData', lobbyId)
          .then(() => {
            // We don't want to kick the host when being at the lobby when there are no players left
            if (!isInLobbyRoute(pathname)) {signalRConnection.stop();
              router.push('/');
            }
          })
      }
    });
  }

  const registerSignalREventsForGuest = () => {
    if (!signalRConnection) {
      return;
    }

    debugLog("%cRegistering SignalR events for guests", "color: cyan;");

    signalRConnection.on('ReceiveAllQuestionsFromHost', (kahootInfo: KahootPlay) => {
      setKahootInfo(kahootInfo);
    });

    signalRConnection.on('GuestsAreNotifiedThatQuestionHasStarted', () => {
      router.push('/gameblock');
    });

    signalRConnection.on('OnHostAbandonedTheGame', () => {
      // Stop the connection and redirect the user to "/", no matter if we are at the lobby of if the user is currently playing
      signalRConnection.stop();
      router.push('/');
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
        signalRConnection.stop();
        router.push('/');
      }
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

    // Host and guest events
    signalRConnection.off('GameHasStarted');
  }
}

export default useLobbySocketEvents;
