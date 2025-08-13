import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import Button, { BorderColors, ButtonSize, PerspectiveSize } from "../../UIComponents/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface KahootSearchWindowProps {
  setIsKahootSearchWindowOpen: (isOpen: boolean) => void;
}

const KahootSearchWindow = ({ setIsKahootSearchWindowOpen }: KahootSearchWindowProps) => {
  return (
    <div className="absolute w-full h-full z-20">
      <div
        id="search-and-close-button-wrapper"
        className="flex items-center"
      >
        <Text
          fontWeight={FontWeights.BOLD}
          useCase={UseCases.HEADER}
          textColor={TextColors.BLACK}
          className="text-3xl"
        >
          Search...
        </Text>
        <Button
          backgroundColor={BackgroundColors.WHITE}
          fontWeight={FontWeights.REGULAR}
          textColor={TextColors.BLACK}
          borderColor={BorderColors.GRAY}
          animateOnHover={false}
          size={ButtonSize.SMALL}
          perspective={PerspectiveSize.MEDIUM}
          onClick={() => setIsKahootSearchWindowOpen(false)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </div>
    </div>
  )
}

export default KahootSearchWindow;
