import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Button from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";

interface CreatorSliderOfQuestionsProps {
  className?: string;
}

const CreatorSliderOfQuestions = ({ className }: CreatorSliderOfQuestionsProps) => {
  return (
    <div className={`relative px-3 py-4 ${className}`}>
      <SliderItem />
      <SliderItem />
      <SliderItem />

      <div id="add-question" className="absolute flex justify-center bottom-0 bg-red-300">
        <Button
          backgroundColor={BackgroundColors.BLUE}
          fontWeight={FontWeights.BOLD}
        >
          Add question
        </Button>
      </div>
    </div>
  )
}

const SliderItem = () => {
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
          <span className="mr-2">1</span>
          <span>True or false</span>
        </Text>
      </div>

      <div id="slider-item-box" className="ring-3 ring-blue-500 rounded-sm h-24">

      </div>
    </div>
  )
}

export default CreatorSliderOfQuestions;
