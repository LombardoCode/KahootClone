import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import InputForm, { InputFormTypes } from "../../UIComponents/InputForm";
import Text from "../../UIComponents/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import KahootAnswer from "../Quizes/KahootAnswer";
import { KahootAnswerBackgroundColors } from "@/app/interfaces/Colors.interface";
import KahootAnswerContainer from "../Quizes/KahootAnswerContainer";

interface CreatorQuestionModifierProps {
  className?: string;
}

const CreatorQuestionModifier = ({ className }: CreatorQuestionModifierProps) => {
  return (
    <div className={`px-6 py-8 ${className} bg-creator-classroom`}>
      <div id="question-title">
        <InputForm
          id={`question`}
          name={`question`}
          textColor={TextColors.GRAY}
          type={InputFormTypes.TEXT}
          fontWeight={FontWeights.BOLD}
          value={``}
          className="w-full text-center py-3"
          placeholder={`The question goes here`}
        />
      </div>

      <div id="question-file-media" className="relative my-6 mx-auto w-96 py-4">
        <div className="absolute bg-white/50 inset-0 backdrop-blur-md rounded-md"></div>
        <div className="relative">
          <div id="icon-plus" className="flex justify-center px-3 py-3">
            <FontAwesomeIcon
              icon={faPlus}
              className="bg-white px-3 py-3 shadow-md"
              fontSize="24"
            />
          </div>
          <Text
            fontWeight={FontWeights.REGULAR}
            textColor={TextColors.GRAY}
            useCase={UseCases.LONGTEXT}
            textStyle={TextStyles.NORMAL}
            className="text-xl text-center"
          >
            Find and insert media
          </Text>
        </div>
      </div>

      <div id="answers">
        <KahootAnswerContainer>
          <KahootAnswer backgroundColor={KahootAnswerBackgroundColors.RED}>
            First answer
          </KahootAnswer>

          <KahootAnswer backgroundColor={KahootAnswerBackgroundColors.BLUE}>
            Second answer
          </KahootAnswer>

          <KahootAnswer backgroundColor={KahootAnswerBackgroundColors.YELLOW}>
            Third answer
          </KahootAnswer>

          <KahootAnswer backgroundColor={KahootAnswerBackgroundColors.GREEN}>
            Fourth answer
          </KahootAnswer>
        </KahootAnswerContainer>
      </div>
    </div>
  )
}

export default CreatorQuestionModifier;
