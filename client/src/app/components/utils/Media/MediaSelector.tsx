import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import Button, { ButtonSize, PerspectiveSize } from "../../UIComponents/Button";
import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

interface MediaSelectorProps {
  doesItContainsAnImage: boolean;
  imageSrc: string;
  removeImageActions: () => void;
  clickedOnTheEmptyImage: (open: boolean) => void;
}

const MediaSelector = ({ doesItContainsAnImage, imageSrc, removeImageActions, clickedOnTheEmptyImage }: MediaSelectorProps) => {
  return (
    <div
      id="image-preview-wrapper"
      className="mt-3"
    >
      {doesItContainsAnImage ? (
        <div className="flex flex-col items-center">
          <img
            src={imageSrc}
            alt="Kahoot cover"
            className="w-64 h-auto object-cover rounded-md"
          />
          <Button
            backgroundColor={BackgroundColors.GRAY}
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            className="text-sm mr-2"
            size={ButtonSize.MEDIUM}
            perspective={PerspectiveSize.MEDIUM}
            animateOnHover={false}
            onClick={() => {
              removeImageActions();
            }}
          >
            Remove image
          </Button>
        </div>
      ) : (
        <div
          id="image-preview-content"
          className="flex justify-center items-center w-40 h-24 rounded-md bg-slate-400/50 hover:bg-slate-400/80 cursor-pointer transition duration-300"
          onClick={() => clickedOnTheEmptyImage(true)}
        >
          <FontAwesomeIcon
            icon={faImage}
            className={`${TextColors.GRAY}`}
            size="2x"
          />
        </div>
      )}
    </div>
  )
}

export default MediaSelector;
