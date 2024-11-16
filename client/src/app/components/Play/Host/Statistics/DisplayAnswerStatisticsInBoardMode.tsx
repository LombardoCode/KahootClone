import KahootAnswerContainer from "@/app/components/utils/Quizes/KahootAnswerContainer";
import { AnswerPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import ShowKahootAnswerAsFinalStat from "./ShowKahootAnswerAsFinalStat";

interface DisplayAnswerStatisticsInBoardModeProps {
  answers: AnswerPlay[] | undefined;
  className?: string;
}

const DisplayAnswerStatisticsInBoardMode = ({ answers, className = ''
 }: DisplayAnswerStatisticsInBoardModeProps) => {
  return (
    <div className={`${className}`}>
      <KahootAnswerContainer>
        {answers?.map((answer: AnswerPlay, index: number) => (
          <ShowKahootAnswerAsFinalStat
            key={index}
            index={index}
            answer={answer}
          />
        ))}
      </KahootAnswerContainer>
    </div>
  )
}

export default DisplayAnswerStatisticsInBoardMode;
