import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Button, { ButtonSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { Question, QuizQuestionLayoutTypes } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Modal, { ModalTypes } from "../Modal/Modal";
import { useEffect, useState } from "react";
import { getTextContentForLayout } from "../Quizes/KahootQuestion.utills";

interface CreatorSliderOfQuestionsProps {
  className?: string;
}

const CreatorSliderOfQuestions = ({ className }: CreatorSliderOfQuestionsProps) => {
  const { addQuestion, getKahootQuestions } = useKahootCreatorStore();
  const [isKahootLayoutSelectorModalOpen, setIsKahootLayoutSelectorModalOpen] = useState<boolean>(false);
  const [hoveredLayout, setHoveredLayout] = useState<QuizQuestionLayoutTypes | null>(QuizQuestionLayoutTypes.CLASSIC);
  const [layoutDescriptor, setLayoutDescriptor] = useState<any>({
    title: "",
    description: "",
    image: ""
  });

  useEffect(() => {
    if (hoveredLayout !== null) {
      generateLayoutDescription(hoveredLayout)
    }
  }, [hoveredLayout])

  const generateLayoutDescription = (hoveredLayout: string): void => {
    switch (hoveredLayout) {
      case QuizQuestionLayoutTypes.CLASSIC:
        setLayoutDescriptor({
          title: "Quiz",
          description: "Give participants several answer alternatives to choose from.",
          image: ""
        })
        break;
      case QuizQuestionLayoutTypes.TRUE_OR_FALSE:
        setLayoutDescriptor({
          title: "True or False",
          description: "Let participants decide if the statement is true or false.",
          image: ""
        })
        break;
      default:
        break;
    }
  }

  const createNewQuestion = (quizQuestionLayoutType: QuizQuestionLayoutTypes) => {
    addQuestion(quizQuestionLayoutType);
    setIsKahootLayoutSelectorModalOpen(false);
  }

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
      <Modal
        modalType={ModalTypes.INPUT}
        isOpen={isKahootLayoutSelectorModalOpen}
        title={`Select the type of question you want to create`}
        onClose={() => setIsKahootLayoutSelectorModalOpen(false)}
        className="w-[700px] max-w-[90vw]"
        bodyContent={(
          <>
            <div
              id="show-layout-modes-and-their-description"
              className="grid grid-cols-12"
            >
              <div
                id="show-layout-modes"
                className="col-span-4"
              >
                <LayoutOption
                  text={'Classic'}
                  onHover={() => setHoveredLayout(QuizQuestionLayoutTypes.CLASSIC)}
                  onClick={() => createNewQuestion(QuizQuestionLayoutTypes.CLASSIC)}
                />
                <LayoutOption
                  text={'True or false'}
                  onHover={() => setHoveredLayout(QuizQuestionLayoutTypes.TRUE_OR_FALSE)}
                  onClick={() => createNewQuestion(QuizQuestionLayoutTypes.TRUE_OR_FALSE)}
                />
              </div>
              <div
                id="layout-description"
                className="col-span-8 px-3"
              >
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-base"
                >
                  {layoutDescriptor.title}
                </Text>

                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-base"
                >
                  {layoutDescriptor.description}
                </Text>

                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-base"
                >
                  {layoutDescriptor.image}
                </Text>
              </div>
            </div>
          </>
        )}
        footerContent={(
          <Button
            backgroundColor={BackgroundColors.GRAY}
            fontWeight={FontWeights.BOLD}
            size={ButtonSize.MEDIUM}
            textColor={TextColors.WHITE}
            className="mr-2"
            animateOnHover={false}
            onClick={() => {
              setIsKahootLayoutSelectorModalOpen(false);
            }}
          >
            Cancel
          </Button>
        )}
      />
    </>
  )
}

interface LayoutOptionProps {
  text: string;
  onHover: () => void;
  onClick: (e: any) => void;
}

const LayoutOption = ({ text, onHover, onClick }: LayoutOptionProps) => {
  return (
    <div
      className="layout-option flex items-center px-3 py-3 hover:bg-slate-400/60 cursor-pointer"
      onMouseEnter={onHover}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faGamepad} className={`${TextColors.GRAY} mr-2`} />
      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.BLACK}
        useCase={UseCases.LONGTEXT}
        className="text-base"
      >
        {text}
      </Text>
    </div>
  )
}

interface SliderItemsProps {
  question: Question;
  index: number;
}

const SliderItem = ({ question, index }: SliderItemsProps) => {
  const { setKahootsQuestionIndex, questionIndex, deleteQuestion } = useKahootCreatorStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
