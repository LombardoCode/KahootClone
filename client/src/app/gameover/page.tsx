"use client";

import { useEffect, useState } from "react";
import PodiumHeader from "../components/Play/Host/GameOver/PodiumHeader";
import PodiumKahootLogoAndKahootTitle from "../components/Play/Host/GameOver/PodiumKahootLogoAndKahootTitle";

const GameOverScreen = () => {
  // Local component state
  const [hidePodiumHeader, setHidePodiumHeader] = useState<boolean>(false);
  const [disappearPodiumElementsFromDOM, setDisappearPodiumElementsFromDOM] = useState<boolean>(false);

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
    }
  }, []);

  return (
    <div className={`relative px-6 py-8 bg-creator-classroom bg-center bg-cover bg-no-repeat h-screen overflow-hidden`}>
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
          <div
            id="kahoot-podium-content-wrapper"
            className="w-full h-full bg-purple-500/50"
          >
            Podium content
          </div>
        )}
      </div>
    </div>
  )
}

export default GameOverScreen;
