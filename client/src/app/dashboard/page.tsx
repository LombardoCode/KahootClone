'use client';

import Text from "../components/UIComponents/Text";
import DashboardOutletContainer from "../components/utils/DashboardOutletContainer";
import DashboardOutletNavbar from "../components/utils/DashboardOutletNavbar";
import MainContent from "../components/utils/MainContent";
import SidebarNav from "../components/utils/SidebarNav";
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useRouter } from "next/navigation";
import { KahootDashboardList } from "../interfaces/Kahoot/Dashboard/KahootDashboardList.interface";
import Card from "../components/UIComponents/Card";

const Dashboard = () => {
  const router = useRouter();
  const [kahootsFromUser, setKahootsFromUser] = useState<KahootDashboardList[]>([]);

  useEffect(() => {
    getBasicInfoFromUsersKahoots();
  }, []);

  const getBasicInfoFromUsersKahoots = async () => {
    await axiosInstance.get('/kahoot/getBasicInfoFromUsersKahoots')
      .then((res) => {
        setKahootsFromUser(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
    <div className="flex h-screen bg-red-500 overflow-hidden">
      <SidebarNav className="min-w-60 bg-white h-full" />
      <MainContent topSpacing={false} className="flex-1 bg-white overflow-y-scroll">
        <DashboardOutletNavbar />
        <DashboardOutletContainer>
          <Text
            fontWeight={FontWeights.BOLD}
            useCase={UseCases.HEADER}
            textColor={TextColors.BLACK}
            className="text-3xl"
          >
            Your kahoots
          </Text>

          {kahootsFromUser.length === 0
            ? (
              <Text
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.BLACK}
                useCase={UseCases.LONGTEXT}
              >
                You don&apos;t have any kahoots for now. Create your own Kahoot now!
              </Text>
            )
            : (
              <div id="kahoots-created-by-user" className="my-4 grid grid-cols-4 gap-4">
                {kahootsFromUser.map((kahoot: KahootDashboardList, index: number) => (
                  <div
                    key={index}
                    className="bg-red-500"
                  >
                    <Card
                      className="cursor-pointer hover:bg-zinc-300"
                      onClick={() => router.push(`/creator/${kahoot.id}`)}
                    >
                      <Text
                        fontWeight={FontWeights.BOLD}
                        textColor={TextColors.BLACK}
                        useCase={UseCases.LONGTEXT}
                      >
                        {kahoot.title}
                      </Text>

                      <Text
                        fontWeight={FontWeights.REGULAR}
                        textColor={TextColors.BLACK}
                        useCase={UseCases.LONGTEXT}
                      >
                        {kahoot.description}
                      </Text>
                    </Card>
                  </div>
                ))}
              </div>
            )}
        </DashboardOutletContainer>
      </MainContent>
    </div>
  )
}

export default Dashboard;
