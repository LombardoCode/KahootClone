"use client";

import { useEffect, useState } from "react";
import Text from "../components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface";
import useInGameStore from "../stores/Kahoot/useInGameStore";
import { AnswerPlay, QuestionPlay } from "../interfaces/Kahoot/Kahoot.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import useLobbySocketEvents from "../hooks/useLobbySocketEvents";

const ResultPage = () => {
  // Hooks
  useLobbySocketEvents();
  
  // Global store state
  const { kahoot, questionIndex, earnedPointsFromCurrentQuestion, signalRConnection } = useInGameStore();
  
  // Local component state
  const [wasSelectedAnswerCorrect, setWasSelectedAnswerCorrect] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const currentQuestion: QuestionPlay | undefined = kahoot?.questions[questionIndex];
    const selectedAnswer: AnswerPlay | undefined = currentQuestion?.answers.find(a => a.isSelected);
    const correctAnswers: AnswerPlay[] | undefined = currentQuestion?.answers.filter(a => a.isCorrect);

    // Check if the guest selected the correct answer
    if (correctAnswers?.some(correctAnswer => correctAnswer.id === selectedAnswer?.id)) {
      setWasSelectedAnswerCorrect(true);
    }

    const setupConnection = async () => {
      await initializeSignalREvents();
    }
  }, []);

  const initializeSignalREvents = async () => {
    if (signalRConnection) {
      await signalRConnection.on('OnRedirectGuestsToSpecificPage', (clientPath: string) => {
        router.push(clientPath);
      });
    }
  }

  return (
    <div className={`relative bg-creator-classroom bg-center bg-cover bg-no-repeat h-screen overflow-hidden`}>
      <div className={`absolute inset-0 bg-black opacity-25`}></div>
      <div className="relative flex flex-col justify-center items-center z-10 h-full">
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          useCase={UseCases.LONGTEXT}
          className="text-4xl mb-3 text-shadow shadow-black/50"
        >
          {wasSelectedAnswerCorrect
            ? "Correct"
            : "Incorrect"}
        </Text>

        <AnswerCorrectnessIcon
          wasCorrect={wasSelectedAnswerCorrect}
        />

        <div className="px-4 py-3 rounded-md bg-black/50 mt-3">
          <Text
            fontWeight={FontWeights.REGULAR}
            textColor={TextColors.WHITE}
            useCase={UseCases.LONGTEXT}
            className="text-lg"
          >
            {wasSelectedAnswerCorrect
              ? `+ ${earnedPointsFromCurrentQuestion}`
              : "Dig deep on the next one!"}
          </Text>
        </div>
      </div>
    </div>
  )
}

interface AnswerCorrectnessIconProps {
  wasCorrect: boolean;
}

const AnswerCorrectnessIcon = ({ wasCorrect }: AnswerCorrectnessIconProps) => {
  return (
    <div
      id="answer-correctness-icon-outer-border"
      className="w-24 h-24 bg-white rounded-full px-1.5 py-1.5"
    >
      <div
        id="answer-correctness-icon-bg-color"
        className={`rounded-full w-full h-full ${wasCorrect ? 'bg-green-600' : 'bg-red-600'}`}
      >
        <div
          id="answer-correctness-icon-icon"
          className="z-10 w-full h-full flex justify-center items-center"
        >
          {wasCorrect
            ? (
              <FontAwesomeIcon
                icon={faCheck}
                size={"3x"}
                color={"white"}
              />
            )
            : (
              <FontAwesomeIcon
                icon={faXmark}
                size={"3x"}
                color={"white"}
              />
            )}
        </div>
      </div>
    </div>
  )
}

export default ResultPage;
