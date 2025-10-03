import Text from "@/app/components/UIComponents/Text";
import Modal, { ModalTypes } from "../../Modal";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { QuizQuestionLayoutTypes } from "@/app/interfaces/Kahoot/Kahoot.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import GetQuestionIconBasedOnLayout from "../../../InGame/GetQuestionIconBasedOnLayout";
import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";

interface ChangeQuestionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuestionType {
  layout: QuizQuestionLayoutTypes;
  label: string;
}

const QUESTION_TYPES: QuestionType[] = [
  { layout: QuizQuestionLayoutTypes.CLASSIC, label: "Classic" },
  { layout: QuizQuestionLayoutTypes.TRUE_OR_FALSE, label: "True or False" }
];

const ChangeQuestionTypeModal = ({ isOpen, onClose }: ChangeQuestionTypeModalProps) => {
  const { questionIndex, updateQuestionLayout } = useKahootCreatorStore();

  const handleQuestionTypeChange = (layout: QuizQuestionLayoutTypes) => {
    updateQuestionLayout(questionIndex, layout);
    onClose();
  }

  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
      title="Change question type"
      onClose={() => onClose()}
      className="w-[500px] max-w-[90vw]"
      bodyContent={(
        <div className="grid grid-cols-2 gap-4">
          {QUESTION_TYPES.map((questionType) => (
            <QuestionTypeCard
              key={questionType.layout}
              questionType={questionType}
              onClick={handleQuestionTypeChange}
            />
          ))}
        </div>
      )}
      footerContent={(
        <Button
          backgroundColor={BackgroundColors.GRAY}
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          className="text-sm"
          size={ButtonSize.MEDIUM}
          perspective={PerspectiveSize.MEDIUM}
          animateOnHover={false}
          onClick={() => onClose()}
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
        className="text-base text-center"
      >
        {questionType.label}
      </Text>
    </div>
  );
}

export default ChangeQuestionTypeModal;
