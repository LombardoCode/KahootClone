'use client'

import Button, { PerspectiveSize } from "./components/UIComponents/Button";
import Text from "./components/UIComponents/Text";
import Link from "next/link";
import Logo, { LogoSize } from "./components/utils/Logo";
import { FontWeights, TextColors, UseCases } from "./interfaces/Text.interface";
import BackgroundShapes, { ShapeColor } from "./components/utils/BackgroundShapes";
import Card, { CardBackgroundColors } from "./components/UIComponents/Card";
import { BackgroundColors } from "./interfaces/Colors.interface";
import InputForm, { BorderSize, FocusBorderColor, InputFormTypes, Roundness } from "./components/UIComponents/InputForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { validateIfLobbyExists } from "./utils/Lobby/lobbyUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import SpinnerHalfDonut from "./components/UIComponents/Spinners/SpinnerHalfDonut/SpinnerHalfDonut";
import { SpinnerSizes } from "./components/UIComponents/Spinners/Spinner.interface";

const Home = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    gamePIN: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightInput, setHighlightInput] = useState<boolean>(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (highlightInput) {
      setHighlightInput(false);
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const tryEnterIntoTheGame = async (gamePIN: number | string) => {
    setError(null);
    setHighlightInput(false);
    const isEmpty: boolean = gamePIN.toString().trim() === "";

    if (isEmpty) {
      setLoading(true);
      const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 700));
      await Promise.all([minimumLoadingTime]);
      setLoading(false);
      setError("You need to enter a game PIN before you can play.");
      setHighlightInput(true);
      return;
    }

    await validateIfLobbyWithThatGamePinExists(gamePIN);
  }

  const validateIfLobbyWithThatGamePinExists = async (gamePIN: string | number) => {
    setLoading(true);
    setError(null);

    const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 700));

    try {
      const [res] = await Promise.all([
        validateIfLobbyExists(gamePIN),
        minimumLoadingTime
      ]);

      const isAValidLobby: boolean = res.data;

      if (isAValidLobby) {
        enterToTheLobby(gamePIN);
      } else {
        setError("We didn't recognize that game PIN. Please check and try again.");
        setHighlightInput(true);
      }
    } catch (error) {
      setError("An error occurred while connecting. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const enterToTheLobby = (gamePIN: string | number) => {
    router.push(`/lobby/${gamePIN}`);
  }

  return (
    <>
      <div className="bg-violet-950 w-full h-screen">
        {loading && (
          <LoadingKahootScreen />
        )}

        <BackgroundShapes shapeColor={ShapeColor.VIOLET} />
        <div className="flex flex-col h-full">
          <div className="flex flex-1 justify-center items-center flex-col relative z-10">
            <Logo
              size={LogoSize.LARGE}
              className="mb-4"
            />
            <Card
              backgroundColor={CardBackgroundColors.WHITE}
              className="min-w-[350px] flex flex-col justify-between"
            >
              <InputForm
                type={InputFormTypes.TEXT}
                roundness={Roundness.SMALL}
                textColor={TextColors.GRAY}
                fontWeight={FontWeights.BOLD}
                borderSize={BorderSize.SMALL}
                focusBorderColor={!highlightInput ? FocusBorderColor.BLUE : FocusBorderColor.RED}
                id="gamePIN"
                name="gamePIN"
                className={`outline-none py-3 my-1 text-center ${highlightInput && 'border-kahoot-red-200'}`}
                placeholder="Game PIN"
                value={formData.gamePIN}
                onChange={handleFormChange}
                rightElement={
                  highlightInput && (
                    <FontAwesomeIcon
                      icon={faExclamation}
                      className={`text-kahoot-red-200 mr-1 px-3 py-3`}
                      size="xl"
                    />
                  )
                }
              />
              <Button
                backgroundColor={BackgroundColors.GRAY}
                textColor={TextColors.WHITE}
                perspective={PerspectiveSize.MEDIUM}
                animateOnHover={false}
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

        <ErrorNotifier
          error={error}
          setError={setError}
        />
      </div>
    </>
  );
}

const LoadingKahootScreen = () => {
  return (
    <div className="fixed flex flex-col items-center justify-center bg-black/80 w-full h-full z-30">
      <SpinnerHalfDonut
        size={SpinnerSizes.MEDIUM}
        className="mb-4"
      />

      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.WHITE}
        useCase={UseCases.LONGTEXT}
        className="text-2xl"
      >
        Connecting to Kahoot!
      </Text>
    </div>
  )
}

interface ErrorNotifierProps {
  error: string | null;
  setError: (error: string | null) => void;
}

const ErrorNotifier = ({ error, setError }: ErrorNotifierProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!visible && error === null) {
      return;
    }

    if (visible && error === null) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setError(null);
    }, 5000);

    return () => {
      clearInterval(timer);
    }
  }, [error]);

  return (
    <div
      className={`fixed left-0 bottom-0 z-10 w-full h-10 bg-red-800 flex items-center px-4 transition-all duration-300 ease-out select-none ${visible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <div className="flex justify-center items-center ring-2  ring-white min-w-5 min-h-5 rounded-full mr-4">
        <FontAwesomeIcon
          icon={faExclamation}
          className={`${TextColors.WHITE}`}
          size="xs"
        />
      </div>
      <Text
        fontWeight={FontWeights.REGULAR}
        textColor={TextColors.WHITE}
        useCase={UseCases.BODY}
        className="text-sm"
      >
        {error}
      </Text>
    </div>
  )
}

export default Home;
