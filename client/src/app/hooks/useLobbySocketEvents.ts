import { useRouter } from "next/navigation";
import useInGameStore from "../stores/Kahoot/useInGameStore";
import { useEffect } from "react";

const useLobbySocketEvents = () => {
  const { signalRConnection, removePlayer, isHost, lobbyId } = useInGameStore();
  const router = useRouter();

  useEffect(() => {
    if (!signalRConnection) {
      return;
    }

    setSignalREvents();

    return () => {
      disconnectingSignalREvents();
    }
  }, [])

  const setSignalREvents = () => {
    if (signalRConnection) {
      signalRConnection.on('PlayerHasLeft', (playerId: string) => {
        removePlayer(playerId);

        const currentPlayers = useInGameStore.getState().players;

        if (isHost && currentPlayers.length === 0) {
          router.push('/');
        }
      })

      signalRConnection.on('OnHostAbandonedTheGame', () => {
        router.push('/');
      })
    }
  }

  const disconnectingSignalREvents = () => {
    if (signalRConnection) {
      signalRConnection.off('PlayerHasLeft');
      signalRConnection.off('OnHostAbandonedTheGame');
    }
  }
}

export default useLobbySocketEvents;
