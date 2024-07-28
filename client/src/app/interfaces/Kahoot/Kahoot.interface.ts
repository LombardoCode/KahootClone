export interface Kahoot {
  id: number | null;
  questions: Question[]
}

export interface Question {
  id: number | null;
  title: string;
  layout: QuizQuestionLayoutTypes;
  timeLimit: number;
  pointsMultiplier: PointsMultiplier;
  mediaUrl?: string | null;
  answers: Answer[];
}

export enum QuizQuestionLayoutTypes {
  CLASSIC = "CLASSIC",
  TRUE_OR_FALSE = "TRUE_OR_FALSE"
}

export enum TimeLimits {
  TEN_S = 10,
  TWENTY_S = 20,
  THIRTY_S = 30,
  FOURTY_S = 40,
  FIFTY_S = 50,
  SIXTY_S = 60
}

export enum PointsMultiplier {
  NO_POINTS = 0,
  STANDARD = 1,
  DOUBLE_POINTS = 2
}

export interface Answer {
  id: number | null;
  text: string;
  isCorrect: boolean;
}
