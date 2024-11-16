import { AnswerPlay, KahootPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import KahootAnswerContainer from "../../utils/Quizes/KahootAnswerContainer";
import KahootAnswerDisplay from "../../utils/Quizes/KahootAnswerDisplay";

interface ShowTheAnswersToTheGuestsProps {
  kahoot: KahootPlay | null;
  questionIndex: number;
}

const ShowTheAnswersToTheGuests = ({ kahoot, questionIndex }: ShowTheAnswersToTheGuestsProps) => {
  return (
    <div id="play-answers-wrapper" className="mb-10">
      <KahootAnswerContainer>
        {kahoot?.questions[questionIndex].answers.map((answer: AnswerPlay, index: number) => (
          <KahootAnswerDisplay key={index} index={index} answer={answer} />
        ))}
      </KahootAnswerContainer>
    </div>
  )
}

export default ShowTheAnswersToTheGuests;
