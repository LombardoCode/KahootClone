import { KahootAnswerBackgroundColors } from "@/app/interfaces/Colors.interface";
import React, { useEffect, useState } from "react";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import InputForm, { InputFormTypes } from "../../UIComponents/InputForm";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import KahootAnswerBase from "./KahootAnswerBase";
import { getBackgroundColor } from "./KahootAnswerFuncs";
import IconForKahootAnswer from "./IconForKahootAnswer";

interface KahootAnswerTextboxProps {
  className?: string;
  index: number;
}

const KahootAnswerTextBox = ({ className, index }: KahootAnswerTextboxProps) => {
  // Store
  const { kahoot, kahootIndex, updateAnswerText, updateAnswerCorrectness } = useKahootCreatorStore();

  // Local component
  const [answerText, setAnswerText] = useState<string>(kahoot?.questions[kahootIndex]?.answers[index]?.text || "");
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);

  useEffect(() => {
    setAnswerText(kahoot?.questions[kahootIndex]?.answers[index]?.text || "");
    setIsAnswerCorrect(kahoot?.questions[kahootIndex]?.answers[index]?.isCorrect || false);
  }, [kahoot, kahootIndex]);

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
    <>
      <KahootAnswerBase
        index={index}
        className={`${className}`}
      >
        <InputForm
          type={InputFormTypes.TEXT}
          textColor={TextColors.WHITE}
          fontWeight={FontWeights.BOLD}
          name="email"
          id="email"
          value={answerText}
          className={`flex- 1 h-24 w-full border-none rounded-none bg-transparent transition-all duration-0 placeholder:text-white/80 ${answerText.length === 0 ? 'italic' : ''}`}
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
      </KahootAnswerBase>
    </>
  )
}

export default KahootAnswerTextBox;
