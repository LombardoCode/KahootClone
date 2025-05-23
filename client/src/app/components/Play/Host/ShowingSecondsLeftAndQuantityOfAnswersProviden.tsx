import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { useEffect, useRef, useState } from "react";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { Player } from "@/app/interfaces/Play/Player.interface";

const ShowingSecondsLeftAndQuantityOfAnswersProviden = () => {
  const { kahoot, questionIndex, signalRConnection, countOfAnswersProvidenByGuests, players, lobbyId, increaseAnswerCountForCurrentQuestion, addPointsToThePlayer } = useInGameStore();
  const [timer, setTimer] = useState<number | undefined>(kahoot?.questions[questionIndex].timeLimit);
  const timerRef = useRef<number | undefined>(timer);

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

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

  const disconnectSignalREvents = () => {
    if (signalRConnection) {
      signalRConnection.off("OnUpdateTotalOfProvidedAnswersForCurrentQuestion");
      signalRConnection.off("updateAnswerBoard");
    }
  }

  useEffect(() => {
    return () => {
      disconnectSignalREvents();
    }
  }, [signalRConnection]);

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
