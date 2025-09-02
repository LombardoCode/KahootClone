import { useRouter } from "next/navigation";
import useInGameStore from "../stores/Kahoot/useInGameStore";
import { useEffect, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { ROUTES } from "../utils/Routes/routesUtils";
import useUserStore from "../stores/useUserStore";

const useProtectedGameplay = () => {
  const router = useRouter();
  const { signalRConnection, isHost, lobbyId, currentPlayer } = useInGameStore();
  const { user, isUserLoaded } = useUserStore();
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (!isUserLoaded) {
      return;
    }

    const isAuthenticated = user.userName !== null;
    const isConnConnected = signalRConnection !== null && signalRConnection.state === HubConnectionState.Connected;

    const isValid =
      isConnConnected &&
      lobbyId !== null &&
      isHost !== null &&
      (isHost === true || (isHost === false && currentPlayer !== null));

    if (!isValid) {
      const urlFallback = isAuthenticated
        ? ROUTES.MENU.DISCOVER
        : ROUTES.ROOT;
      
      router.push(urlFallback);
      
      return;
    }

    setReady(true);
  }, [isUserLoaded ,user.userName ,signalRConnection ,isHost ,lobbyId ,currentPlayer]);

  return { ready };
}

export default useProtectedGameplay;
