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
    <div className={`rounded-md ${answer.isCorrect ? 'opacity-100' : 'opacity-70'} ${backgroundColor}`}>
      <div className={`relative flex items-center min-h-20 sm:min-h-24`}>
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
            size={30}
            className="hidden xl:block py-10 mr-2"
          />
        </div>

        <div className="flex-1 flex items-center py-3 pr-12">
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            useCase={UseCases.LONGTEXT}
            className="text-sm sm:text-base lg:text-xl text-center w-full"
          >
            {answer.text}
          </Text>
        </div>

        <div className="absolute top-2 right-2">
          {answer.isCorrect
            ? (
              <FontAwesomeIcon
                icon={faCheck}
                size={"lg"}
                color="white"
                className="text-base sm:text-lg"
              />
            )
            : (
              <FontAwesomeIcon
                icon={faXmark}
                size={"lg"}
                color="white"
                className="text-base sm:text-lg"
              />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default ShowKahootAnswerAsFinalStat;
