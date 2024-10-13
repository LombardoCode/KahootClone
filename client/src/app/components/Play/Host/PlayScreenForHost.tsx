import { useEffect, useState } from "react";
import ShowingQuestionTypeAndTitle from "./ShowingQuestionTypeAndTitle";
import ShowingQuestionTitleAndProgressBarCountdown from "./ShowingQuestionTitleAndProgressBarCountdown";

const PlayScreenForHost = () => {
  const [showQuestionHeader, setShowQuestionHeader] = useState<boolean>(true);
  const [showQuestionCountdown, setShowQuestionCountdown] = useState<boolean>(false);
  const [showQuestionAndAnswers, setShowQuestionAndAnswers] = useState<boolean>(false);

  useEffect(() => {
    const questionHeaderTimer = setTimeout(() => {
      setShowQuestionHeader(true);
      setShowQuestionCountdown(true);
    }, 2000);

    return () => {
      clearInterval(questionHeaderTimer);
    }
  }, [showQuestionHeader]);

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

      {showQuestionAndAnswers && (
        <div>Showing the question title and the answers</div>
      )}
    </div>
  )
}

export default PlayScreenForHost;
