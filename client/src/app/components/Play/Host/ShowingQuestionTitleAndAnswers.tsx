import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { useState } from "react";
import ShowingQuestionTitle from "./ShowingQuestionTitle";
import ShowingSecondsLeftAndQuantityOfAnswersProviden from "./ShowingSecondsLeftAndQuantityOfAnswersProviden";
import ShowTheAnswersToTheGuests from "./ShowTheAnswersToTheGuests";
import ShowCurrentQuestionStatistics from "./Statistics/ShowCurrentQuestionStatistics";

const ShowingQuestionTitleAndAnswers = () => {
  const { kahoot, questionIndex, everyoneHasAnsweredTheCurrentQuestion } = useInGameStore();

  return (
    <div id="showing-question-title-and-answers" className="flex flex-col h-screen mx-10">
      {!everyoneHasAnsweredTheCurrentQuestion
        ? (
          <>
            <ShowingQuestionTitle questionTitle={kahoot?.questions[questionIndex].title} />
            
            <ShowingSecondsLeftAndQuantityOfAnswersProviden />

            <ShowTheAnswersToTheGuests kahoot={kahoot} questionIndex={questionIndex} />
          </>
        )
        : (<ShowCurrentQuestionStatistics
            questionTitle={kahoot?.questions[questionIndex].title}
          />)
      }
    </div>
  )
}

export default ShowingQuestionTitleAndAnswers;
