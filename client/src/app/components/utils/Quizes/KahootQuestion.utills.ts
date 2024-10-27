import { PointsMultiplier, QuizQuestionLayoutTypes } from "@/app/interfaces/Kahoot/Kahoot.interface";

const getTextContentForLayout = (layout: QuizQuestionLayoutTypes | undefined): string => {
  switch (layout) {
    case QuizQuestionLayoutTypes.CLASSIC:
      return "Classic";
    case QuizQuestionLayoutTypes.TRUE_OR_FALSE:
      return "True or false";
    default:
      return "Classic";
  }
}

const getTextContentForPoints = (points: PointsMultiplier): string => {
  switch (points) {
    case 0:
      return "No points";
    case 1:
      return "Standard";
    case 2:
      return "Double points";
    default:
      return "Standard";
  }
}

export {
  getTextContentForLayout,
  getTextContentForPoints
};
