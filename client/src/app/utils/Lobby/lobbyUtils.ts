import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import axiosInstance from "../axiosConfig";
import SoundBank from "@/app/singletons/SoundBank";
import { ROUTES } from "../Routes/routesUtils";
import { Player } from "@/app/interfaces/Play/Player.interface";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import * as signalR from "@microsoft/signalr";

export const isInLobbyRoute = (pathname: string): boolean => {
  return pathname.startsWith('/lobby'); // The URL path for guests to join a lobby is as follows: /lobby/123456
}

export const createLobby = async (kahootId: string | null, router: AppRouterInstance) => {
  const { setLobbyId, setIsHost } = useInGameStore.getState();

  await axiosInstance.post('/lobby/create', { kahootId })
    .then(async (res) => {
      const gamePIN: string = res.data.gamePIN;
      await getOrCreateSignalRConnection();
      setLobbyId(gamePIN);
      setIsHost(true);
      
      router.push(`/lobby/${gamePIN}`)
    })
    .catch(err => {
      console.error(err);
    })
}

export const validateIfLobbyExists = async (gamePIN: string) => {
  const response = await axiosInstance.post(`/lobby/checkIfValidLobby`, { lobbyId: gamePIN });
  return response;
}

export const kickingTheHost = (pathname: string, router: AppRouterInstance) => {
  // We don't want to kick the host when being at the lobby when there are no players left
  if (!isInLobbyRoute(pathname)) {
    SoundBank.stopInGameBackgroundMusic();
    SoundBank.stopPodiumBackgroundMusic();

    router.push(ROUTES.MENU.DISCOVER);
  }
}

export const kickingTheGuest = (router: AppRouterInstance) => {
  router.push(ROUTES.ROOT);
}

export const createBaseNewPlayer = async (connection: signalR.HubConnection, nickName: string): Promise<Player> => {
  let newPlayer: Player = {
    connectionId: connection.connectionId,
    userId: null,
    mediaUrl: null,
    name: nickName,
    earnedPoints: 0
  };

  return newPlayer;
}

export const getOrCreateSignalRConnection = async(): Promise<signalR.HubConnection> => {
  const { signalRConnection, setSignalRConnection } = useInGameStore.getState();

  if (signalRConnection && signalRConnection.state === signalR.HubConnectionState.Connected) {
    return signalRConnection;
  }

  const connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5000/hubs/lobbyhub')
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  // Save the connection details to our store
  setSignalRConnection(connection);

  // Start the connection
  await startSignalRConnection(connection);

  return connection;
}

const startSignalRConnection = async (connection: signalR.HubConnection) => {
  if (connection === null) {
    return;
  }

  try {
    await connection.start();
  }
  catch (err) {
    console.error("Error establishing the connection: ", err);
  }
}

export const putTheGuestInTheLobbyQueue = async (connection: signalR.HubConnection, lobbyId: string) => {
  const { setLobbyId, setIsHost } = useInGameStore.getState();

  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    const isUserHost: boolean = false;
    setLobbyId(lobbyId);
    setIsHost(isUserHost);
  }
}

export const integrateConnectionIdToTheLobbyGroup = async (connection: signalR.HubConnection, lobbyId: string | null, isUserHost: boolean | null) => {
  if (lobbyId === null || isUserHost === null) {
    return;
  }

  await connection.invoke('IntegrateConnectionIdToTheLobbyGroup', lobbyId.toString(), isUserHost);
}
