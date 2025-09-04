import Text from "@/app/components/UIComponents/Text";
import Modal, { ModalTypes } from "../Modal";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Button, { ButtonSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import axiosInstance from "@/app/utils/axiosConfig";

interface DeleteKahootModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKahootId: string | null;
  onRefreshKahoots: () => void;
}

const DeleteKahootModal = ({ isOpen, onClose, selectedKahootId, onRefreshKahoots }: DeleteKahootModalProps) => {
  const deleteKahoot = async (kahootIdToDelete: string | null) => {
    await axiosInstance.delete(`/kahoot/delete/${kahootIdToDelete}`)
      .then(() => {
        onRefreshKahoots();
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
      title={`Delete Kahoot`}
      onClose={() => onClose()}
      bodyContent={(
        <>
          <Text
            fontWeight={FontWeights.REGULAR}
            textColor={TextColors.BLACK}
            useCase={UseCases.LONGTEXT}
            className="text-base"
          >
            Are you sure you want to delete this kahoot?
          </Text>
        </>
      )}
      footerContent={(
        <>
          <Button
            backgroundColor={BackgroundColors.RED}
            fontWeight={FontWeights.BOLD}
            size={ButtonSize.MEDIUM}
            textColor={TextColors.WHITE}
            className="mr-2"
            onClick={() => {
              onClose();
              deleteKahoot(selectedKahootId);
            }}
          >
            Delete
          </Button>
        </>
      )}
    />
  )
}

export default DeleteKahootModal;
