import { AnswerPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { useState } from "react";
import DisplayAnswerStatisticsInBarsMode from "./DisplayAnswerStatisticsInBarsMode";
import DisplayAnswerStatisticsInBoardMode from "./DisplayAnswerStatisticsInBoardMode";
import Button, { ButtonSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import DisplayScoreboard from "./DisplayScoreboard";
import ShowingQuestionTitle from "../ShowingQuestionTitle";
import { useRouter } from "next/navigation";

enum ScreenForFinalAnswerStatistics {
  STATISTICS,
  SCOREBOARD
}

interface ShowCurrentQuestionStatisticsProps {
  questionTitle: string | undefined;
}

const ShowCurrentQuestionStatistics = ({ questionTitle }: ShowCurrentQuestionStatisticsProps) => {
  const { kahoot, questionIndex, isHost, isThisTheLastQuestion, goToTheNextQuestion, signalRConnection, lobbyId, setEveryoneHasAnsweredTheCurrentQuestion, setCountOfAnswersProvidenByGuests } = useInGameStore();
  const [answers, setAnswers] = useState<AnswerPlay[] | undefined>(kahoot?.questions[questionIndex].answers);
  const [screen, setScreen] = useState<ScreenForFinalAnswerStatistics>(ScreenForFinalAnswerStatistics.STATISTICS);
  const router = useRouter();

  const setScreenType = () => {
    switch (screen) {
      case ScreenForFinalAnswerStatistics.STATISTICS:
        setScreen(ScreenForFinalAnswerStatistics.SCOREBOARD);
        
        break;
      case ScreenForFinalAnswerStatistics.SCOREBOARD:
        // Go to the next question or end the game
        isThisTheLastQuestion()
          ? endTheGame()
          : continueTheGame()

        break;
    }
  }

  const continueTheGame = () => {
    goToTheNextQuestion();
    setEveryoneHasAnsweredTheCurrentQuestion(false);
    setCountOfAnswersProvidenByGuests(0);
  }
  
  const endTheGame = () => {
    if (isHost) {
      // Destroy all the data from current lobby
      signalRConnection?.invoke('DestroyLobbyData', lobbyId)
      .then(() => {
        // Redirect the guests to the '/ranking' page
        signalRConnection?.invoke('RedirectGuestsFromLobbyToSpecificPage', lobbyId, '/ranking')
        .then(() => {
          // Redirect the host to the '/gameover' screen
          router.push('/gameover');
        })
      });
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
