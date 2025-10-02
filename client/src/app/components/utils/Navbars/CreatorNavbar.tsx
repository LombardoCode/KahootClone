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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

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
      <nav id="navigation-creator" className="flex justify-between items-center px-3 min-h-[3.85rem] h-[3.85rem] max-h-[3.85rem]">
        <div id="creator-page-logo-and-kahoots-title-and-description" className="flex items-center flex-1 min-w-0">
          <div
            onClick={() => router.push(ROUTES.MENU.DISCOVER)}
            className="cursor-pointer flex-shrink-0"
          >
            {/* Desktop */}
            <Logo
              id="logo-creator-page-desktop"
              size={LogoSize.REGULAR}
              color={LogoColors.VIOLET}
              className="hidden md:block"
            />
            
            {/* Mobile */}
            <Logo
              id="logo-creator-page-mobile"
              size={LogoSize.SMALL}
              color={LogoColors.VIOLET}
              className="block md:hidden"
            />
          </div>
          <div
            id="kahoot-title-header"
            className="flex justify-between items-center flex-1 min-w-0 max-w-96 ml-4 cursor-pointer px-2 py-1 border-1 border-slate-300 rounded-md h-full select-none overflow-hidden"
            onClick={() => setIsEditKahootMetadataModalOpen(true)}
          >
            <Text
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.GRAY}
              useCase={UseCases.TITLE}
              className="text-sm overflow-hidden text-ellipsis line-clamp-1 md:text-lg pl-3 mr-3"
            >
              {kahoot?.title}
            </Text>

            <Button
              backgroundColor={BackgroundColors.ZINC}
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.BLACK}
              size={ButtonSize.NO_SIZE}
              animateOnHover={false}
              perspective={PerspectiveSize.NO_PERSPECTIVE}
              className="px-4 max-h-min py-1.5"
            >
              <span className="hidden lg:block">Settings</span>

              {/* Mobile */}
              <FontAwesomeIcon
                icon={faGear}
                size={`lg`}
                className="lg:hidden"
              />
            </Button>
          </div>
        </div>

        <div
          id="creator-page-save-changes-button"
          className="flex flex-shrink-0 ml-2"
        >
          <Button
            backgroundColor={BackgroundColors.ZINC}
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.GRAY}
            size={ButtonSize.NO_SIZE}
            animateOnHover={false}
            perspective={PerspectiveSize.NO_PERSPECTIVE}
            onClick={() => router.push(ROUTES.MENU.LIBRARY)}
            className="hidden md:block min-w-min px-5 py-3"
          >
            Exit
          </Button>

          <Button
            backgroundColor={BackgroundColors.GREEN}
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            size={ButtonSize.NO_SIZE}
            animateOnHover={false}
            perspective={PerspectiveSize.NO_PERSPECTIVE}
            onClick={() => saveDraft()}
            className="min-w-min px-5 py-3 ml-2"
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
