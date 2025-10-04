import Text from "@/app/components/UIComponents/Text";
import Modal, { ModalTypes } from "../../Modal";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { useEffect, useState } from "react";
import CheckBox from "@/app/components/UIComponents/CheckBox";

interface HideQuestionTextModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HideQuestionTextModal = ({ isOpen, onClose }: HideQuestionTextModalProps) => {
  const { kahoot, questionIndex, updateQuestionHideTitle } = useKahootCreatorStore();
  const [isHideQuestionTitle, setIsHideQuestionTitle] = useState<boolean>(false);

  useEffect(() => {
    if (kahoot && kahoot.questions[questionIndex]) {
      setIsHideQuestionTitle(kahoot.questions[questionIndex].hideTitleUntilAnswer);
    }
  }, [kahoot, questionIndex, isOpen]);

  const handleToggle = () => {
    const newValue = !isHideQuestionTitle;
    setIsHideQuestionTitle(newValue);
    updateQuestionHideTitle(questionIndex, newValue);
  };

  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
      title="Hide question text"
      onClose={() => onClose()}
      className="w-[500px] max-w-[90vw]"
      bodyContent={(
        <div className="py-4">
          <div
            className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition"
            onClick={handleToggle}
          >
            <CheckBox
              id="hide-question-mobile"
              name="hide-question-mobile"
              onChange={handleToggle}
              checked={isHideQuestionTitle}
            />
            <div className="flex-1">
              <Text
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.BLACK}
                useCase={UseCases.LONGTEXT}
                className="text-base mb-1"
              >
                Hide question text until answering
              </Text>
              <Text
                fontWeight={FontWeights.REGULAR}
                textColor={TextColors.GRAY}
                useCase={UseCases.LONGTEXT}
                className="text-sm"
              >
                Show "Question no.#" instead of the actual question text until the time limit expires and players can answer.
              </Text>
            </div>
          </div>
        </div>
      )}
      footerContent={(
        <Button
          backgroundColor={BackgroundColors.BLUE}
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          className="text-sm"
          size={ButtonSize.MEDIUM}
          perspective={PerspectiveSize.MEDIUM}
          animateOnHover={false}
          onClick={() => onClose()}
        >
          Done
        </Button>
      )}
    />
  );
}

export default HideQuestionTextModal;
