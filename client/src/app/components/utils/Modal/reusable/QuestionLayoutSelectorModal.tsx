import Text from "@/app/components/UIComponents/Text";
import Modal, { ModalTypes } from "../Modal";
import SidebarTab from "../SidebarTab";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { useEffect, useState } from "react";
import { QuizQuestionLayoutTypes } from "@/app/interfaces/Kahoot/Kahoot.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import GetQuestionIconBasedOnLayout from "../../InGame/GetQuestionIconBasedOnLayout";

interface QuestionLayoutSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuestionType {
  layout: QuizQuestionLayoutTypes;
  label: string;
  description: string;
}

const QUESTION_TYPES: QuestionType[] = [
  {
    layout: QuizQuestionLayoutTypes.CLASSIC,
    label: "Classic",
    description: "Give participants several answer alternatives to choose from."
  },
  {
    layout: QuizQuestionLayoutTypes.TRUE_OR_FALSE,
    label: "True or False",
    description: "Let participants decide if the statement is true or false."
  }
];

const QuestionLayoutSelectorModal = ({ isOpen, onClose }: QuestionLayoutSelectorModalProps) => {
  // Global state
  const { addQuestion } = useKahootCreatorStore();

  // Local component state
  const [layoutDescriptor, setLayoutDescriptor] = useState<any>({
    title: "",
    description: "",
    image: ""
  });

  const [hoveredLayout, setHoveredLayout] = useState<QuizQuestionLayoutTypes | null>(QuizQuestionLayoutTypes.CLASSIC);

  const createNewQuestion = (quizQuestionLayoutType: QuizQuestionLayoutTypes) => {
    addQuestion(quizQuestionLayoutType);
    onClose();
  }

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

  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
      title={`Select the type of question you want to create`}
      onClose={() => onClose()}
      className="w-[700px] max-w-[90vw]"
      bodyContent={(
        <>
          {/* Mobile: Grid view */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-2 gap-4">
              {QUESTION_TYPES.map((questionType: QuestionType) => (
                <QuestionTypeCard
                  key={questionType.layout}
                  questionType={questionType}
                  onClick={createNewQuestion}
                />
              ))}
            </div>
          </div>

          {/* Desktop: Sidebar + icon with description */}
          <div className="hidden lg:block">
            <div
              id="show-layout-modes-and-their-description"
              className="grid grid-cols-12"
            >
              <div
                id="show-layout-modes"
                className="col-span-4"
              >
                {QUESTION_TYPES.map((questionType: QuestionType) => (
                  <SidebarTab
                    key={questionType.layout}
                    text={questionType.label}
                    selected={hoveredLayout === questionType.layout}
                    onHover={() => setHoveredLayout(questionType.layout)}
                    onClick={() => createNewQuestion(questionType.layout)}
                    icon={
                      <GetQuestionIconBasedOnLayout
                        layout={questionType.layout}
                      />
                    }
                  />
                ))}
              </div>
              <div
                id="layout-description"
                className="col-span-8 px-3 flex flex-col items-center"
              >
                <div className="mb-6 flex items-center justify-center h-24">
                  <GetQuestionIconBasedOnLayout
                    layout={hoveredLayout || QuizQuestionLayoutTypes.CLASSIC}
                  />
                </div>

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
          </div>
        </>
      )}
      footerContent={(
        <Button
          backgroundColor={BackgroundColors.GRAY}
          fontWeight={FontWeights.BOLD}
          size={ButtonSize.MEDIUM}
          perspective={PerspectiveSize.MEDIUM}
          textColor={TextColors.WHITE}
          className="text-sm"
          animateOnHover={false}
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
      )}
    />
  )
}

interface QuestionTypeCardProps {
  questionType: QuestionType;
  onClick: (layout: QuizQuestionLayoutTypes) => void;
}

const QuestionTypeCard = ({ questionType, onClick }: QuestionTypeCardProps) => {
  return (
    <div
      className="col-span-1 flex flex-col items-center justify-center p-6 bg-white hover:bg-slate-200 rounded-lg border-2 border-slate-300 cursor-pointer transition select-none"
      onClick={() => onClick(questionType.layout)}
    >
      <div className="mb-4 flex items-center justify-center h-20">
        <GetQuestionIconBasedOnLayout
          layout={questionType.layout}
        />
      </div>
      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.GRAY}
        useCase={UseCases.LONGTEXT}
        className="text-base text-center mb-2"
      >
        {questionType.label}
      </Text>
      <Text
        fontWeight={FontWeights.REGULAR}
        textColor={TextColors.GRAY}
        useCase={UseCases.LONGTEXT}
        className="text-sm text-center"
      >
        {questionType.description}
      </Text>
    </div>
  );
}

export default QuestionLayoutSelectorModal;
