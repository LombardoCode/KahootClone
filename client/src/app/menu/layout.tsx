'use client';

import DashboardOutletContainer from "../components/utils/DashboardOutletContainer";
import DashboardOutletNavbar from "../components/utils/DashboardOutletNavbar";
import MainContent from "../components/utils/MainContent";
import SidebarNav from "../components/utils/SidebarNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav className="min-w-60 bg-white h-full" />
      <MainContent topSpacing={false} className="flex-1 bg-white overflow-y-scroll">
        <DashboardOutletNavbar />
        <DashboardOutletContainer>
          {children}
        </DashboardOutletContainer>
      </MainContent>
    </div>
  )
}

export default DashboardLayout;
