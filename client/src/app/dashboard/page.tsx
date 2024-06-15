'use client';

import Text from "../components/UIComponents/Text";
import Container from "../components/utils/Container";
import MainContent from "../components/utils/MainContent";
import Navbar from "../components/utils/Navbar";
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface";
import useStore from "../stores/globalStore";

const Dashboard = () => {
  const { user } = useStore();
  
  return (
    <>
      <Navbar />
      <Container>
        <MainContent>
          <Text fontWeight={FontWeights.BOLD} textColor={TextColors.BLACK} useCase={UseCases.HEADER}>
            Welcome back, {user.userName}
          </Text>
        </MainContent>
      </Container>
    </>
  )
}

export default Dashboard;
