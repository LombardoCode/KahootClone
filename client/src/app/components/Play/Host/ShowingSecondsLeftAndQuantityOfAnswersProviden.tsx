import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { useEffect, useRef, useState } from "react";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";

interface ShowingSecondsLeftAndQuantityOfAnswersProvidenProps {
  setEveryoneHasAnsweredTheCurrentQuestion: (status: boolean) => void;
}

const ShowingSecondsLeftAndQuantityOfAnswersProviden = ({ setEveryoneHasAnsweredTheCurrentQuestion }: ShowingSecondsLeftAndQuantityOfAnswersProvidenProps) => {
  const { kahoot, questionIndex, signalRConnection, players, lobbyId, increaseAnswerCountForCurrentQuestion, addPointsToThePlayer } = useInGameStore();
  const [timer, setTimer] = useState<number | undefined>(kahoot?.questions[questionIndex].timeLimit);
  const timerRef = useRef<number | undefined>(timer);
  const [countOfAnswersProvidenByGuests, setCountOfAnswersProvidenByGuests] = useState<number>(0);

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    const setupConnection = async () => {
      await initializeSignalREvents();
    }

    setupConnection();
  }, []);

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

  const initializeSignalREvents = async () => {
    if (signalRConnection) {
      signalRConnection.on('UpdateAnswerStats', (updatedAnswerCount: number) => {
        const totalOfCurrentProvidedAnswers: number = updatedAnswerCount;
        setCountOfAnswersProvidenByGuests(totalOfCurrentProvidedAnswers);

        const totalOfGuestPlayers: number = players.length - 1; // We set it as "-1" because we are excluding the host

        // Check if everyone has answered the current question
        if (totalOfCurrentProvidedAnswers === totalOfGuestPlayers) {
          // Everyone has answered the current question
          setEveryoneHasAnsweredTheCurrentQuestion(true);

          // Redirect the guests to the '/result' page
          signalRConnection.invoke('RedirectGuestsFromLobbyToSpecificPage', lobbyId, '/result');
        }
      })

      signalRConnection.on('UpdateSelectedAnswerCount', (playerConnId: string, selectedAnswerIdFromGuest: number) => {
        // Update the answer statistics for the current question
        increaseAnswerCountForCurrentQuestion(selectedAnswerIdFromGuest);

        // We give the correspondent points to the player who answered the question
        const currentTime = timerRef.current;
        addPointsToThePlayer(playerConnId, selectedAnswerIdFromGuest, currentTime);
      })
    }
  }

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
