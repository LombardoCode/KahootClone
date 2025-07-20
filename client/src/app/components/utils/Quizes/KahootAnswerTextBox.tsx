import React, { useEffect, useState } from "react";
import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import InputForm, { InputFormTypes } from "../../UIComponents/InputForm";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import KahootAnswerBase from "./KahootAnswerBase";
import { Answer, QuizQuestionLayoutTypes } from "@/app/interfaces/Kahoot/Kahoot.interface";

interface KahootAnswerTextboxProps {
  className?: string;
  answerIndex: number;
  answer: Answer;
}

const KahootAnswerTextBox = ({ className, answerIndex, answer }: KahootAnswerTextboxProps) => {
  // Store
  const { kahoot, kahootIndex, updateAnswerText, updateAnswerCorrectness } = useKahootCreatorStore();
  
  // Local component
  const answerText = kahoot?.questions[kahootIndex].answers[answerIndex].text || "";
  const isTheQuestionTrueOrFalse: boolean = kahoot?.questions[kahootIndex].layout === QuizQuestionLayoutTypes.TRUE_OR_FALSE;

  const handleAnswerTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer = e.target.value;
    updateAnswerText(kahootIndex, answerIndex, newAnswer);
  }

  const handleAnwserCorrectnessChange = (isCorrect: boolean) => {
    updateAnswerCorrectness(kahootIndex, answerIndex, isCorrect);
  }

  return (
    <>
      <KahootAnswerBase
        index={answerIndex}
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
          placeholder={`Add answer ${answerIndex + 1}`}
          onChange={handleAnswerTextChange}
          disabled={isTheQuestionTrueOrFalse}
        />
        
        {answerText.length > 0 && (
          <div
            className="self-center w-14 h-12 border-4 border-white rounded-full group cursor-pointer"
            onClick={() => handleAnwserCorrectnessChange(!answer.isCorrect)}
          >
            <div className={`w-full h-full rounded-full flex justify-center items-center ${answer.isCorrect ? 'bg-green-600' : ''}`}>
              <FontAwesomeIcon
                icon={faCheck}
                size={"lg"}
                color={"white"}
                className={`${!answer.isCorrect ? 'opacity-0 group-hover:opacity-100' : ''}`}
              />
            </div>
          </div>
        )}
      </KahootAnswerBase>
    </>
  )
}

export default KahootAnswerTextBox;
