import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import axiosInstance from "../axiosConfig";
import SoundBank from "@/app/singletons/SoundBank";
import { ROUTES } from "../Routes/routesUtils";

export const isInLobbyRoute = (pathname: string): boolean => {
  return pathname.startsWith('/lobby'); // The URL path for guests to join a lobby is as follows: /lobby/123456
}

export const createLobby = (kahootId: string | null, router: AppRouterInstance) => {
  axiosInstance.post('/lobby/create', { kahootId })
    .then(res => {
      const gamePIN: number = res.data.gamePIN;
      router.push(`/lobby/${gamePIN}`)
    })
    .catch(err => {
      console.error(err);
    })
}

export const kickingTheHost = (pathname: string, router: AppRouterInstance) => {
  // We don't want to kick the host when being at the lobby when there are no players left
  if (!isInLobbyRoute(pathname)) {
    SoundBank.stopInGameBackgroundMusic();
    SoundBank.stopPodiumBackgroundMusic();

    router.push(ROUTES.MENU.DISCOVERY);
  }
}

export const kickingTheGuest = (router: AppRouterInstance) => {
  router.push(ROUTES.ROOT);
}
