'use client'

import Input from "./components/UIComponents/Input";
import Button from "./components/UIComponents/Button";
import Text from "./components/UIComponents/Text";
import Link from "next/link";
import Logo, { LogoSize } from "./components/utils/Logo";
import { FontWeights, TextColors, UseCases } from "./interfaces/Text.interface";
import BackgroundShapes, { ShapeColor } from "./components/utils/BackgroundShapes";
import Card, { CardBackgroundColors } from "./components/UIComponents/Card";
import { BackgroundColors } from "./interfaces/Colors.interface";
import InputForm, { InputFormTypes } from "./components/UIComponents/InputForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    gamePIN: ''
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const tryEnterIntoTheGame = (gamePIN: number | string) => {
    router.push(`/lobby/${gamePIN}`);
  }

  return (
    <>
      <div className="bg-violet-950 w-full h-screen">
        <BackgroundShapes shapeColor={ShapeColor.VIOLET} />
        <div className="flex flex-col h-full">
          <div className="flex flex-1 justify-center items-center flex-col relative z-10">
            <Logo
              size={LogoSize.LARGE}
              className="mb-4"
            />
            <Card
              backgroundColor={CardBackgroundColors.BLACK}
              className="flex flex-col justify-between"
            >
              <InputForm
                type={InputFormTypes.TEXT}
                textColor={TextColors.BLACK}
                fontWeight={FontWeights.REGULAR}
                name="gamePIN"
                id="gamePIN"
                value={formData.gamePIN}
                onChange={handleFormChange}
              />
              <Button
                backgroundColor={BackgroundColors.GRAY}
                fontWeight={FontWeights.BOLD}
                className="mt-3"
                onClick={() => tryEnterIntoTheGame(formData.gamePIN)}
              >
                Enter
              </Button>
            </Card>
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
    </>
  );
}

export default Home;
