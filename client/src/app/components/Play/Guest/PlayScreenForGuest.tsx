import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Spinner from "../../UIComponents/Spinners/Spinner";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import KahootAnswerContainer from "../../utils/Quizes/KahootAnswerContainer";
import { AnswerPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import KahootAnswerDisplay from "../../utils/Quizes/KahootAnswerDisplay";
import { getTextContentForLayout } from "../../utils/Quizes/KahootQuestion.utills";

const PlayScreenForGuest = () => {
  return (
    <div className="relative z-10 h-full flex justify-center items-center">
      <ShowAnswersToGuests />
    </div>
  )
}

const ShowAnswersToGuests = () => {
  const { kahoot, questionIndex, didUserProvidedAnAnswerToTheQuestion } = useInGameStore();

  return (
    <div className="w-full flex flex-col h-full">
      <div
        id="gameblock-current-question-number-and-type-of-question-wrapper"
        className="relative w-full my-4"
      >
        <div
          id="gameblock-type-of-question"
          className="flex justify-center"
        >
          <Text
            useCase={UseCases.LONGTEXT}
            textColor={TextColors.GRAY}
            fontWeight={FontWeights.BOLD}
            className="text-md inline-block bg-white px-3 py-2 rounded-full"
          >
            {getTextContentForLayout(kahoot?.questions[questionIndex].layout)}
          </Text>
        </div>

        <div
          id="gameblock-number-of-current-question"
          className="absolute top-0 left-0"
        >
          <Text
            useCase={UseCases.LONGTEXT}
            textColor={TextColors.GRAY}
            fontWeight={FontWeights.BOLD}
            className="text-md inline-block bg-white px-4 py-2 rounded-full"
          >
            {questionIndex + 1}
          </Text>
        </div>
      </div>

      {!didUserProvidedAnAnswerToTheQuestion()
        ? (
          <KahootAnswerContainer>
            {kahoot?.questions[questionIndex].answers.map((answer: AnswerPlay, index: number) => (
              <KahootAnswerDisplay
                key={index}
                index={index}
                answer={answer}
                showText={false}
              />
            ))}
          </KahootAnswerContainer>
        )
        : (
          <>
            <div className="absolute w-full h-screen">
              <div className="flex flex-col items-center justify-center h-full">
                <Spinner className="mb-3 text-white" />

                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.WHITE}
                  useCase={UseCases.LONGTEXT}
                  className="text-2xl"
                >
                  Waiting for other players...
                </Text>
              </div>
            </div>
          </>
        )
      }
    </div>
  )
}

export default PlayScreenForGuest;
