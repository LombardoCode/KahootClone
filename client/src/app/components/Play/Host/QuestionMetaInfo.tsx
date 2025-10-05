import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { useEffect, useRef, useState } from "react";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { debugLog } from "@/app/utils/debugLog";
import { doesThisQuestionHasAnImage } from "@/app/utils/kahootUtils";

const QuestionMetaInfo = () => {
  const { kahoot, questionIndex, countOfAnswersProvidedByGuests, remainingTime, setRemainingTime, signalRConnection, lobbyId, setEveryoneHasAnsweredTheCurrentQuestion } = useInGameStore();

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
        // Redirect the guests to the '/result' page
        signalRConnection?.invoke('RedirectGuestsFromLobbyToSpecificPage', lobbyId, '/result')
          .then(() => setEveryoneHasAnsweredTheCurrentQuestion(true));
      }
    }, 1000);

    return () => {
      clearInterval(timerTimeout);
    }
  }, [remainingTime]);

  const hasImage = doesThisQuestionHasAnImage(kahoot?.questions[questionIndex].mediaUrl ?? null);

  return (
    <div id="play-container" className="flex-1 px-4">
      <div
        id="play-seconds-left-show-question-media-and-quantity-of-answers-provided"
        className="w-full mt-4 lg:mt-10 h-full flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0"
      >
        {/* Layout for mobile when there's an image */}
        {hasImage ? (
          <div className="flex lg:hidden w-full gap-4">
            {/* Image */}
            <div id="show-question-media" className="flex-1 flex justify-center">
              <img
                src={`${kahoot?.questions[questionIndex].mediaUrl}`}
                crossOrigin="anonymous"
                alt="Question media"
                className="rounded-md shadow-md min-h-48 max-h-48 object-contain"
              />
            </div>

            {/* Timer and Answers on the right */}
            <div className="flex flex-col justify-center items-center gap-3">
              {/* Timer */}
              <div
                id="play-seconds-left-circle"
                className="flex items-center justify-center bg-purple-900 w-20 h-20 rounded-full"
              >
                <Text
                  useCase={UseCases.LONGTEXT}
                  textColor={TextColors.WHITE}
                  fontWeight={FontWeights.BOLD}
                  className="text-3xl"
                >
                  {remainingTime}
                </Text>
              </div>

              {/* Answers */}
              <div
                id="play-answer-quantity-and-text-wrapper"
                className="flex flex-col items-center"
              >
                <div
                  id="play-answers-provided-quantity-circle"
                  className="flex items-center bg-purple-900 px-4 py-2 rounded-full mb-2"
                >
                  <Text
                    useCase={UseCases.LONGTEXT}
                    textColor={TextColors.WHITE}
                    fontWeight={FontWeights.BOLD}
                    className="text-2xl"
                  >
                    {countOfAnswersProvidedByGuests}
                  </Text>
                </div>

                <div
                  id="play-answers-provided-answers-text-circle"
                  className="flex items-center bg-purple-900 px-3 py-1 rounded-full"
                >
                  <Text
                    useCase={UseCases.LONGTEXT}
                    textColor={TextColors.WHITE}
                    fontWeight={FontWeights.BOLD}
                    className="text-lg"
                  >
                    Answers
                  </Text>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Layout for mobile when there's no image */
          <div className="flex lg:hidden w-full justify-around items-center gap-8 h-full">
            <div id="play-seconds-left">
              <div
                id="play-seconds-left-circle"
                className="flex items-center justify-center bg-purple-900 w-24 h-24 sm:w-28 sm:h-28 rounded-full"
              >
                <Text
                  useCase={UseCases.LONGTEXT}
                  textColor={TextColors.WHITE}
                  fontWeight={FontWeights.BOLD}
                  className="text-4xl sm:text-5xl"
                >
                  {remainingTime}
                </Text>
              </div>
            </div>

            <div id="play-answers-provided">
              <div
                id="play-answer-quantity-and-text-wrapper"
                className="flex flex-col items-center"
              >
                <div
                  id="play-answers-provided-quantity-circle"
                  className="flex items-center justify-center bg-purple-900 w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-2"
                >
                  <Text
                    useCase={UseCases.LONGTEXT}
                    textColor={TextColors.WHITE}
                    fontWeight={FontWeights.BOLD}
                    className="text-3xl sm:text-4xl"
                  >
                    {countOfAnswersProvidedByGuests}
                  </Text>
                </div>

                <div
                  id="play-answers-provided-answers-text-circle"
                  className="flex items-center bg-purple-900 px-3 py-1 sm:px-4 rounded-full"
                >
                  <Text
                    useCase={UseCases.LONGTEXT}
                    textColor={TextColors.WHITE}
                    fontWeight={FontWeights.BOLD}
                    className="text-xl sm:text-2xl"
                  >
                    Answers
                  </Text>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop layout */}
        <div
          id="play-seconds-left"
          className="h-full hidden lg:flex flex-1 justify-start items-center"
        >
          <div
            id="play-seconds-left-circle"
            className="flex items-center justify-center bg-purple-900 w-48 h-48 rounded-full"
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

        {hasImage && (
          <div id="show-question-media" className="hidden lg:flex justify-center">
            <img
              src={`${kahoot?.questions[questionIndex].mediaUrl}`}
              crossOrigin="anonymous"
              alt="Question media"
              className="rounded-md shadow-md min-h-96 max-h-96 object-contain mx-auto"
            />
          </div>
        )}

        <div
          id="play-answers-provided"
          className="h-full hidden lg:flex flex-1 justify-end items-center"
        >
          <div
            id="play-answer-quantity-and-text-wrapper"
            className="flex flex-col items-center"
          >
            <div
              id="play-answers-provided-quantity-circle"
              className="flex items-center bg-purple-900 px-5 py-3 rounded-full mb-2"
            >
              <Text
                useCase={UseCases.LONGTEXT}
                textColor={TextColors.WHITE}
                fontWeight={FontWeights.BOLD}
                className="text-4xl"
              >
                {countOfAnswersProvidedByGuests}
              </Text>
            </div>

            <div
              id="play-answers-provided-answers-text-circle"
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

export default QuestionMetaInfo;
