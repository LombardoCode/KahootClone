export interface Kahoot {
  id: string | null;
  title: string;
  description: string;
  mediaUrl?: string | null;
  isPlayable: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  questions: Question[]
}

export interface Question {
  id: number | null;
  title: string;
  layout: QuizQuestionLayoutTypes;
  timeLimit: TimeLimits;
  pointsMultiplier: PointsMultiplier;
  mediaUrl?: string | null;
  hideTitleUntilAnswer: boolean;
  answers: Answer[];
}

export interface Answer {
  id: number | null;
  text: string;
  isCorrect: boolean;
}

export interface KahootPlay {
  kahootId: string;
  title: string;
  questions: QuestionPlay[];
}

export interface QuestionPlay {
  id: number | null;
  title: string;
  layout: QuizQuestionLayoutTypes;
  timeLimit: TimeLimits;
  pointsMultiplier: PointsMultiplier;
  mediaUrl?: string | null;
  answers: AnswerPlay[];
}

export interface AnswerPlay {
  id: number;
  text: string;
  isCorrect: boolean;
  isSelected: boolean;
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
