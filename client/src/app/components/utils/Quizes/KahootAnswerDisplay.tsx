import KahootAnswerBase from "./KahootAnswerBase";
import { AnswerPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";

interface KahootAnswerDisplayProps {
  index: number;
  answer: AnswerPlay;
  showText?: boolean;
  className?: string;
}

const KahootAnswerDisplay = ({ index, answer, showText = true, className }: KahootAnswerDisplayProps) => {
  const { selectAnswer } = useInGameStore();

  return (
    <KahootAnswerBase
      index={index}
      className={`${className}`}
      isCentered={true}
      onClick={() => selectAnswer(answer.id)}
    >
      {showText && (
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          useCase={UseCases.LONGTEXT}
          className="text-xl text-center py-4"
        >
          {answer.text}
        </Text>
      )}
    </KahootAnswerBase>
  )
}

export default KahootAnswerDisplay;
