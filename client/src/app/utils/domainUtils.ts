export const getDomainName = (): string => {
  return window != undefined ? window.location.host : "";
}

export const getServerApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL as string;
}

export enum SignalRServerHubs {
  LOBBY = "lobbyhub"
}

export const getServerHubsUrl = (hub: SignalRServerHubs): string => {
  return `${process.env.NEXT_PUBLIC_HUBS_URL}/${hub}`;
}
