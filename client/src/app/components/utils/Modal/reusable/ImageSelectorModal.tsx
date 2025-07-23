import InputForm, { InputFormTypes } from "@/app/components/UIComponents/InputForm";
import Modal, { ModalTypes } from "../Modal";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "@/app/components/UIComponents/Text";
import Button, { ButtonSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageQueryText: string;
  onQueryChange: (text: string) => void;
  pexelsResults: any[];
  pexelsLoading: boolean;
  onImageSelect: (url: string) => void;
}

const ImageSelectorModal = ({
  isOpen,
  onClose,
  imageQueryText,
  onQueryChange,
  pexelsResults,
  pexelsLoading,
  onImageSelect
}: ImageSelectorModalProps) => {
  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
      onClose={onClose}
      className="w-[1000px] max-w-[90vw] min-h-[80vh]"
      bodyContent={(
        <>
          <div
            id="image-search-text-box"
            className="sticky top-0 z-10 bg-white pb-2 pt-4 px-4"
          >
            <InputForm
              type={InputFormTypes.TEXT}
              textColor={TextColors.BLACK}
              fontWeight={FontWeights.LIGHT}
              name="image-query"
              id="image-query"
              value={imageQueryText}
              className="w-full py-3"
              placeholder="Search images (eg. tech, gaming, music...)"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onQueryChange(e.target.value)}
            />
          </div>
          <div
            id="popular-images-and-images-provided-by-pexels-wrapper"
            className="flex justify-between"
          >
            <Text
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.GRAY}
              useCase={UseCases.LONGTEXT}
              className="text-sm"
            >
              Popular images
            </Text>
            <Text
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.GRAY}
              useCase={UseCases.LONGTEXT}
              className="text-sm"
            >
              Images provided by Pexels
            </Text>
          </div>
          <div
            id="pexels-images"
            className="grid grid-cols-3 gap-3 mt-4 h-full overflow-y-auto px-10 py-6"
          >
            {pexelsLoading ? (
              <Text
                fontWeight={FontWeights.REGULAR}
                textColor={TextColors.GRAY}
                useCase={UseCases.LONGTEXT}
                className="text-sm col-span-3 text-center"
              >
                Loading...
              </Text>
            ) : (
              pexelsResults.map((photo: any) => (
                <div
                  key={photo.id}
                  className="cursor-pointer rounded-md overflow-hidden transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/30"
                  onClick={() => {
                    onImageSelect(photo.src.large);
                    onClose();
                  }}
                >
                  <img
                    src={photo.src.medium}
                    alt={photo.alt || "pexels image"}
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
              ))
            )}
          </div>
        </>
      )}
      footerContent={(
        <Button
          backgroundColor={BackgroundColors.GRAY}
          fontWeight={FontWeights.BOLD}
          size={ButtonSize.MEDIUM}
          textColor={TextColors.WHITE}
          className="mr-2"
          animateOnHover={false}
          onClick={onClose}
        >
          Cancel
        </Button>
      )}
    />
  )
}

export default ImageSelectorModal;
