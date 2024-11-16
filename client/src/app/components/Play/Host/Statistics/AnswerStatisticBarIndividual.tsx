import Text from "@/app/components/UIComponents/Text";
import IconForKahootAnswer from "@/app/components/utils/Quizes/IconForKahootAnswer";
import { getBackgroundColor } from "@/app/components/utils/Quizes/KahootAnswerFuncs";
import { KahootAnswerBackgroundColors } from "@/app/interfaces/Colors.interface";
import { AnswerPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface AnswerStatisticBarIndividualProps {
  index: number;
  answer: AnswerPlay;
  numberOfTimesTheAnswerWasUsed: number | undefined;
  isCorrect: boolean;
}

const AnswerStatisticBarIndividual = ({ index, answer, numberOfTimesTheAnswerWasUsed, isCorrect }: AnswerStatisticBarIndividualProps) => {
  let backgroundColor: KahootAnswerBackgroundColors | null = getBackgroundColor(index);

  return (
    <div className="answer-1 flex flex-col w-32 rounded-md overflow-hidden">
      {numberOfTimesTheAnswerWasUsed !== undefined && (
        <div className={`answer-correctness-square-panel w-full h-12 ${backgroundColor} ${numberOfTimesTheAnswerWasUsed > 0 ? 'opacity-100' : 'opacity-0'}`}></div>
      )}
      <div className={`answer-count-indicator flex justify-center items-center ${backgroundColor} ${numberOfTimesTheAnswerWasUsed === 0 ? 'rounded-md overflow-hidden' : ''}`}>
        <IconForKahootAnswer index={index} size={20} />

        <div className="answer-count-number">
          <Text
            useCase={UseCases.LONGTEXT}
            textColor={TextColors.WHITE}
            fontWeight={FontWeights.BOLD}
            className="text-lg"
          >
            {numberOfTimesTheAnswerWasUsed}
          </Text>
        </div>

        {isCorrect && (
          <div className="answer-correctness-icon ml-2">
            <FontAwesomeIcon
              icon={faCheck}
              color="white"
              size={"lg"}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AnswerStatisticBarIndividual;
