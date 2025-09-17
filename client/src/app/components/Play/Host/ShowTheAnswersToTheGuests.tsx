import { AnswerPlay, KahootPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import KahootAnswerGridWrapper from "../../utils/Quizes/KahootAnswerGridWrapper";
import KahootAnswerHostCard from "../../utils/Quizes/KahootAnswerHostCard";

interface ShowTheAnswersToTheGuestsProps {
  kahoot: KahootPlay | null;
  questionIndex: number;
}

const ShowTheAnswersToTheGuests = ({ kahoot, questionIndex }: ShowTheAnswersToTheGuestsProps) => {
  return (
    <div id="play-answers-wrapper" className="mb-10">
      <KahootAnswerGridWrapper>
        {kahoot?.questions[questionIndex].answers.map((answer: AnswerPlay, index: number) => (
          <KahootAnswerHostCard
            key={index}
            index={index}
            answer={answer}
          />
        ))}
      </KahootAnswerGridWrapper>
    </div>
  )
}

export default ShowTheAnswersToTheGuests;
