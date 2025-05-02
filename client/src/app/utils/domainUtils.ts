export const getDomainName = (): string => {
  return window != undefined ? window.location.host : "";
}
