'use client';

import { useState } from "react";
import DashboardOutletContainer from "../components/utils/DashboardOutletContainer";
import DashboardOutletNavbar from "../components/utils/DashboardOutletNavbar";
import MainContent from "../components/utils/MainContent";
import SidebarNav from "../components/utils/SidebarNav";
import KahootSearchWindow from "../components/utils/General/KahootSearchWindow";
import { DiscoverKahootCardInfo } from "../interfaces/Kahoot/Dashboard/Discover/RecentlyPlayedKahoots.interface";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isKahootSearchWindowOpen, setIsKahootSearchWindowOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchedKahoots, setSearchedKahoots] = useState<DiscoverKahootCardInfo[]>([]);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav className="min-w-60 bg-white h-full" />
      <MainContent topSpacing={false} className={`flex-1 bg-white ${!isKahootSearchWindowOpen ? "overflow-y-scroll": "overflow-hidden"}`}>
        <DashboardOutletNavbar
          setIsKahootSearchWindowOpen={() => setIsKahootSearchWindowOpen(true)}
          setLoading={setLoading}
          setSearchedKahoots={(searchedKahoots: any) => setSearchedKahoots(searchedKahoots)}
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
                searchedKahoots={searchedKahoots}
              />
            )}
          </>
        </DashboardOutletContainer>
      </MainContent>
    </div>
  )
}

export default DashboardLayout;
