import KahootAnswerGridWrapper from "@/app/components/utils/Quizes/KahootAnswerGridWrapper";
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
      <KahootAnswerGridWrapper>
        {answers?.map((answer: AnswerPlay, index: number) => (
          <ShowKahootAnswerAsFinalStat
            key={index}
            index={index}
            answer={answer}
          />
        ))}
      </KahootAnswerGridWrapper>
    </div>
  )
}

export default DisplayAnswerStatisticsInBoardMode;
