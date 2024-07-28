import { KahootAnswerBackgroundColors } from "@/app/interfaces/Colors.interface";
import React, { useEffect, useState } from "react";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import InputForm, { InputFormTypes } from "../../UIComponents/InputForm";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

interface KahootAnswerProps {
  children: React.ReactNode;
  className?: string;
  index: number;
  selectable?: boolean;
}

const KahootAnswer = ({ children = <></>, className, selectable = false, index }: KahootAnswerProps) => {
  const getBackgroundColor = (): KahootAnswerBackgroundColors | null => {
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

  let backgroundColor: KahootAnswerBackgroundColors | null = getBackgroundColor();

  // Store
  const { kahoot, kahootIndex, updateAnswerText, updateAnswerCorrectness } = useKahootCreatorStore();

  // Local component
  const [answerText, setAnswerText] = useState<string>(kahoot?.questions[kahootIndex]?.answers[index]?.text || "");
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);

  useEffect(() => {
    setAnswerText(kahoot?.questions[kahootIndex]?.answers[index]?.text || "");
    setIsAnswerCorrect(kahoot?.questions[kahootIndex]?.answers[index]?.isCorrect || false);
  }, [kahootIndex]);

  const handleAnswerTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer = e.target.value;
    setAnswerText(newAnswer);
    updateAnswerText(kahootIndex, index, newAnswer);
  }

  const handleAnwserCorrectnessChange = (isCorrect: boolean) => {
    setIsAnswerCorrect(isCorrect);
    updateAnswerCorrectness(kahootIndex, index, isCorrect);
  }

  return (
    <div className={`px-2 ${selectable ? `py-10 ${backgroundColor}` : `py-1 ${answerText.length > 0 ? backgroundColor : 'bg-white'}`} rounded-md ${className}`}>
      {selectable
        ? (
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            useCase={UseCases.LONGTEXT}
            textStyle={TextStyles.NORMAL}
          >
            {children}
          </Text>
        )
        : (
          <div className="flex items-stretch">
            <ShapeIconCard
              index={index}
              backgroundColor={backgroundColor}
              userHasProvidedText={answerText.length > 0}
            />
            <InputForm
              type={InputFormTypes.TEXT}
              textColor={answerText.length > 0 ? TextColors.WHITE : TextColors.BLACK}
              fontWeight={FontWeights.BOLD}
              name="email"
              id="email"
              value={answerText}
              className="h-24 w-full border-none rounded-none bg-transparent transition-all duration-0"
              placeholder={`Add answer ${index + 1}`}
              onChange={handleAnswerTextChange}
            />
            {answerText.length > 0 && (
              <div
                className="self-center w-14 h-12 border-4 border-white rounded-full group cursor-pointer"
                onClick={() => handleAnwserCorrectnessChange(!isAnswerCorrect)}
              >
                <div className={`w-full h-full rounded-full flex justify-center items-center ${isAnswerCorrect ? 'bg-green-600' : ''}`}>
                  <FontAwesomeIcon
                    icon={faCheck}
                    size={"lg"}
                    color={"white"}
                    className={`${!isAnswerCorrect ? 'opacity-0 group-hover:opacity-100' : ''}`}
                  />
                </div>
              </div>
            )}
          </div>
        )
      }
    </div>
  )
}

interface ShapeIconCardProps {
  index: number;
  backgroundColor: KahootAnswerBackgroundColors | null;
  userHasProvidedText: boolean;
}

const ShapeIconCard = ({ index, backgroundColor, userHasProvidedText }: ShapeIconCardProps) => {
  return (
    <div className={`shape-icon-answer flex items-center px-2 rounded-md ${userHasProvidedText ? '' : backgroundColor}`}>
      {index === 0 && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M24 22h-24l12-20z" fill="white" />
        </svg>
      )}

      {index === 1 && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" transform="rotate(45 12 12)" fill="white" />
        </svg>
      )}

      {index === 2 && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="white" />
        </svg>
      )}

      {index === 3 && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" fill="white" />
        </svg>
      )}
    </div>
  )
}

export default KahootAnswer;
