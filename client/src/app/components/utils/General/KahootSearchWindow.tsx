import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../UIComponents/Spinners/Spinner";
import Text from "../../UIComponents/Text";
import { DiscoverKahootCardInfo } from "@/app/interfaces/Kahoot/Dashboard/Discover/RecentlyPlayedKahoots.interface";
import DiscoverKahootCard, { DiscoverKahootCardSize } from "../Discover/Cards/Kahoots/DiscoverKahootCard";
import DiscoverKahootWrapper from "../Discover/Cards/Kahoots/DiscoverKahootWrapper";
import KahootSelectorModal from "../Modal/reusable/KahootSelectorModal";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import axiosInstance from "@/app/utils/axiosConfig";
import { DiscoverCategoryCardInfo } from "@/app/interfaces/Kahoot/Dashboard/Discover/DiscoverCategoryCardInfo";
import SectionTitle, { SectionTitleSizes } from "../Discover/Titles/SectionTitle";
import DiscoverCategoryWrapper from "../Discover/Cards/Categories/DiscoverCategoryWrapper";
import DiscoverCategoryCard, { DiscoverCategoryCardSize } from "../Discover/Cards/Categories/DiscoverCategoryCard";
import { getRecentSearches } from "@/app/utils/kahootSearchWindowUtils";

interface KahootSearchWindowProps {
  visible: boolean;
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
  fillSearchBoxAndSearch: (queryText: string) => void;
  onClose: () => void;
}

const KahootSearchWindow = ({ visible, setIsKahootSearchWindowOpen, isLoading, searchedKahootsMetadata, pageSize, currentPage, setCurrentPage, setSelectedPage, hasSearched, kahootSearchWindowRef: containerRef, fillSearchBoxAndSearch, onClose }: KahootSearchWindowProps) => {
  // Kahoot modal selector
  const [isKahootSelectorModalOpen, setIsKahootSelectorModalOpen] = useState<boolean>(false);
  const [selectedKahootId, setSelectedKahootId] = useState<string | null>(null);
  const handleKahootCardClick = (kahootId: string) => {
    setSelectedKahootId(kahootId);
    setIsKahootSelectorModalOpen(true);
  }

  const closeKahootSearchWindowHandler = () => {
    onClose();
  }

  useEffect(() => {
    const initialization = async () => {
      retrieveRecentSearchesFromLocalStorage();
      await getCategories();
    }

    initialization();
  }, []);

  // Local component state
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [categories, setCategories] = useState<DiscoverCategoryCardInfo[]>([]);

  const retrieveRecentSearchesFromLocalStorage = () => {
    setRecentSearches(getRecentSearches());
  }

  const getCategories = async () => {
    await axiosInstance.get('/kahoot/getCategories')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner className="text-kahoot-purple-variant-3" />
      </div>
    )
  }

  return (
    <div ref={containerRef}>
      <div className={`${!visible && 'hidden'} absolute inset-0 w-full h-full z-20 px-8 py-8 overflow-y-auto`}>
        <div className="relative">
          <div
            id="search-results-header-and-close-button-wrapper"
            className={`${searchedKahootsMetadata.kahoots.length === 0 ? 'absolute top-0 right-0' : 'flex justify-between items-center'}`}
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

            <div id="search-close-button" className="bg-gray-300 hover:bg-gray-400 rounded-md">
              <FontAwesomeIcon
                icon={faXmark}
                size="lg"
                className={`${TextColors.BLACK} px-4 py-4 cursor-pointer`}
                onClick={() => closeKahootSearchWindowHandler()}
              />
            </div>
          </div>

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div id="recent-searches-wrapper" className="mb-4">
              <SectionTitle
                size={SectionTitleSizes.SMALL}
                className="mb-1"
              >
                Recent searches
              </SectionTitle>

              <div id="recent-searches-content" className="flex">
                {recentSearches.map((search: string, index: number) => (
                  <div
                    key={index}
                    className="border-1 border-gray-500 bg-white hover:bg-gray-300 rounded-sm px-3 py-1.5 mr-2 cursor-pointer select-none"
                    onClick={() => fillSearchBoxAndSearch(search)}
                  >
                    {search}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {searchedKahootsMetadata.kahoots.length === 0 && !hasSearched && (
            <>
              <SectionTitle size={SectionTitleSizes.SMALL} className="pt-8">Categories</SectionTitle>
              <DiscoverCategoryWrapper>
                {categories.map((category: DiscoverCategoryCardInfo, i: number) => (
                  <DiscoverCategoryCard
                    key={i}
                    cardSize={DiscoverCategoryCardSize.SMALL}
                    category={category}
                  />
                ))}
              </DiscoverCategoryWrapper>
            </>
          )}

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
    </div>
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
        Sorry, we couldn't find any results matching your search.
      </Text>
    </div>
  )
}

export default KahootSearchWindow;
