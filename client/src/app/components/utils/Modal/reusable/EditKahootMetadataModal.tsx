import Text from "@/app/components/UIComponents/Text";
import Modal, { ModalTypes } from "../Modal";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import InputForm, { InputFormTypes } from "@/app/components/UIComponents/InputForm";
import TextAreaForm from "@/app/components/UIComponents/TextAreaForm";
import { KahootVisibilityOption } from "@/app/interfaces/Creator/KahootVisibilityOption.enum";
import RadioButton, { RadioButtonSize } from "@/app/components/UIComponents/RadioButton";
import MediaSelector from "../../Media/MediaSelector";
import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { useEffect, useState } from "react";
import { KahootHeaderInfo } from "@/app/interfaces/Creator/KahootHeaderInfo.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { saveKahootDraft } from "@/app/utils/KahootCreator/kahootCreatorUtils";
import ImageSelectorModal, { ExternalImagePictureQuality } from "./ImageSelectorModal";
import BulletPointErrorsDisplayer from "../../ErrorHandlers/BulletPointErrorsDisplayer";

interface EditKahootMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditKahootMetadataModal = ({ isOpen, onClose }: EditKahootMetadataModalProps) => {
  // Global store
  const { kahoot, resetIsKahootFormDirty, getKahootPlayabilityStatus, updateTitleAndDescription, updateKahootMediaUrl, removeKahootMediaUrl, updateKahootVisibilityOption } = useKahootCreatorStore();

  // Local component state
  const [selectedVisibilityOption, setSelectedVisibilityOption] = useState<KahootVisibilityOption>(KahootVisibilityOption.PRIVATE);
  
  const doesThisKahootHasAnImage: boolean = kahoot?.mediaUrl !== null;

  const [kahootHeaderInfo, setKahootHeaderInfo] = useState<KahootHeaderInfo>({
    title: kahoot?.title || "",
    description: kahoot?.description || ""
  });

  const [titleIsEmpty, setTitleIsEmpty] = useState<boolean>(kahootHeaderInfo.title.trim() === "");

  // Modal: ImageSelectorModal
  const [isImageSelectorModalOpen, setIsImageSelectorModalOpen] = useState<boolean>(false);

