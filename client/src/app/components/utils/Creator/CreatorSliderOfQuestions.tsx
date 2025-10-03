import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Button, { ButtonSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { Question } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
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
      <div className={`fixed xl:relative bottom-0 left-0 right-0 xl:w-48 h-[4.6rem] xl:h-full flex flex-row justify-between xl:flex-col bg-yellow-700 z-10 ${className}`}>
        <div className="flex-1 flex flex-row xl:flex-col overflow-x-auto xl:overflow-x-hidden xl:overflow-y-auto px-3 py-2 xl:py-4 bg-cyan-300">
          {getKahootQuestions().map((question: Question, index: number) => (
            <SliderItem
              question={question}
              key={index}
              index={index}
            />
          ))}
        </div>

        <div id="add-question" className="xl:w-full flex justify-center px-2 py-1 bg-purple-500">
          <Button
            backgroundColor={BackgroundColors.BLUE}
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            onClick={() => setIsKahootLayoutSelectorModalOpen(true)}
            size={ButtonSize.NO_SIZE}
            className="w-full max-w-sm px-3 xl:px-5 xl:py-3"
          >
            <span className="hidden xl:block">Add question</span>

            <span className="block xl:hidden">
              <FontAwesomeIcon icon={faPlus} size="lg" />
            </span>
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
    <div className="flex mr-5 xl:mr-0 xl:mb-3">
      <div id="slider-item-options" className="hidden xl:block self-end mr-1 h-5">
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
      <div id="slider-item-title-and-box" className="flex-1 flex flex-row items-start xl:flex-col">
        <div id="slider-item-title" className="flex items-center mb-1 select-none">
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.BLACK}
            useCase={UseCases.LONGTEXT}
            textStyle={TextStyles.NORMAL}
            className="text-sm"
          >
            <span className="mr-2">{index + 1}</span>
          </Text>

          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.BLACK}
            useCase={UseCases.LONGTEXT}
            textStyle={TextStyles.NORMAL}
            className="hidden xl:block text-sm"
          >
            <span>{getTextContentForLayout(question.layout)}</span>
          </Text>
        </div>

        <div
          id="slider-item-box"
          className={`ring-3 rounded-sm w-20 xl:w-36 h-14 xl:h-24 cursor-pointer ${index === questionIndex ? 'ring-blue-500' : 'ring-slate-300 hover:ring-slate-400'}`}
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
