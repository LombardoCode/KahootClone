import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Button, { ButtonSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { Question } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Modal, { ModalTypes } from "../Modal/Modal";
import { useState } from "react";

interface CreatorSliderOfQuestionsProps {
  className?: string;
}

const CreatorSliderOfQuestions = ({ className }: CreatorSliderOfQuestionsProps) => {
  const { addQuestion, getKahootQuestions } = useKahootCreatorStore();

  return (
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
          onClick={() => addQuestion()}
          className="w-full max-w-sm"
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
  const { setKahootsQuestionIndex, kahootIndex, deleteQuestion } = useKahootCreatorStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    <div className="flex mb-3">
      <div id="slider-item-options" className="self-end mr-1 h-5">
        <FontAwesomeIcon
          icon={faTrashCan}
          size="xs"
          color="#6E6E6E"
          className="px-1 py-1 hover:bg-slate-300 rounded-sm hover:cursor-pointer"
          onClick={() => setIsModalOpen(true)}
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
      <Modal
        modalType={ModalTypes.DELETION}
        isOpen={isModalOpen}
        title={`Delete quiz question`}
        onClose={() => setIsModalOpen(false)}
        bodyContent={(
          <>
            <Text
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.BLACK}
              useCase={UseCases.LONGTEXT}
              className="text-base"
            >
              Are you sure you want to delete this question? This action cannot be undone.
            </Text>
          </>
        )}
        footerContent={(
          <Button
            backgroundColor={BackgroundColors.RED}
            fontWeight={FontWeights.BOLD}
            size={ButtonSize.MEDIUM}
            textColor={TextColors.WHITE}
            className="mr-2"
            onClick={() => {
              setIsModalOpen(false);
              deleteQuestion(question.id)
            }}
          >
            Delete
          </Button>
        )}
      />
    </div>
  )
}

export default CreatorSliderOfQuestions;
