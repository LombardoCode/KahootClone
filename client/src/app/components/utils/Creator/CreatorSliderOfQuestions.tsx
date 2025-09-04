import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Button from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { Question } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { getTextContentForLayout } from "../Quizes/KahootQuestion.utills";
import DeleteQuestionModal from "../Modal/reusable/DeleteQuestionModal";
import QuestionLayoutSelectorModal from "../Modal/reusable/QuestionLayoutSelectorModal";

interface CreatorSliderOfQuestionsProps {
  className?: string;
}

const CreatorSliderOfQuestions = ({ className }: CreatorSliderOfQuestionsProps) => {
  const { getKahootQuestions } = useKahootCreatorStore();
  const [isKahootLayoutSelectorModalOpen, setIsKahootLayoutSelectorModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className={`relative ${className} h-full flex flex-col`}>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {getKahootQuestions().map((question: Question, index: number) => (
            <SliderItem
              question={question}
              key={index}
              index={index}
            />
          ))}
        </div>

        <div id="add-question" className="w-full flex justify-center px-2 py-1 ">
          <Button
            backgroundColor={BackgroundColors.BLUE}
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            onClick={() => setIsKahootLayoutSelectorModalOpen(true)}
            className="w-full max-w-sm"
          >
            Add question
          </Button>
        </div>
      </div>

      {/* Layout selector modal */}
      <QuestionLayoutSelectorModal
        isOpen={isKahootLayoutSelectorModalOpen}
        onClose={() => setIsKahootLayoutSelectorModalOpen(false)}
      />
    </>
  )
}

interface SliderItemsProps {
  question: Question;
  index: number;
}

const SliderItem = ({ question, index }: SliderItemsProps) => {
  const { setKahootsQuestionIndex, questionIndex, getQuestionCount } = useKahootCreatorStore();
  const [isDeleteQuestionModalOpen, setIsDeleteQuestionModalOpen] = useState<boolean>(false);

  return (
    <div className="flex mb-3">
      <div id="slider-item-options" className="self-end mr-1 h-5">
        <FontAwesomeIcon
          icon={faTrashCan}
          size="xs"
          color="#6E6E6E"
          className={`px-1 py-1 hover:bg-slate-300 rounded-sm ${getQuestionCount() > 1 ? 'hover:cursor-pointer' : 'hover:cursor-not-allowed'}`}
          onClick={() => {
            if (getQuestionCount() > 1) {
              setIsDeleteQuestionModalOpen(true)
            }
          }}
        />
      </div>
      <div id="slider-item-title-and-box" className="flex-1">
        <div id="slider-item-title" className="mb-1">
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.BLACK}
            useCase={UseCases.LONGTEXT}
            textStyle={TextStyles.NORMAL}
            className="text-sm"
          >
            <span className="mr-2">{index + 1}</span>
            <span>{getTextContentForLayout(question.layout)}</span>
          </Text>
        </div>

        <div
          id="slider-item-box"
          className={`ring-3 rounded-sm h-24 cursor-pointer ${index === questionIndex ? 'ring-blue-500' : 'ring-slate-300 hover:ring-slate-400'}`}
          onClick={() => setKahootsQuestionIndex(index)}
        >
        </div>
      </div>

      <DeleteQuestionModal
        isOpen={isDeleteQuestionModalOpen}
        onClose={() => setIsDeleteQuestionModalOpen(false)}
        question={question}
      />
    </div>
  )
}

export default CreatorSliderOfQuestions;
