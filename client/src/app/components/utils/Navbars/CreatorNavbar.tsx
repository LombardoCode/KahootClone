import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Logo, { LogoColors, LogoSize } from "../Logo";
import Button from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import axiosInstance from "@/app/utils/axiosConfig";
import Modal, { ModalTypes } from "../Modal/Modal";
import InputForm, { InputFormTypes } from "../../UIComponents/InputForm";
import { useState } from "react";
import { KahootHeaderInfo } from "@/app/interfaces/Creator/KahootHeaderInfo.interface";
import { useRouter } from "next/navigation";

interface CreatorNavbarProps {
  kahootProps: {
    title: string;
    description: string
  };
}

const CreatorNavbar = ({ kahootProps }: CreatorNavbarProps) => {
  const router = useRouter();
  const { kahoot, isKahootFormDirty } = useKahootCreatorStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [kahootHeaderInfo, setKahootHeaderInfo] = useState<KahootHeaderInfo>({
    title: kahootProps.title,
    description: kahootProps.description
  });

  const handleKahootHeaderFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKahootHeaderInfo({
      ...kahootHeaderInfo,
      [e.target.name]: e.target.value
    });
  }

  const saveDraft = () => {
    axiosInstance.put('/kahootcreator/drafts', {
      id: kahoot?.id,
      title: kahootHeaderInfo.title,
      description: kahootHeaderInfo.description,
      createdAt: kahoot?.createdAt,
      updatedAt: kahoot?.updatedAt,
      questions: kahoot?.questions
    })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
    <>
      <nav id="navigation-creator" className="flex justify-between items-center px-3">
        <div id="creator-page-logo-and-kahoots-title-and-description" className="flex items-center h-14">
          <div
            onClick={() => router.push(`/dashboard`)}
            className="cursor-pointer"
          >
            <Logo
              size={LogoSize.REGULAR}
              color={LogoColors.VIOLET}
            />
          </div>
          <div
            className="ml-4 hover:bg-zinc-300 cursor-pointer px-2 py-3"
            onClick={() => setIsModalOpen(true)}
          >
            <Text
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.BLACK}
              useCase={UseCases.TITLE}
              className="text-xl"
            >
              {kahoot?.title}
            </Text>

            <Text
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.BLACK}
              useCase={UseCases.TITLE}
              textStyle={kahootProps.description ? TextStyles.NORMAL : TextStyles.ITALIC}
              className="text-base"
            >
              {kahoot?.description ? kahoot?.description : 'No description'}
            </Text>
          </div>
        </div>

        <div id="creator-page-save-changes-button">
          {isKahootFormDirty && (
            <Button
              backgroundColor={BackgroundColors.GREEN}
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.WHITE}
              onClick={() => saveDraft()}
            >
              Save changes
            </Button>
          )}
        </div>
      </nav>
      <Modal
        modalType={ModalTypes.INPUT}
        isOpen={isModalOpen}
        title={`Kahoot information`}
        onClose={() => setIsModalOpen(false)}
        content={(
          <>
            <Text
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.BLACK}
              useCase={UseCases.LONGTEXT}
              className="text-base"
            >
              Rename your kahoot&apos;s s title and description
            </Text>
            <div className="flex flex-col">
              <InputForm
                type={InputFormTypes.TEXT}
                textColor={TextColors.BLACK}
                fontWeight={FontWeights.LIGHT}
                name="title"
                id="title"
                placeholder="Your new title"
                className="mt-2"
                value={kahootHeaderInfo.title}
                onChange={handleKahootHeaderFormChange}
              />
              <InputForm
                type={InputFormTypes.TEXT}
                textColor={TextColors.BLACK}
                fontWeight={FontWeights.LIGHT}
                name="description"
                id="description"
                placeholder="Your new description"
                className="mt-2"
                value={kahootHeaderInfo.description}
                onChange={handleKahootHeaderFormChange}
              />
            </div>
          </>
        )}
        confirmText={`Save`}
        onConfirm={() => {
          saveDraft();
          setIsModalOpen(false);
        }}
      />
    </>
  )
}

export default CreatorNavbar;
