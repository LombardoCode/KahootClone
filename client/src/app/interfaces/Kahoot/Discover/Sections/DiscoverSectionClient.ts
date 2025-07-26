import { DiscoverSubsectionClient } from "./DiscoverSubsectionClient";

export interface DiscoverSectionClient {
  title: string;
  subsections: DiscoverSubsectionClient[];
}
