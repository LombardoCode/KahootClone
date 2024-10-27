import { KahootAnswerBackgroundColors } from "@/app/interfaces/Colors.interface";

export const getBackgroundColor = (index: number): KahootAnswerBackgroundColors | null => {
  if (index === 0) {
    return KahootAnswerBackgroundColors.RED;
  } else if (index === 1) {
    return KahootAnswerBackgroundColors.BLUE;
  } else if (index === 2) {
    return KahootAnswerBackgroundColors.YELLOW;
  } else if (index === 3) {
    return KahootAnswerBackgroundColors.GREEN;
  }
  return null;
}
