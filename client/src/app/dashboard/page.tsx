'use client';

import Text from "../components/UIComponents/Text";
import DashboardOutletContainer from "../components/utils/DashboardOutletContainer";
import DashboardOutletNavbar from "../components/utils/DashboardOutletNavbar";
import MainContent from "../components/utils/MainContent";
import SidebarNav from "../components/utils/SidebarNav";
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-red-500 overflow-hidden">
      <SidebarNav className="min-w-60 bg-white h-full" />
      <MainContent topSpacing={false} className="flex-1 bg-white overflow-y-scroll">
        <DashboardOutletNavbar />
        <DashboardOutletContainer>
          <Text fontWeight={FontWeights.BOLD} useCase={UseCases.HEADER} textColor={TextColors.BLACK} className="text-3xl">Let&apos;s get started!</Text>
        </DashboardOutletContainer>
      </MainContent>
    </div>
  )
}

export default Dashboard;
