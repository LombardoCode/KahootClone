export interface Player {
  connectionId: string | null | undefined;
  userId: string | null;
  mediaUrl: string | null;
  name: string;
  earnedPoints: number;
};
