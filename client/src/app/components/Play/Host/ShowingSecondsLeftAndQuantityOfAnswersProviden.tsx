import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { useEffect, useRef, useState } from "react";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";

const ShowingSecondsLeftAndQuantityOfAnswersProviden = () => {
  const { kahoot, questionIndex, countOfAnswersProvidenByGuests, remainingTime, setRemainingTime } = useInGameStore();

  useEffect(() => {
    const timeLimitSetForCurrentQuestion: number | undefined = kahoot?.questions[questionIndex].timeLimit;
    
    if (timeLimitSetForCurrentQuestion !== undefined) {
      setRemainingTime(timeLimitSetForCurrentQuestion);
    }
  }, []);

  useEffect(() => {
    const timerTimeout = setTimeout(() => {
      if (remainingTime > 0) {
        setRemainingTime(remainingTime - 1);
      } else {
        // Time's up
      }
    }, 1000);

    return () => {
      clearInterval(timerTimeout);
    }
  }, [remainingTime]);

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
              {remainingTime}
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
                {countOfAnswersProvidenByGuests}
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

export default ShowingSecondsLeftAndQuantityOfAnswersProviden;