  const handleKahootHeaderFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "title" && titleIsEmpty === true) {
      setTitleIsEmpty(false);
    }

    setKahootHeaderInfo({
      ...kahootHeaderInfo,
      [e.target.name]: e.target.value
    });
  }

  const saveDraft = () => {
    const title = kahootHeaderInfo?.title.trim();
    const description = kahootHeaderInfo?.description.trim();

    if (title === "") {
      setTitleIsEmpty(true);
      return;
    }

    updateTitleAndDescription({ title, description });

    if (kahoot) {
      saveKahootDraft(kahoot, resetIsKahootFormDirty)
        .then(() => {
          getKahootPlayabilityStatus();
          onClose();
        })
    }
  }

  const changeVisibilityOptionHandler = (visibilityOption: KahootVisibilityOption) => {
    setSelectedVisibilityOption(visibilityOption);
    updateKahootVisibilityOption(visibilityOption);
  }

  useEffect(() => {
    if (kahoot) {
      setKahootHeaderInfo({
        title: kahoot.title,
        description: kahoot.description
      });

      const kahootVisibilityOption = kahoot.isPublic
        ? KahootVisibilityOption.PUBLIC
        : KahootVisibilityOption.PRIVATE

      setSelectedVisibilityOption(kahootVisibilityOption);
    }
  }, [kahoot]);

  return (
    <>
      <Modal
        modalType={ModalTypes.INPUT}
        isOpen={isOpen}
        title={`Kahoot information`}
        onClose={() => onClose()}
        className="w-[1000px] max-w-[90vw] min-h-[80vh]"
        bodyContent={(
          <div
            id="modal-to-display-basic-information-about-kahoot"
            className="grid grid-cols-12 gap-10"
          >
            <div className="col-span-12 xl:col-span-7">
              <div id="basic-info-title" className="mb-4">
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Title
                </Text>

                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Enter a title for your kahoot.
                </Text>

                <InputForm
                  type={InputFormTypes.TEXT}
                  textColor={TextColors.BLACK}
                  fontWeight={FontWeights.LIGHT}
                  name="title"
                  id="title"
                  placeholder="Your new title"
                  className="w-full py-2 mt-2"
                  value={kahootHeaderInfo.title}
                  onChange={handleKahootHeaderFormChange}
                />

                {titleIsEmpty && (
                  <BulletPointErrorsDisplayer errors={["Title must not be empty."]} />
                )}
              </div>

              <div id="basic-info-description" className="mb-4">
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Description
                </Text>

                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Provide a short description for your kahoot to increase visibility.
                </Text>

                <TextAreaForm
                  rows={4}
                  textColor={TextColors.BLACK}
                  fontWeight={FontWeights.LIGHT}
                  name="description"
                  id="description"
                  placeholder="Your new description"
                  className="w-full py-2 mt-2"
                  value={kahootHeaderInfo.description}
                  onChange={handleKahootHeaderFormChange}
                />
              </div>

              <div id="basic-info-cover-visibility" className="mb-4">
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Visibility
                </Text>

                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Choose who can see this kahoot.
                </Text>

                <div id="basic-info-cover-visibility-radio-buttons">
                  <div
                    id="basic-info-cover-visibility-radio-buttons-private"
                    className="flex items-center mt-4 cursor-pointer"
                    onClick={() => changeVisibilityOptionHandler(KahootVisibilityOption.PRIVATE)}
                  >
                    <RadioButton
                      id="private"
                      name="kahoot-visibility"
                      size={RadioButtonSize.MEDIUM}
                      checked={selectedVisibilityOption === KahootVisibilityOption.PRIVATE}
                      className="mx-5"
                    />
                    <div>
                      <Text
                        fontWeight={FontWeights.REGULAR}
                        textColor={TextColors.BLACK}
                        useCase={UseCases.LONGTEXT}
                        className="text-sm mb-1"
                      >
                        Private
                      </Text>
                      <Text
                        fontWeight={FontWeights.REGULAR}
                        textColor={TextColors.GRAY}
                        useCase={UseCases.LONGTEXT}
                        className="text-sm mb-1"
                      >
                        Only visible to you
                      </Text>
                    </div>
                  </div>

                  <div
                    id="basic-info-cover-visibility-radio-buttons-public"
                    className="flex items-center mt-4 cursor-pointer"
                    onClick={() => changeVisibilityOptionHandler(KahootVisibilityOption.PUBLIC)}
                  >
                    <RadioButton
                      id="public"
                      name="kahoot-visibility"
                      size={RadioButtonSize.MEDIUM}
                      checked={selectedVisibilityOption === KahootVisibilityOption.PUBLIC}
                      className="mx-5"
                    />
                    <div>
                      <Text
                        fontWeight={FontWeights.REGULAR}
                        textColor={TextColors.BLACK}
                        useCase={UseCases.LONGTEXT}
                        className="text-sm mb-1"
                      >
                        Public
                      </Text>
                      <Text
                        fontWeight={FontWeights.REGULAR}
                        textColor={TextColors.GRAY}
                        useCase={UseCases.LONGTEXT}
                        className="text-sm mb-1"
                      >
                        Visible to everyone on the Discover page.
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 xl:col-span-5">
              <div id="basic-info-cover-image" className="mb-4">
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Cover image
                </Text>

                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Add a cover image to make your kahoot stand out.
                </Text>

                <MediaSelector
                  doesItContainsAnImage={doesThisKahootHasAnImage}
                  imageSrc={kahoot?.mediaUrl ?? ""}
                  removeImageActions={removeKahootMediaUrl}
                  clickedOnTheEmptyImage={(open) => setIsImageSelectorModalOpen(open)}
                />
              </div>
            </div>
          </div>
        )}
        footerContent={(
          <>
            <Button
              backgroundColor={BackgroundColors.GRAY}
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.WHITE}
              className="text-sm mr-2"
              size={ButtonSize.MEDIUM}
              perspective={PerspectiveSize.MEDIUM}
              animateOnHover={false}
              onClick={() => {
                onClose();
              }}
            >
              Close
            </Button>

            <Button
              backgroundColor={BackgroundColors.BLUE}
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.WHITE}
              className="text-sm"
              size={ButtonSize.MEDIUM}
              perspective={PerspectiveSize.MEDIUM}
              animateOnHover={false}
              onClick={() => {
                saveDraft();
              }}
            >
              Save
            </Button>
          </>
        )}
      />

      {/* ImageSelectorModal */}
      <ImageSelectorModal
        isOpen={isImageSelectorModalOpen}
        onClose={() => setIsImageSelectorModalOpen(false)}
        pictureQuality={ExternalImagePictureQuality.LOW}
        onImageSelect={(url: string) => {
          updateKahootMediaUrl(url);
          setIsImageSelectorModalOpen(false);
        }}
      />
    </>
  )
}

export default EditKahootMetadataModal;
