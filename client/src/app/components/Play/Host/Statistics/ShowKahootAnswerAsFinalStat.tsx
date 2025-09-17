/**
 * Purpose:
 * This component will show a mini answer wrapper containing
 * 1.- The icon.
 * 2.- The answer
 * 3.- And a check-mark if it's correct, otherwise it will show a cross-mark.
 * 
 * This component is meant to be shown after all guests have answered the current question. The opacity of the component will vary if the answer is correct or not. (opacity-100 = correct answer, opacity-70 = incorrect answer).
 */

import Text from "@/app/components/UIComponents/Text";
import IconForKahootAnswer from "@/app/components/utils/Quizes/IconForKahootAnswer";
import { getBackgroundColor } from "@/app/components/utils/Quizes/KahootAnswerFuncs";
import { KahootAnswerBackgroundColors } from "@/app/interfaces/Colors.interface";
import { AnswerPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ShowKahootAnswerAsFinalStatProps {
  index: number;
  answer: AnswerPlay;
}

const ShowKahootAnswerAsFinalStat = ({ index, answer }: ShowKahootAnswerAsFinalStatProps) => {
  const backgroundColor: KahootAnswerBackgroundColors | null = getBackgroundColor(index);

  return (
    <div className={`px-2 rounded-md py-3 ${answer.isCorrect ? 'opacity-100' : 'opacity-70'} ${backgroundColor}`}>
      <div className={`flex justify-between items-center`}>
        <div className="flex items-center">
          <IconForKahootAnswer
            index={index}
            size={30}
          />

          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            useCase={UseCases.LONGTEXT}
            className="text-xl"
          >
            {answer.text}
          </Text>
        </div>

        {answer.isCorrect
          ? (
            <FontAwesomeIcon
              icon={faCheck}
              size={"lg"}
              color="white"
            />
          )
          : (
            <FontAwesomeIcon
              icon={faXmark}
              size={"lg"}
              color="white"
            />
          )
        }
      </div>
    </div>
  )
}

export default ShowKahootAnswerAsFinalStat;
