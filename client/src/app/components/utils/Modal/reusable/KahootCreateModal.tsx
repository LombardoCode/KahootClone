import Text from "@/app/components/UIComponents/Text"
import Modal, { ModalTypes } from "../Modal"
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface"
import InputForm, { InputFormTypes } from "@/app/components/UIComponents/InputForm"
import Button, { ButtonSize } from "@/app/components/UIComponents/Button"
import { BackgroundColors } from "@/app/interfaces/Colors.interface"
import { useState } from "react"
import axiosInstance from "@/app/utils/axiosConfig"
import { useRouter } from "next/navigation"

interface KahootCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KahootCreateModal = ({ isOpen, onClose }: KahootCreateModalProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    newKahootName: ''
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const createKahoot = () => {
    axiosInstance.post('/kahootcreator/create', { NewKahootName: formData.newKahootName })
      .then(res => {
        router.push(`/creator/${res.data.newKahootId}`);
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
      title={`Create a Kahoot`}
      onClose={() => onClose()}
      bodyContent={(
        <>
          <Text
            fontWeight={FontWeights.REGULAR}
            textColor={TextColors.BLACK}
            useCase={UseCases.LONGTEXT}
            className="text-base"
          >
            Enter the name of your new Kahoot
          </Text>
          <InputForm
            type={InputFormTypes.TEXT}
            textColor={TextColors.BLACK}
            fontWeight={FontWeights.LIGHT}
            name="newKahootName"
            id="newKahootName"
            value={formData.newKahootName}
            onChange={handleFormChange}
          />
        </>
      )}
      footerContent={(
        <>
          <Button
            backgroundColor={BackgroundColors.GREEN}
            fontWeight={FontWeights.BOLD}
            size={ButtonSize.MEDIUM}
            textColor={TextColors.WHITE}
            className="mr-2"
            onClick={() => createKahoot()}
          >
            Create
          </Button>
        </>
      )}
    />
  )
}

export default KahootCreateModal;
