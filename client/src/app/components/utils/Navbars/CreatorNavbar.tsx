import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Logo, { LogoColors, LogoSize } from "../Logo";
import Button from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";

interface CreatorNavbarProps {
  kahoot: { title: string; description: string };
}

const CreatorNavbar = ({ kahoot }: CreatorNavbarProps) => {
  const { isKahootFormDirty } = useKahootCreatorStore();

  return (
    <nav id="navigation-creator" className="flex justify-between items-center px-3">
      <div id="creator-page-logo-and-kahoots-title-and-description" className="flex items-center h-14">
        <div>
          <Logo
            size={LogoSize.REGULAR}
            color={LogoColors.VIOLET}
          />
        </div>
        <div className="ml-4">
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.BLACK}
            useCase={UseCases.TITLE}
            className="text-xl"
          >
            {kahoot.title}
          </Text>

          <Text
            fontWeight={FontWeights.REGULAR}
            textColor={TextColors.BLACK}
            useCase={UseCases.TITLE}
            textStyle={kahoot.description ? TextStyles.NORMAL : TextStyles.ITALIC}
            className="text-base"
          >
            {kahoot.description ? kahoot.description : 'No description'}
          </Text>
        </div>
      </div>

      <div id="creator-page-save-changes-button">
        {isKahootFormDirty && (
          <Button
            backgroundColor={BackgroundColors.GREEN}
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
          >
            Save changes
          </Button>
        )}
      </div>
    </nav>
  )
}

export default CreatorNavbar;
