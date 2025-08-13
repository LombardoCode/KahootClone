'use client';

import { useState } from "react";
import DashboardOutletContainer from "../components/utils/DashboardOutletContainer";
import DashboardOutletNavbar from "../components/utils/DashboardOutletNavbar";
import MainContent from "../components/utils/MainContent";
import SidebarNav from "../components/utils/SidebarNav";
import KahootSearchWindow from "../components/utils/General/KahootSearchWindow";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isKahootSearchWindowOpen, setIsKahootSearchWindowOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav className="min-w-60 bg-white h-full" />
      <MainContent topSpacing={false} className={`flex-1 bg-white ${!isKahootSearchWindowOpen ? "overflow-y-scroll": "overflow-hidden"}`}>
        <DashboardOutletNavbar
          setIsKahootSearchWindowOpen={() => setIsKahootSearchWindowOpen(true)}
        />
        <DashboardOutletContainer>
          <>
            <div className={`${isKahootSearchWindowOpen ? "hidden" : ""}`}>
              {children}
            </div>

            {isKahootSearchWindowOpen && (
              <KahootSearchWindow
                setIsKahootSearchWindowOpen={(isOpen: boolean) => setIsKahootSearchWindowOpen(isOpen)}
              />
            )}
          </>
        </DashboardOutletContainer>
      </MainContent>
    </div>
  )
}

export default DashboardLayout;
