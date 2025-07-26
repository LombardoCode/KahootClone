import { DiscoverKahootCardInfo } from "../RecentlyPlayedKahoots.interface";

export interface DiscoverSubsectionClient {
  title: string;
  kahoots: DiscoverKahootCardInfo[];
}
