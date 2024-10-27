import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import KahootAnswerContainer from "../../utils/Quizes/KahootAnswerContainer";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { AnswerPlay, KahootPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import KahootAnswerDisplay from "../../utils/Quizes/KahootAnswerDisplay";
import { useEffect, useState } from "react";

const ShowingQuestionTitleAndAnswers = () => {
  const { kahoot, questionIndex } = useInGameStore();

  return (
    <div id="showing-question-title-and-answers" className="flex flex-col h-screen mx-10">
      <ShowingQuestionTitle questionTitle={kahoot?.questions[questionIndex].title} />

      <ShowingSecondsLeftAndQuantityOfAnswersProviden />

      <ShowingAnswers kahoot={kahoot} questionIndex={questionIndex} />
    </div>
  )
}

interface ShowingQuestionTitleProps {
  questionTitle: string | undefined;
}

const ShowingQuestionTitle = ({ questionTitle }: ShowingQuestionTitleProps) => {
  return (
    <div
      id="play-question-title"
      className="relative w-full flex justify-center"
    >
      <div
        id="question-title-card"
        className="mt-10 bg-white px-5 py-3 rounded-md shadow-md shadow-black/20"
      >
        <Text
          useCase={UseCases.LONGTEXT}
          textColor={TextColors.GRAY}
          fontWeight={FontWeights.BOLD}
          className="text-3xl"
        >
          {questionTitle}
        </Text>
      </div>
    </div>
  )
}

const ShowingSecondsLeftAndQuantityOfAnswersProviden = () => {
  const { kahoot, questionIndex } = useInGameStore();
  const [timer, setTimer] = useState<number | undefined>(kahoot?.questions[questionIndex].timeLimit);

  useEffect(() => {
    const timerTimeout = setTimeout(() => {
      if (timer !== undefined) {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          // Time's up
        }
      }
    }, 1000);

    return () => {
      clearInterval(timerTimeout);
    }
  }, [timer]);

  return (
    <div id="play-container" className="flex-1">
      <div
        id="play-seconds-left-and-quantity-of-answers-providen"
        className="w-full mt-10 h-full flex justify-between"
      >
        <div
          id="play-seconds-left"
          className="h-full flex flex-1 justify-start items-center"
        >
          <div
            id="play-seconds-left-circle"
            className="flex items-center bg-purple-900 px-10 py-12 rounded-full"
          >
            <Text
              useCase={UseCases.LONGTEXT}
              textColor={TextColors.WHITE}
              fontWeight={FontWeights.BOLD}
              className="text-6xl"
            >
              {timer}
            </Text>
          </div>
        </div>

        <div
          id="play-answers-providen"
          className="h-full flex flex-1 justify-end items-center"
        >
          <div
            id="play-answer-quantity-and-text-wrapper"
            className="flex flex-col items-center"
          >
            <div
              id="play-answers-providen-quantity-circle"
              className="flex items-center bg-purple-900 px-5 py-3 rounded-full mb-2"
            >
              <Text
                useCase={UseCases.LONGTEXT}
                textColor={TextColors.WHITE}
                fontWeight={FontWeights.BOLD}
                className="text-4xl"
              >
                0
              </Text>
            </div>

            <div
              id="play-answers-providen-answers-text-circle"
              className="flex items-center bg-purple-900 px-4 py-1 rounded-full"
            >
              <Text
                useCase={UseCases.LONGTEXT}
                textColor={TextColors.WHITE}
                fontWeight={FontWeights.BOLD}
                className="text-2xl"
              >
                Answers
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ShowingAnswersProps {
  kahoot: KahootPlay | null;
  questionIndex: number;
}

const ShowingAnswers = ({ kahoot, questionIndex }: ShowingAnswersProps) => {
  return (
    <div id="play-answers-wrapper" className="mb-10">
      <KahootAnswerContainer>
        {kahoot?.questions[questionIndex].answers.map((answer: AnswerPlay, index: number) => (
          <KahootAnswerDisplay key={index} index={index} answer={answer} />
        ))}
      </KahootAnswerContainer>
    </div>
  )
}

export default ShowingQuestionTitleAndAnswers;
