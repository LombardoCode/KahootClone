import Text from "@/app/components/UIComponents/Text";
import Modal, { ModalTypes } from "../Modal";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/utils/Routes/routesUtils";

interface PasswordWasChangedSuccessfullyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordWasChangedSuccessfullyModal = ({ isOpen, onClose }: PasswordWasChangedSuccessfullyModalProps) => {
  const router = useRouter();

  const goToLogin = () => {
    router.push(ROUTES.AUTH.LOGIN);
  }

  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
      title={`Password changed successfully!`}
      onClose={() => onClose()}
      bodyContent={(
        <>
          <Text
            fontWeight={FontWeights.REGULAR}
            textColor={TextColors.BLACK}
            useCase={UseCases.LONGTEXT}
            className="text-base"
          >
            You can now login with your new password
          </Text>
        </>
      )}
      footerContent={(
        <>
          <Button
            backgroundColor={BackgroundColors.GREEN}
            fontWeight={FontWeights.BOLD}
            size={ButtonSize.MEDIUM}
            textColor={TextColors.WHITE}
            perspective={PerspectiveSize.MEDIUM}
            className="w-full"
            animateOnHover={false}
            onClick={() => goToLogin()}
          >
            Go to login
          </Button>
        </>
      )}
    />
  )
}

export default PasswordWasChangedSuccessfullyModal;
