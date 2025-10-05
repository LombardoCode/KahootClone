import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import ShowingQuestionTitle from "./ShowingQuestionTitle";
import QuestionMetaInfo from "./QuestionMetaInfo";
import ShowTheAnswersToTheGuests from "./ShowTheAnswersToTheGuests";
import ShowCurrentQuestionStatistics from "./Statistics/ShowCurrentQuestionStatistics";
import { useEffect } from "react";
import SoundBank from "@/app/singletons/SoundBank";

const ShowingQuestionTitleAndAnswers = () => {
  const { kahoot, questionIndex, everyoneHasAnsweredTheCurrentQuestion } = useInGameStore();

  useEffect(() => {
    !everyoneHasAnsweredTheCurrentQuestion
      ? SoundBank.playInGameBackgroundMusic()
      : SoundBank.stopInGameBackgroundMusic()
  }, [everyoneHasAnsweredTheCurrentQuestion]);

  return (
    <div id="showing-question-title-and-answers" className="flex flex-col h-screen mx-4 lg:mx-10 overflow-y-auto">
      {!everyoneHasAnsweredTheCurrentQuestion
        ? (
          <>
            <ShowingQuestionTitle questionTitle={kahoot?.questions[questionIndex].title} />

            <QuestionMetaInfo />

            <ShowTheAnswersToTheGuests kahoot={kahoot} questionIndex={questionIndex} />
          </>
        )
        : (
          <div className="pb-20">
            <ShowCurrentQuestionStatistics
              questionTitle={kahoot?.questions[questionIndex].title}
            />
          </div>
        )
      }
    </div>
  )
}

export default ShowingQuestionTitleAndAnswers;
