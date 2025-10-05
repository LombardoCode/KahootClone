import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";

interface ShowingQuestionTitleProps {
  questionTitle: string | undefined;
}

const ShowingQuestionTitle = ({ questionTitle }: ShowingQuestionTitleProps) => {
  return (
    <div
      id="play-question-title"
      className="relative w-full flex justify-center"
    >
      <div
        id="question-title-card"
        className="mt-10 bg-white px-5 py-3 rounded-md shadow-md shadow-black/20"
      >
        <Text
          useCase={UseCases.LONGTEXT}
          textColor={TextColors.GRAY}
          fontWeight={FontWeights.BOLD}
          className="text-2xl lg:text-3xl text-center"
        >
          {questionTitle}
        </Text>
      </div>
    </div>
  )
}

export default ShowingQuestionTitle;
