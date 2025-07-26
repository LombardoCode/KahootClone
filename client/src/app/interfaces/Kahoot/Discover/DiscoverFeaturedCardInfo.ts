import { DiscoverKahootCardInfo } from "./RecentlyPlayedKahoots.interface";

export interface DiscoverFeaturedCardInfo extends DiscoverKahootCardInfo {
  numberOfQuestions: number;
}
