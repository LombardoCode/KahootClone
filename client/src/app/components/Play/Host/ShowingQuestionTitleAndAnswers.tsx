import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import ShowingQuestionTitle from "./ShowingQuestionTitle";
import QuestionMetaInfo from "./QuestionMetaInfo";
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

            <QuestionMetaInfo />

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
