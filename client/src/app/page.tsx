'use client'

import Input from "./components/UIComponents/Input";
import Button, { BackgroundColors } from "./components/UIComponents/Button";
import Text from "./components/UIComponents/Text";
import Link from "next/link";
import Logo, { LogoSize } from "./components/utils/Logo";
import { FontWeights, TextColors, UseCases } from "./interfaces/Text.interface";
import BackgroundShapes from "./components/utils/BackgroundShapes";

const Home = () => {
  const tryEnterIntoTheGame = () => {
    console.log("Trying to enter into the game.");
  }

  return (
    <div className="bg-violet-950 w-full h-screen">
      <BackgroundShapes />
      <div className="flex flex-col h-full">
        <div className="flex flex-1 justify-center items-center flex-col relative z-10">
          <Logo
            size={LogoSize.LARGE}
            className="mb-4"
          />
          <div className="flex flex-col justify-between bg-black px-4 py-3 rounded-sm">
            <Input
              placeholder="Game PIN"
            />
            <Button
              textContent="Enter"
              backgroundColor={BackgroundColors.GRAY}
              fontWeight={FontWeights.BOLD}
              className="mt-3"
              onClick={() => tryEnterIntoTheGame()}
            />
          </div>
        </div>
        <footer className="text-center relative z-10 py-5">
          <Text
            useCase={UseCases.LONGTEXT}
            textColor={TextColors.WHITE}
            fontWeight={FontWeights.LIGHT}
          >
            Create your own Kahoot account for FREE by clicking <Link href="/signup">here</Link>!
          </Text>
        </footer>
      </div>
    </div>
  );
}

export default Home;
