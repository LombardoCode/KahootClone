import { AnswerPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import AnswerStatisticBarIndividual from "./AnswerStatisticBarIndividual";

interface DisplayAnswerStatisticsInBarsModeProps {
  answers: AnswerPlay[] | undefined;
}

const DisplayAnswerStatisticsInBarsMode = ({ answers }: DisplayAnswerStatisticsInBarsModeProps) => {
  const { answerStatsForCurrentQuestion } = useInGameStore();

  return (
    <div className="w-full flex justify-center mt-20">
      <div className="grid grid-cols-4 gap-10 max-w-max">
        {answers?.map((answer: AnswerPlay, index: number) => (
          <AnswerStatisticBarIndividual
            key={index}
            index={index}
            answer={answer}
            numberOfTimesTheAnswerWasUsed={answerStatsForCurrentQuestion?.find(a => a.answerId === answer.id)?.quantityOfTimesSelected}
            isCorrect={answer.isCorrect}
          />
        ))}
      </div>
    </div>
  )
}

export default DisplayAnswerStatisticsInBarsMode;
