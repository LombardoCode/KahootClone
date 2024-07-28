import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Button from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { Question } from "@/app/interfaces/Kahoot/Kahoot.interface";

interface CreatorSliderOfQuestionsProps {
  className?: string;
}

const CreatorSliderOfQuestions = ({ className }: CreatorSliderOfQuestionsProps) => {
  const { addQuestion, getKahootQuestions } = useKahootCreatorStore();

  return (
    <div className={`relative px-3 py-4 ${className}`}>
      {getKahootQuestions().map((question: Question, index: number) => (
        <SliderItem
          question={question}
          key={index}
          index={index}
        />
      ))}

      <div id="add-question" className="absolute flex justify-center bottom-0 bg-red-300">
        <Button
          backgroundColor={BackgroundColors.BLUE}
          fontWeight={FontWeights.BOLD}
          onClick={() => addQuestion()}
        >
          Add question
        </Button>
      </div>
    </div>
  )
}

interface SliderItemsProps {
  question: Question;
  index: number;
}

const SliderItem = ({ question, index }: SliderItemsProps) => {
  const { setKahootsQuestionIndex, kahootIndex } = useKahootCreatorStore();
  const getLayoutName = (): string => {
    switch (question.layout) {
      case "CLASSIC":
        return "Classic";
      case "TRUE_OR_FALSE":
        return "True or false";
      default:
        return "Unknown";
    }
  }

  return (
    <div className="mb-3">
      <div id="slider-item-title" className="mb-1">
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.BLACK}
          useCase={UseCases.LONGTEXT}
          textStyle={TextStyles.NORMAL}
          className="text-sm"
        >
          <span className="mr-2">{index + 1}</span>
          <span>{getLayoutName()}</span>
        </Text>
      </div>

      <div
        id="slider-item-box"
        className={`ring-3 rounded-sm h-24 cursor-pointer ${index === kahootIndex ? 'ring-blue-500' : 'ring-slate-300 hover:ring-slate-400'}`}
        onClick={() => setKahootsQuestionIndex(index)}
      >
      </div>
    </div>
  )
}

export default CreatorSliderOfQuestions;
