"use client";

import Navbar from "../components/utils/Navbar";
import MainContent from "../components/utils/MainContent";
import Container from "../components/utils/Container";
import BackgroundShapes from "../components/utils/BackgroundShapes";

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

const AuthPageLayout = ({ children }: AuthPageLayoutProps) => {
  return (
    <>
      <Navbar fixed={false} />
      <BackgroundShapes className="-z-10"/>
      <Container>
        <MainContent>
          {children}
        </MainContent>
      </Container>
    </>
  )
}

export default AuthPageLayout;
