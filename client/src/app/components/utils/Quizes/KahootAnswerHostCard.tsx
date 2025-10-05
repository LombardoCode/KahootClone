/**
 * Purpose:
 * This component will show the Kahoot Answer and its going to be rendered
 * on the host's screen when showing the answers to the guests during gameplay time.
 * 
 * It will only display them:
 * 
 * 1.- The Kahoot Answer Tile (with its unique background color assigned, thanks
 * to the <KahootAnswerBackgroundColorWrapper /> component).
 * 
 * 2.- The icon for the Kahoot Answer tile (thanks to the <IconForKahootAnswer /> component)
 * 
 * 3.- The answer's text.
 */

import KahootAnswerBackgroundColorWrapper from "./KahootAnswerBackgroundColorWrapper";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import IconForKahootAnswer from "./IconForKahootAnswer";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { AnswerPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";

interface KahootAnswerHostCardProps {
  index: number;
  answer: AnswerPlay;
  className?: string;
}

const KahootAnswerHostCard = ({ index, answer, className }: KahootAnswerHostCardProps) => {
  const { isHost, selectAnswer } = useInGameStore();

  return (
    <KahootAnswerBackgroundColorWrapper
      colorIndex={index}
      className={`flex items-center overflow-hidden ${className}`}
      onClick={() => {
        if (!isHost) {
          selectAnswer(answer.id);
        }
      }}
    >
      <div>
        {/* Mobile */}
        <IconForKahootAnswer
          index={index}
          size={12}
          className="block md:hidden py-2"
        />

        {/* Tablets */}
        <IconForKahootAnswer
          index={index}
          size={25}
          className="hidden md:block xl:hidden py-10 mr-2"
        />

        {/* Desktop */}
        <IconForKahootAnswer
          index={index}
          size={48}
          className="hidden xl:block py-10 mr-2"
        />
      </div>

      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.WHITE}
        useCase={UseCases.LONGTEXT}
        className="text-sm sm:text-lg lg:text-xl text-center py-3 sm:py-4"
      >
        {answer.text}
      </Text>
    </KahootAnswerBackgroundColorWrapper>
  )
}

export default KahootAnswerHostCard;
