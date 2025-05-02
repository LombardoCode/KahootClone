import { useEffect, useRef, useState } from "react";
import ShowingQuestionTypeAndTitle from "./ShowingQuestionTypeAndTitle";
import ShowingQuestionTitleAndProgressBarCountdown from "./ShowingQuestionTitleAndProgressBarCountdown";
import ShowingQuestionTitleAndAnswers from "./ShowingQuestionTitleAndAnswers";
import useInGameStore, { AnswerStatsForCurrentQuestion } from "@/app/stores/Kahoot/useInGameStore";
import { AnswerPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { Player } from "@/app/interfaces/Play/Player.interface";

const PlayScreenForHost = () => {
  // Global store
  const { isHost, signalRConnection, lobbyId, kahoot, questionIndex, setAnswerStatsForCurrentQuestion, players, setEveryoneHasAnsweredTheCurrentQuestion, increaseAnswerCountForCurrentQuestion, addPointsToThePlayer, setCountOfAnswersProvidenByGuests } = useInGameStore();

  // Local component state
  const [showQuestionHeader, setShowQuestionHeader] = useState<boolean>(true);
  const [showQuestionCountdown, setShowQuestionCountdown] = useState<boolean>(false);
  const [showQuestionAndAnswers, setShowQuestionAndAnswers] = useState<boolean>(false);
  const playersRef = useRef<Player[]>(players);

  useEffect(() => {
    if (signalRConnection) {
      const currentQuestionId: number | null | undefined = kahoot?.questions[questionIndex].id;
      if (currentQuestionId) {
        signalRConnection.invoke('SetCurrentQuestionIdForLobby', lobbyId, currentQuestionId);
      }
    }

    const questionHeaderTimer = setTimeout(() => {
      setShowQuestionHeader(true);
      setShowQuestionCountdown(true);
    }, 2000);

    const showQuestionAndAnswersTimer = setTimeout(() => {
      setShowQuestionHeader(false);
      setShowQuestionCountdown(false);

      if (signalRConnection) {
        signalRConnection.invoke('NotifyGuestsThatTheQuestionHasStarted', lobbyId)
          .then(() => {
            setShowQuestionAndAnswers(true);
          });
      }
    }, 6000);

    initializeAnswerStatsForCurrentQuestion();

    return () => {
      clearInterval(questionHeaderTimer);
      clearInterval(showQuestionAndAnswersTimer);
    }
  }, []);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  useEffect(() => {
    const setupConnection = async () => {
      await initializeSignalREvents();
    }

    setupConnection();
  }, []);

  const OnUpdateTotalOfProvidedAnswersForCurrentQuestionHandler = (numberOfPeopleWhoHaveAnsweredTheCurrentQuestionRightNow: number) => {
    setCountOfAnswersProvidenByGuests(numberOfPeopleWhoHaveAnsweredTheCurrentQuestionRightNow);

    const totalOfCurrentGuestPlayers: number = playersRef.current.length;

    // Check if everyone has answered the current question
    if (numberOfPeopleWhoHaveAnsweredTheCurrentQuestionRightNow === totalOfCurrentGuestPlayers) {
      // Everyone has answered the current question
      setEveryoneHasAnsweredTheCurrentQuestion(true);

      // Redirect the guests to the '/result' page
      signalRConnection?.invoke('RedirectGuestsFromLobbyToSpecificPage', lobbyId, '/result');
    }
  }

  const updateAnswerBoardHandler = (playerConnId: string, selectedAnswerIdFromGuest: number) => {
    // Update the answer statistics for the current question
    increaseAnswerCountForCurrentQuestion(selectedAnswerIdFromGuest);

    // We give the correspondent points to the player who answered the question
    // const currentTime = timerRef.current;
    const currentTime = 30;
    addPointsToThePlayer(playerConnId, selectedAnswerIdFromGuest, currentTime);
  }

  const initializeSignalREvents = async () => {
    if (signalRConnection) {
      signalRConnection.on("OnUpdateTotalOfProvidedAnswersForCurrentQuestion", OnUpdateTotalOfProvidedAnswersForCurrentQuestionHandler);
      signalRConnection.on("updateAnswerBoard", updateAnswerBoardHandler);
    }
  }

  const initializeAnswerStatsForCurrentQuestion = () => {
    const answersOfCurrentQuestion: AnswerPlay[] | undefined = kahoot?.questions[questionIndex].answers;
    let answerStatsForCurrentQuestion: AnswerStatsForCurrentQuestion[] = [];

    answersOfCurrentQuestion?.map((answer: AnswerPlay, index: number) => {
      answerStatsForCurrentQuestion.push({
        answerId: answer.id,
        isCorrect: answer.isCorrect,
        quantityOfTimesSelected: 0
      });
    });

    setAnswerStatsForCurrentQuestion(answerStatsForCurrentQuestion);
  }

  return (
    <div className="w-full">
      {showQuestionHeader && (
        <ShowingQuestionTypeAndTitle
          showQuestionCountdown={showQuestionCountdown}
        />
      )}

      {showQuestionCountdown && (
        <ShowingQuestionTitleAndProgressBarCountdown />
      )}

      {showQuestionAndAnswers && isHost && (
        <ShowingQuestionTitleAndAnswers />
      )}
    </div>
  )
}

export default PlayScreenForHost;
