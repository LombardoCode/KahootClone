import { AnswerPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { useState } from "react";
import DisplayAnswerStatisticsInBarsMode from "./DisplayAnswerStatisticsInBarsMode";
import DisplayAnswerStatisticsInBoardMode from "./DisplayAnswerStatisticsInBoardMode";
import Button, { BorderColors, ButtonSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "@/app/components/UIComponents/Text";
import DisplayScoreboard from "./DisplayScoreboard";
import ShowingQuestionTitle from "../ShowingQuestionTitle";

enum ScreenForFinalAnswerStatistics {
  STATISTICS,
  SCOREBOARD
}

interface ShowCurrentQuestionStatisticsProps {
  questionTitle: string | undefined;
}

const ShowCurrentQuestionStatistics = ({ questionTitle }: ShowCurrentQuestionStatisticsProps) => {
  const { kahoot, questionIndex } = useInGameStore();
  const [answers, setAnswers] = useState<AnswerPlay[] | undefined>(kahoot?.questions[questionIndex].answers);
  const [screen, setScreen] = useState<ScreenForFinalAnswerStatistics>(ScreenForFinalAnswerStatistics.STATISTICS);

  const setScreenType = () => {
    switch (screen) {
      case ScreenForFinalAnswerStatistics.STATISTICS:
        setScreen(ScreenForFinalAnswerStatistics.SCOREBOARD);
        break;
      case ScreenForFinalAnswerStatistics.SCOREBOARD:
        // Logic to go to the next question
        // ...
        break;
    }
  }

  return (
    <>
      <Button
        className="absolute top-0 right-0 mr-2 z-10"
        backgroundColor={BackgroundColors.WHITE}
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.GRAY}
        animateOnHover={false}
        size={ButtonSize.MEDIUM}
        onClick={() => setScreenType()}
      >
        Next
      </Button>

      {screen === ScreenForFinalAnswerStatistics.STATISTICS && (
        <>
          <ShowingQuestionTitle questionTitle={questionTitle} />

          <DisplayAnswerStatisticsInBarsMode
            answers={answers}
          />

          <DisplayAnswerStatisticsInBoardMode
            answers={answers}
            className="mt-10"
          />
        </>
      )}

      {screen === ScreenForFinalAnswerStatistics.SCOREBOARD && (
        <DisplayScoreboard />
      )}
    </>
  )
}

export default ShowCurrentQuestionStatistics;
