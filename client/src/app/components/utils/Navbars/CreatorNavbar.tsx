import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Logo, { LogoColors, LogoSize } from "../Logo";
import Button, { ButtonSize, PerspectiveSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/utils/Routes/routesUtils";
import { saveKahootDraft } from "@/app/utils/KahootCreator/kahootCreatorUtils";
import EditKahootMetadataModal from "../Modal/reusable/EditKahootMetadataModal";
import KahootSavedModal from "../Modal/reusable/KahootSavedModal";

const CreatorNavbar = () => {
  const router = useRouter();

  // Global store
  const { kahoot, resetIsKahootFormDirty, getKahootPlayabilityStatus } = useKahootCreatorStore();

  // Local component state
  // Modal: EditKahootMetadataModal
  const [isEditKahootMetadataModalOpen, setIsEditKahootMetadataModalOpen] = useState<boolean>(false);

  // Modal: KahootValidatorModal
  const [isKahootSavedModalOpen, setIsKahootSavedModalOpen] = useState<boolean>(false);

  const saveDraft = () => {
    if (kahoot) {
      saveKahootDraft(kahoot, resetIsKahootFormDirty)
        .then(() => {
          getKahootPlayabilityStatus();
          setIsKahootSavedModalOpen(true);
        })
    }
  }

  return (
    <>
      <nav id="navigation-creator" className="flex justify-between items-center px-3">
        <div id="creator-page-logo-and-kahoots-title-and-description" className="flex items-center h-14">
          <div
            onClick={() => router.push(ROUTES.MENU.DISCOVER)}
            className="cursor-pointer"
          >
            <Logo
              size={LogoSize.REGULAR}
              color={LogoColors.VIOLET}
            />
          </div>
          <div
            className="ml-4 hover:bg-zinc-300 cursor-pointer px-2 py-3"
            onClick={() => setIsEditKahootMetadataModalOpen(true)}
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
              textStyle={kahoot?.description ? TextStyles.NORMAL : TextStyles.ITALIC}
              className="text-base"
            >
              {kahoot?.description ? kahoot?.description : 'No description'}
            </Text>
          </div>
        </div>

        <div id="creator-page-save-changes-button">
          <Button
            backgroundColor={BackgroundColors.GREEN}
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            size={ButtonSize.SMALL}
            animateOnHover={false}
            perspective={PerspectiveSize.MEDIUM}
            onClick={() => saveDraft()}
          >
            Save
          </Button>
        </div>
      </nav>

      {/* Modal to be displayed when user clicks on the title / description to modify the kahoot header information */}
      <EditKahootMetadataModal
        isOpen={isEditKahootMetadataModalOpen}
        onClose={() => setIsEditKahootMetadataModalOpen(false)}
      />

      {/* Modal to be displayed after the user saves their Kahoot draft */}
      <KahootSavedModal
        isOpen={isKahootSavedModalOpen}
        onClose={() => setIsKahootSavedModalOpen(false)}
      />
    </>
  )
}

export default CreatorNavbar;
