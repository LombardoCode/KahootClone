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
import Pagination from "./Pagination";

interface KahootSearchWindowProps {
  setIsKahootSearchWindowOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  searchedKahootsMetadata: {
    kahoots: DiscoverKahootCardInfo[],
    total: number;
  };
  pageSize: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setSelectedPage: (page: number) => void;
  hasSearched: boolean;
  kahootSearchWindowRef: React.RefObject<HTMLDivElement>;
}

const KahootSearchWindow = ({ setIsKahootSearchWindowOpen, isLoading, searchedKahootsMetadata, pageSize, currentPage, setCurrentPage, setSelectedPage, hasSearched, kahootSearchWindowRef: containerRef }: KahootSearchWindowProps) => {
  // Kahoot modal selector
  const [isKahootSelectorModalOpen, setIsKahootSelectorModalOpen] = useState<boolean>(false);
  const [selectedKahootId, setSelectedKahootId] = useState<string | null>(null);
  const handleKahootCardClick = (kahootId: string) => {
    setSelectedKahootId(kahootId);
    setIsKahootSelectorModalOpen(true);
  }

  const closeKahootSearchWindowHandler = () => {
    setIsKahootSearchWindowOpen(false);
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
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full z-20 px-8 py-8 overflow-y-auto"
      >
        <div
          id="search-results-header-and-close-button-wrapper"
          className={`flex ${searchedKahootsMetadata.kahoots.length === 0 ? 'justify-end' : 'justify-between'} items-center w-full`}
        >
          {searchedKahootsMetadata.kahoots.length !== 0 && (
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
              onClick={() => closeKahootSearchWindowHandler()}
            >
              <FontAwesomeIcon
                icon={faXmark}
                size="lg"
              />
            </Button>
          </div>
        </div>

        <div id="searched-kahoots">
          {searchedKahootsMetadata.kahoots.length === 0 ? (
            hasSearched && (
              <ShowNoResultsMessage />
            )
          ) : (
            <DiscoverKahootWrapper>
              {searchedKahootsMetadata.kahoots.map((kahoot: DiscoverKahootCardInfo, index: number) => (
                <DiscoverKahootCard
                  cardSize={DiscoverKahootCardSize.SMALL}
                  kahoot={kahoot}
                  onClick={handleKahootCardClick}
                />
              ))}
            </DiscoverKahootWrapper>
          )}
        </div>

        {searchedKahootsMetadata.kahoots.length !== 0 && (
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalOfResults={searchedKahootsMetadata.total}
            setSelectedPage={(selectedPage: number) => setCurrentPage(selectedPage)}
          />
        )}
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

const ShowNoResultsMessage = () => {
  return (
    <div className="flex flex-col items-center">
      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.PURPLE_VARIANT_4}
        useCase={UseCases.BODY}
        className="text-9xl text-center select-none mb-8"
      >
        :(
      </Text>
      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.GRAY}
        useCase={UseCases.BODY}
        className="text-2xl text-center w-1/5"
      >
        Sorry, we couldn’t find any results matching your search.
      </Text>
    </div>
  )
}

export default KahootSearchWindow;
