import Text from "@/app/components/UIComponents/Text";
import Modal, { ModalTypes } from "../Modal";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Button, { ButtonSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { Question } from "@/app/interfaces/Kahoot/Kahoot.interface";

interface DeleteQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
}

const DeleteQuestionModal = ({ isOpen, onClose, question }: DeleteQuestionModalProps) => {
  const { deleteQuestion } = useKahootCreatorStore();

  return (
    <Modal
      modalType={ModalTypes.DELETION}
      isOpen={isOpen}
      title={`Delete quiz question`}
      onClose={() => onClose()}
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
            onClose();
            deleteQuestion(question.id)
          }}
        >
          Delete
        </Button>
      )}
    />
  )
}

export default DeleteQuestionModal;
