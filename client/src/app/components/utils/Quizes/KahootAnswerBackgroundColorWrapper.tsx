/**
 * Purpose:
 * This component will determine which background color to assign
 * on the Kahoot Answer tile depending on the colorIndex provided.
 * 
 * For more information on how the color assignment  works, please
 * check the "getBackgroundColor" method:
 * 
 * File: /src/app/components/utils/Quizes/KahootAnswerFuncs.ts
 * Method: getBackgroundColor
 */

import { KahootAnswerBackgroundColors } from "@/app/interfaces/Colors.interface";
import { getBackgroundColor } from "./KahootAnswerFuncs";

interface KahootAnswerBackgroundColorWrapperProps {
  children?: React.ReactNode;
  colorIndex: number;
  onClick?: (e?: any) => void;
  className?: string;
}

const KahootAnswerBackgroundColorWrapper = ({ children, colorIndex: index, onClick, className = '' }: KahootAnswerBackgroundColorWrapperProps) => {
  let backgroundColor: KahootAnswerBackgroundColors | null = getBackgroundColor(index);

  return (
    <div
      id={`kahoot-answer-background-color-wrapper-${index}`}
      className={`px-2 rounded-md flex items-center ${backgroundColor} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default KahootAnswerBackgroundColorWrapper;
