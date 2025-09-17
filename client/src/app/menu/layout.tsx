'use client';

import { useEffect, useRef, useState } from "react";
import DashboardOutletContainer from "../components/utils/DashboardOutletContainer";
import DashboardOutletNavbar from "../components/utils/DashboardOutletNavbar";
import MainContent from "../components/utils/MainContent";
import SidebarNav from "../components/utils/SidebarNav";
import KahootSearchWindow from "../components/utils/General/KahootSearchWindow";
import { DiscoverKahootCardInfo } from "../interfaces/Kahoot/Dashboard/Discover/RecentlyPlayedKahoots.interface";
import axiosInstance from "../utils/axiosConfig";
import useClickAway from "../hooks/useClickAway";
import { useUserData } from "../hooks/useUserData";
import { saveKahootSearch } from "../utils/kahootSearchWindowUtils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  // Hooks
  useUserData();

  // Local component state
  const [isKahootSearchWindowOpen, setIsKahootSearchWindowOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [kahootSearchQuery, setKahootSearchQuery] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchedKahootsMetadata, setSearchedKahootsMetadata] = useState<{
    kahoots: DiscoverKahootCardInfo[],
    total: number
  }>({
    kahoots: [],
    total: 0
  });

  // Pagination
  const [pageSize] = useState<number>(21);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Ref variables for the useClickAway hook
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const kahootSearchWindowRef = useRef<HTMLDivElement | null>(null);

  const searchKahoots = async (queryText: string) => {
    if (queryText === "") {
      return;
    }

    setLoading(true);
    setHasSearched(true);

    await axiosInstance.post('/kahoot/search', {
      query: queryText,
      pageSize,
      currentPage
    })
    .then(res => {
      setSearchedKahootsMetadata({
        kahoots: res.data.kahoots,
        total: res.data.totalResults
      });

      saveKahootSearch(queryText);

      setLoading(false);
    })
    .catch(err => {
      setLoading(false);
      console.error(err);
    })
  }

  useEffect(() => {
    if (kahootSearchQuery === "") {
      return;
    }

    const searchKahootsInitializer = async () => {
      await searchKahoots(kahootSearchQuery);
    }

    searchKahootsInitializer();
  }, [currentPage]);

  const clearSearchQueryAndResults = () => {
    setIsKahootSearchWindowOpen(false);
    setKahootSearchQuery("");
    setSearchedKahootsMetadata({ kahoots: [], total: 0 });
    setHasSearched(false);
  }

  const fillSearchBoxAndSearch = async (queryText: string) => {
    queryText = queryText.trim();

    if (queryText === "") {
      return;
    }

    setKahootSearchQuery(queryText);
    await searchKahoots(queryText);
  }

  useClickAway(
    [navbarRef, kahootSearchWindowRef],
    () => clearSearchQueryAndResults(),
    isKahootSearchWindowOpen
  )

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <MainContent
        topSpacing={false}
        className={`flex flex-col h-full`}
      >
        <DashboardOutletNavbar
          setIsKahootSearchWindowOpen={() => setIsKahootSearchWindowOpen(true)}
          kahootSearchQuery={kahootSearchQuery}
          setKahootSearchQuery={(queryText: string) => setKahootSearchQuery(queryText)}
          executeKahootSearch={async () => await searchKahoots(kahootSearchQuery)}
          navbarRef={navbarRef}
        />

        <div className="flex flex-1 overflow-hidden">
          <SidebarNav className="min-w-60 flex flex-col justify-between" />

          <DashboardOutletContainer className="flex-1 overflow-y-auto">
            <>
              <div className={`${isKahootSearchWindowOpen ? "hidden" : ""}`}>
                {children}
              </div>

              <KahootSearchWindow
                visible={isKahootSearchWindowOpen}
                setIsKahootSearchWindowOpen={(isOpen: boolean) => setIsKahootSearchWindowOpen(isOpen)}
                isLoading={loading}
                searchedKahootsMetadata={searchedKahootsMetadata}
                pageSize={pageSize}
                currentPage={currentPage}
                setCurrentPage={(page: number) => setCurrentPage(page)}
                setSelectedPage={(page: number) => setCurrentPage(page)}
                hasSearched={hasSearched}
                kahootSearchWindowRef={kahootSearchWindowRef}
                fillSearchBoxAndSearch={fillSearchBoxAndSearch}
                onClose={clearSearchQueryAndResults}
              />
            </>
          </DashboardOutletContainer>
        </div>
      </MainContent>
    </div>
  )
}

export default DashboardLayout;
