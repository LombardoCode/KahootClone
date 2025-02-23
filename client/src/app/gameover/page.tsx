"use client";

import { useEffect, useState } from "react";
import PodiumHeader from "../components/Play/Host/GameOver/PodiumHeader";
import PodiumKahootLogoAndKahootTitle from "../components/Play/Host/GameOver/PodiumKahootLogoAndKahootTitle";
import PodiumBody from "../components/Play/Host/GameOver/PodiumBody/PodiumBody";
import BackgroundAudioPlayer from "../components/utils/Audio/BackgroundAudioPlayer";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const GameOverScreen = () => {
  // Local component state
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [isConfettiRunning, setIsConfettiRunning] = useState<boolean>(false);
  const [isConfettiSpawning, setIsConfettiSpawning] = useState<boolean>(false);

  useEffect(() => {
    setWidth(windowWidth);
    setHeight(windowHeight);
  }, [windowWidth, windowHeight]);

  const [hidePodiumHeader, setHidePodiumHeader] = useState<boolean>(false);
  const [disappearPodiumElementsFromDOM, setDisappearPodiumElementsFromDOM] = useState<boolean>(false);
  const timeToWaitForPodiumPlayersToShowUp: number = 6.8;

  useEffect(() => {
    let disappearPodiumElementsFromDOMTimer: any;
    const podiumTimer = setTimeout(() => {
      setHidePodiumHeader(true);
      disappearPodiumElementsFromDOMTimer = setTimeout(() => {
        setDisappearPodiumElementsFromDOM(true);
      }, 500);
    }, 1500);

    return () => {
      clearInterval(podiumTimer);
      clearInterval(disappearPodiumElementsFromDOMTimer);
    };
  }, []);

  useEffect(() => {
    if (isConfettiSpawning) {
      const confettiTimer = setTimeout(() => {
        setIsConfettiSpawning(false);
      }, 10000);

      return () => clearTimeout(confettiTimer);
    }
  }, [isConfettiSpawning]);

  return (
    <>
      <Confetti
        width={width}
        height={height}
        run={isConfettiRunning}
        numberOfPieces={isConfettiSpawning ? 300 : 0}
        style={{ position: "fixed", top: 0, left: 0, zIndex: 100 }}
      />

      <BackgroundAudioPlayer
        audio_src="/assets/audio/podium.mp3"
        autoplay={true}
        loop={false}
      />

      <div className={`relative px-6 pt-8 bg-creator-classroom bg-center bg-cover bg-no-repeat h-screen overflow-hidden`}>
        <div className="absolute inset-0 bg-black opacity-5"></div>

        <div className={`relative z-10 flex ${!disappearPodiumElementsFromDOM ? 'flex-row justify-center' : 'flex-col items-center'} w-full h-full`}>
          <div
            id="kahoot-logo-kahoot-title-and-podium-header-wrapper"
            className="w-full flex flex-col items-center"
          >
            <div
              id="kahoot-logo-kahoot-title-and-podium-header-content"
              className={`h-full w-96`}
            >
              <PodiumKahootLogoAndKahootTitle
                moveToTheTop={hidePodiumHeader}
                podiumHeaderDisappeared={disappearPodiumElementsFromDOM}
              />

              {!disappearPodiumElementsFromDOM && (
                <PodiumHeader hide={hidePodiumHeader} />
              )}
            </div>
          </div>

          {disappearPodiumElementsFromDOM && (
            <PodiumBody
              timeToWaitForPodiumPlayersToShowUp={timeToWaitForPodiumPlayersToShowUp}
              isConfettiSpawning={(val: boolean) => {
                setIsConfettiRunning(val);
                setIsConfettiSpawning(val);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default GameOverScreen;