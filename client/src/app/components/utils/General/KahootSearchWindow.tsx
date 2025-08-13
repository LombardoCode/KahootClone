import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import Button, { BorderColors, ButtonSize, PerspectiveSize } from "../../UIComponents/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../UIComponents/Spinners/Spinner";
import Text from "../../UIComponents/Text";
import { DiscoverKahootCardInfo } from "@/app/interfaces/Kahoot/Dashboard/Discover/RecentlyPlayedKahoots.interface";
import DiscoverKahootCard, { DiscoverKahootCardSize } from "../Discovery/Cards/Kahoots/DiscoverKahootCard";
import DiscoverKahootWrapper from "../Discovery/Cards/Kahoots/DiscoverKahootWrapper";
import KahootSelectorModal from "../Modal/reusable/KahootSelectorModal";
import { useState } from "react";

interface KahootSearchWindowProps {
  setIsKahootSearchWindowOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  searchedKahoots: DiscoverKahootCardInfo[];
}

const KahootSearchWindow = ({ setIsKahootSearchWindowOpen, isLoading, searchedKahoots }: KahootSearchWindowProps) => {
  // Kahoot modal selector
  const [isKahootSelectorModalOpen, setIsKahootSelectorModalOpen] = useState<boolean>(false);
  const [selectedKahootId, setSelectedKahootId] = useState<string | null>(null);
  const handleKahootCardClick = (kahootId: string) => {
    setSelectedKahootId(kahootId);
    setIsKahootSelectorModalOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner className="text-kahoot-purple-variant-3" />
      </div>
    )
  }

  return (
    <>
      <div className="absolute inset-0 w-full h-full z-20 px-8 py-8 overflow-y-auto">
        <div
          id="search-results-header-and-close-button-wrapper"
          className={`flex ${searchedKahoots.length === 0 ? 'justify-end' : 'justify-between'} items-center w-full`}
        >
          {searchedKahoots.length !== 0 && (
            <div id="search-results-header">
              <Text
                fontWeight={FontWeights.BOLD}
                useCase={UseCases.HEADER}
                textColor={TextColors.BLACK}
                className="text-3xl"
              >
                Results
              </Text>
            </div>
          )}

          <div id="search-close-button">
            <Button
              backgroundColor={BackgroundColors.WHITE}
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.BLACK}
              borderColor={BorderColors.GRAY}
              animateOnHover={false}
              size={ButtonSize.MEDIUM}
              perspective={PerspectiveSize.MEDIUM}
              onClick={() => setIsKahootSearchWindowOpen(false)}
            >
              <FontAwesomeIcon
                icon={faXmark}
                size="lg"
              />
            </Button>
          </div>
        </div>

        <div id="searched-kahoots">
          {searchedKahoots.length === 0 ? (
            <Text
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.BLACK}
              useCase={UseCases.BODY}
            >
              There are no results
            </Text>
          ) : (
            <DiscoverKahootWrapper>
              {searchedKahoots.map((kahoot: DiscoverKahootCardInfo, index: number) => (
                <DiscoverKahootCard
                  cardSize={DiscoverKahootCardSize.SMALL}
                  kahoot={kahoot}
                  onClick={handleKahootCardClick}
                />
              ))}
            </DiscoverKahootWrapper>
          )}
        </div>
      </div>

      <KahootSelectorModal
        isOpen={isKahootSelectorModalOpen}
        onClose={() => {
          setIsKahootSelectorModalOpen(false);
          setSelectedKahootId(null);
        }}
        selectedKahootId={selectedKahootId}
      />
    </>
  )
}

export default KahootSearchWindow;
