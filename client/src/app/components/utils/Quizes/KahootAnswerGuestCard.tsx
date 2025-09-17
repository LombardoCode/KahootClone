/**
 * Purpose:
 * This component will show the Kahoot Answer and its going to be rendered
 * on the guests' screens when answering the question. It will only display them:
 * 
 * 1.- The Kahoot Answer Tile (with its unique background color assigned, thanks
 * to the <KahootAnswerBackgroundColorWrapper /> component).
 * 
 * 2.- The icon for the Kahoot Answer tile (thanks to the <IconForKahootAnswer />
 * component)
 */

import KahootAnswerBackgroundColorWrapper from "./KahootAnswerBackgroundColorWrapper";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import IconForKahootAnswer from "./IconForKahootAnswer";

interface KahootAnswerGuestCardProps {
  index: number;
  answerId: number;
  className?: string;
}

const KahootAnswerGuestCard = ({ index, answerId, className }: KahootAnswerGuestCardProps) => {
  const { isHost, selectAnswer } = useInGameStore();

  return (
    <KahootAnswerBackgroundColorWrapper
      colorIndex={index}
      className={`flex justify-center items-center ${className}`}
      onClick={() => {
        if (!isHost) {
          selectAnswer(answerId);
        }
      }}
    >
      <IconForKahootAnswer
        index={index}
        size={48}
        className="py-10 mr-2"
      />
    </KahootAnswerBackgroundColorWrapper>
  )
}

export default KahootAnswerGuestCard;
