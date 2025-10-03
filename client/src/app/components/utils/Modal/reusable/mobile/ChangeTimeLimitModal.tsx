import Text from "@/app/components/UIComponents/Text";
import Modal, { ModalTypes } from "../../Modal";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { TimeLimits } from "@/app/interfaces/Kahoot/Kahoot.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";

interface ChangeTimeLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimeLimit {
  value: TimeLimits;
  label: string;
}

const TIME_LIMITS: TimeLimit[] = [
  { value: TimeLimits.TEN_S, label: "10 seconds" },
  { value: TimeLimits.TWENTY_S, label: "20 seconds" },
  { value: TimeLimits.THIRTY_S, label: "30 seconds" },
  { value: TimeLimits.FOURTY_S, label: "40 seconds" },
  { value: TimeLimits.FIFTY_S, label: "50 seconds" },
  { value: TimeLimits.SIXTY_S, label: "60 seconds" }
];

const ChangeTimeLimitModal = ({ isOpen, onClose }: ChangeTimeLimitModalProps) => {
  const { questionIndex, updateQuestionTimeLimit } = useKahootCreatorStore();

  const handleTimeLimitChange = (value: TimeLimits) => {
    updateQuestionTimeLimit(questionIndex, value);
    onClose();
  }

  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
      title="Change time limit"
      onClose={() => onClose()}
      className="w-[500px] max-w-[90vw]"
      bodyContent={(
        <div className="grid grid-cols-2 gap-4">
          {TIME_LIMITS.map((timeLimit) => (
            <TimeLimitCard
              key={timeLimit.value}
              timeLimit={timeLimit}
              onClick={handleTimeLimitChange}
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

interface TimeLimitCardProps {
  timeLimit: TimeLimit;
  onClick: (value: TimeLimits) => void;
}

const TimeLimitCard = ({ timeLimit, onClick }: TimeLimitCardProps) => {
  return (
    <div
      className="col-span-1 flex flex-col items-center justify-center p-4 bg-white hover:bg-slate-200 rounded-lg border-2 border-slate-300 cursor-pointer transition select-none"
      onClick={() => onClick(timeLimit.value)}
    >
      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.GRAY}
        useCase={UseCases.LONGTEXT}
        className="text-base text-center"
      >
        {timeLimit.label}
      </Text>
    </div>
  );
}

export default ChangeTimeLimitModal;
