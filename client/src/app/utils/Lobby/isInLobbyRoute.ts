export const isInLobbyRoute = (pathname: string): boolean => {
  return pathname.startsWith('/lobby'); // The URL path for guests to join a lobby is as follows: /lobby/123456
}
