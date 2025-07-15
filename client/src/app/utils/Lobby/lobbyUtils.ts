import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import axiosInstance from "../axiosConfig";

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
