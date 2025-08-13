'use client';

import { useEffect, useState } from "react";
import DashboardOutletContainer from "../components/utils/DashboardOutletContainer";
import DashboardOutletNavbar from "../components/utils/DashboardOutletNavbar";
import MainContent from "../components/utils/MainContent";
import SidebarNav from "../components/utils/SidebarNav";
import KahootSearchWindow from "../components/utils/General/KahootSearchWindow";
import { DiscoverKahootCardInfo } from "../interfaces/Kahoot/Dashboard/Discover/RecentlyPlayedKahoots.interface";
import axiosInstance from "../utils/axiosConfig";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isKahootSearchWindowOpen, setIsKahootSearchWindowOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [kahootSearchQuery, setKahootSearchQuery] = useState<string>("");
  const [searchedKahootsMetadata, setSearchedKahootsMetadata] = useState<{
    kahoots: DiscoverKahootCardInfo[],
    total: number
  }>({
    kahoots: [],
    total: 0
  });

  // Pagination
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const searchKahoots = async (queryText: string) => {
    setLoading(true);
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
      setLoading(false);
    })
    .catch(err => {
      setLoading(false);
      console.error(err);
    })
  }

  useEffect(() => {
    const searchKahootsInitializer = async () => {
      await searchKahoots(kahootSearchQuery);
    }

    searchKahootsInitializer();
  }, [currentPage]);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav className="min-w-60 bg-white h-full" />
      <MainContent
        topSpacing={false}
        className={`flex-1 bg-white ${!isKahootSearchWindowOpen ? "overflow-y-scroll": "overflow-hidden"}`}
      >
        <DashboardOutletNavbar
          setIsKahootSearchWindowOpen={() => setIsKahootSearchWindowOpen(true)}
          kahootSearchQuery={kahootSearchQuery}
          setKahootSearchQuery={(queryText: string) => setKahootSearchQuery(queryText)}
          executeKahootSearch={async () => await searchKahoots(kahootSearchQuery)}
        />
        <DashboardOutletContainer>
          <>
            <div className={`${isKahootSearchWindowOpen ? "hidden" : ""}`}>
              {children}
            </div>

            {isKahootSearchWindowOpen && (
              <KahootSearchWindow
                setIsKahootSearchWindowOpen={(isOpen: boolean) => setIsKahootSearchWindowOpen(isOpen)}
                isLoading={loading}
                searchedKahootsMetadata={searchedKahootsMetadata}
                pageSize={pageSize}
                currentPage={currentPage}
                setCurrentPage={(page: number) => setCurrentPage(page)}
                setSelectedPage={(page: number) => setCurrentPage(page)}
              />
            )}
          </>
        </DashboardOutletContainer>
      </MainContent>
    </div>
  )
}

export default DashboardLayout;
