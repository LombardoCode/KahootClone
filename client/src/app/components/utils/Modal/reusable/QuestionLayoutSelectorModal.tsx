import Text from "@/app/components/UIComponents/Text";
import Modal, { ModalTypes } from "../Modal";
import SidebarTab from "../SidebarTab";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Button, { ButtonSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { useEffect, useState } from "react";
import { QuizQuestionLayoutTypes } from "@/app/interfaces/Kahoot/Kahoot.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";

interface QuestionLayoutSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
          <div
            id="show-layout-modes-and-their-description"
            className="grid grid-cols-12"
          >
            <div
              id="show-layout-modes"
              className="col-span-4"
            >
              <SidebarTab
                text={'Classic'}
                onHover={() => setHoveredLayout(QuizQuestionLayoutTypes.CLASSIC)}
                onClick={() => createNewQuestion(QuizQuestionLayoutTypes.CLASSIC)}
              />
              <SidebarTab
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
            onClose();
          }}
        >
          Cancel
        </Button>
      )}
    />
  )
}

export default QuestionLayoutSelectorModal;
