import { useEffect, useState } from "react";
import ShowingQuestionTypeAndTitle from "./ShowingQuestionTypeAndTitle";
import ShowingQuestionTitleAndProgressBarCountdown from "./ShowingQuestionTitleAndProgressBarCountdown";
import ShowingQuestionTitleAndAnswers from "./ShowingQuestionTitleAndAnswers";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";

const PlayScreenForHost = () => {
  // Global store
  const { isHost, signalRConnection, lobbyId } = useInGameStore();

  // Local component state
  const [showQuestionHeader, setShowQuestionHeader] = useState<boolean>(true);
  const [showQuestionCountdown, setShowQuestionCountdown] = useState<boolean>(false);
  const [showQuestionAndAnswers, setShowQuestionAndAnswers] = useState<boolean>(false);

  useEffect(() => {
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

    return () => {
      clearInterval(questionHeaderTimer);
      clearInterval(showQuestionAndAnswersTimer);
    }
  }, []);

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
