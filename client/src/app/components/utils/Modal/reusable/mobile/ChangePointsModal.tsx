import Text from "@/app/components/UIComponents/Text";
import Modal, { ModalTypes } from "../../Modal";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { PointsMultiplier } from "@/app/interfaces/Kahoot/Kahoot.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";

interface ChangePointsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PointsOption {
  value: PointsMultiplier;
  label: string;
}

const POINTS_OPTIONS: PointsOption[] = [
  { value: PointsMultiplier.NO_POINTS, label: "No points" },
  { value: PointsMultiplier.STANDARD, label: "Standard" },
  { value: PointsMultiplier.DOUBLE_POINTS, label: "Double points" }
];

const ChangePointsModal = ({ isOpen, onClose }: ChangePointsModalProps) => {
  const { questionIndex, updateQuestionPoints } = useKahootCreatorStore();

  const handlePointsChange = (value: PointsMultiplier) => {
    updateQuestionPoints(questionIndex, value);
    onClose();
  }

  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
      title="Change points"
      onClose={() => onClose()}
      className="w-[500px] max-w-[90vw]"
      bodyContent={(
        <div className="grid grid-cols-1 gap-4">
          {POINTS_OPTIONS.map((pointsOption) => (
            <PointsCard
              key={pointsOption.value}
              pointsOption={pointsOption}
              onClick={handlePointsChange}
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

interface PointsCardProps {
  pointsOption: PointsOption;
  onClick: (value: PointsMultiplier) => void;
}

const PointsCard = ({ pointsOption, onClick }: PointsCardProps) => {
  return (
    <div
      className="col-span-1 flex flex-col items-center justify-center p-4 bg-white hover:bg-slate-200 rounded-lg border-2 border-slate-300 cursor-pointer transition select-none"
      onClick={() => onClick(pointsOption.value)}
    >
      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.GRAY}
        useCase={UseCases.LONGTEXT}
        className="text-base text-center"
      >
        {pointsOption.label}
      </Text>
    </div>
  );
}

export default ChangePointsModal;
