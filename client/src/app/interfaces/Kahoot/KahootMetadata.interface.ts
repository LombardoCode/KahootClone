export interface KahootMetadata {
  kahootId: string;
  title: string;
  description: string;
  mediaUrl: string;
  timesPlayed: number;
  participants: number;
  isPlayable: boolean;
  ownerInfo: {
    userName: string;
    mediaUrl?: string;
    isOwnerOfThisKahoot: boolean;
  }
};
