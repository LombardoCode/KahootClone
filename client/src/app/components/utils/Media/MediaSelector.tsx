import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import Button, { ButtonSize, PerspectiveSize } from "../../UIComponents/Button";
import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

interface MediaSelectorProps {
  imageSrc: string;
  removeImageActions: () => void;
  clickedOnTheEmptyImage: (open: boolean) => void;
}

enum MediaSelectorImageSize {
  SMALL = "w-56 min-h-36"
}

const MediaSelector = ({ imageSrc, removeImageActions, clickedOnTheEmptyImage }: MediaSelectorProps) => {
  const doesItContainsAnImage: boolean = !!imageSrc;

  return (
    <div
      id="image-preview-wrapper"
      className={`w-56 min-h-36`}
    >
      {doesItContainsAnImage ? (
        <div className={`flex flex-col items-center h-full max-w-80 max-h-min`}>
          <img
            src={imageSrc}
            alt="Kahoot cover"
            className={`object-cover rounded-md`}
          />

          <Button
            backgroundColor={BackgroundColors.GRAY}
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            className="text-sm mr-2 my-2"
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
          className={`flex justify-center items-center rounded-md bg-slate-400/50 hover:bg-slate-400/80 cursor-pointer transition duration-300 h-full ${MediaSelectorImageSize.SMALL}`}
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
