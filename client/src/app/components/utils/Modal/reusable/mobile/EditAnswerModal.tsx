import Text from "@/app/components/UIComponents/Text";
import Modal, { ModalTypes } from "../../Modal";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { useState, useEffect } from "react";
import TextAreaForm from "@/app/components/UIComponents/TextAreaForm";
import CheckBox from "@/app/components/UIComponents/CheckBox";
import Label from "@/app/components/UIComponents/Label";

interface EditAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  answerIndex: number;
}

const EditAnswerModal = ({ isOpen, onClose, answerIndex }: EditAnswerModalProps) => {
  // Store state
  const { kahoot, questionIndex, updateAnswerText, updateAnswerCorrectness } = useKahootCreatorStore();

  // Local component state
  const [answerText, setAnswerText] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  useEffect(() => {
    if (kahoot && kahoot.questions[questionIndex]) {
      const answer = kahoot.questions[questionIndex].answers[answerIndex];
      setAnswerText(answer.text || "");
      setIsCorrect(answer.isCorrect);
    }
  }, [kahoot, questionIndex, answerIndex, isOpen]);

  const handleAnswerTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setAnswerText(newText);
  }

  const handleCorrectnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCorrect(e.target.checked);
  }

  const handleSave = () => {
    updateAnswerText(questionIndex, answerIndex, answerText);
    updateAnswerCorrectness(questionIndex, answerIndex, isCorrect);
    onClose();
  }

  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
      title={`Edit answer ${answerIndex + 1}`}
      onClose={() => onClose()}
      className="w-[500px] max-w-[90vw]"
      bodyContent={(
        <div className="flex flex-col gap-4">
          <div>
            <Text
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.GRAY}
              useCase={UseCases.LONGTEXT}
              className="text-sm mb-2"
            >
              Answer text
            </Text>
            <TextAreaForm
              id={`answer-text-${answerIndex}`}
              name={`answer-text-${answerIndex}`}
              textColor={TextColors.GRAY}
              fontWeight={FontWeights.REGULAR}
              value={answerText}
              className="w-full border-2 border-slate-300 rounded-lg p-3 min-h-[100px] [field-sizing:content]"
              placeholder={`Enter answer ${answerIndex + 1}`}
              onChange={handleAnswerTextChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <CheckBox
              id={`answer-correct-${answerIndex}`}
              name={`answer-correct-${answerIndex}`}
              checked={isCorrect}
              onChange={handleCorrectnessChange}
            />
            <Label
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.GRAY}
              htmlFor={`answer-correct-${answerIndex}`}
              className="select-none text-sm cursor-pointer"
            >
              Mark as correct answer
            </Label>
          </div>
        </div>
      )}
      footerContent={(
        <div className="flex gap-2">
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
          <Button
            backgroundColor={BackgroundColors.BLUE}
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            className="text-sm"
            size={ButtonSize.MEDIUM}
            perspective={PerspectiveSize.MEDIUM}
            animateOnHover={false}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      )}
    />
  )
}

export default EditAnswerModal;
