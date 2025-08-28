"use client";

import { useEffect, useState } from "react";
import PodiumHeader from "../components/Play/Host/GameOver/PodiumHeader";
import PodiumKahootLogoAndKahootTitle from "../components/Play/Host/GameOver/PodiumKahootLogoAndKahootTitle";
import PodiumBody from "../components/Play/Host/GameOver/PodiumBody/PodiumBody";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import GameOptionsCard from "../components/Play/Host/GameOver/GameOptionsCard";
import useInGameStore from "../stores/Kahoot/useInGameStore";
import SoundBank from "../singletons/SoundBank";
import useLobbySocketEvents from "../hooks/useLobbySocketEvents";
import useBackButtonConfirm from "../hooks/useBackButtonConfirm";
import useProtectedGameplay from "../hooks/useProtectedGameplay";
import { HubConnectionState } from "@microsoft/signalr";
import { useUserData } from "../hooks/useUserData";

const GameOverScreen = () => {
  // Hooks
  useUserData();
  useLobbySocketEvents();
  useBackButtonConfirm();

  // Store state
  const { players, setFinalPlayerStats, finalPlayerStats, lobbyId, signalRConnection } = useInGameStore();
  
  const { ready } = useProtectedGameplay();

  // Local component state
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [isConfettiRunning, setIsConfettiRunning] = useState<boolean>(false);
  const [isConfettiSpawning, setIsConfettiSpawning] = useState<boolean>(false);
  const [showGameOptions, setShowGameOptions] = useState<boolean>(false);
  const [hidePodiumHeader, setHidePodiumHeader] = useState<boolean>(false);
  const [disappearPodiumElementsFromDOM, setDisappearPodiumElementsFromDOM] = useState<boolean>(false);
  const timeToWaitForPodiumPlayersToShowUp: number = 6.8;

  useEffect(() => {
    if (!ready) {
      return;
    }

    SoundBank.playPodiumBackgroundMusic();
  }, [ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    setWidth(windowWidth);
    setHeight(windowHeight);
  }, [ready, windowWidth, windowHeight]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    let disappearPodiumElementsFromDOMTimer: any;
    const podiumTimer = setTimeout(() => {
      setHidePodiumHeader(true);
      disappearPodiumElementsFromDOMTimer = setTimeout(() => {
        setDisappearPodiumElementsFromDOM(true);
      }, 500);
    }, 1500);

    return () => {
      clearTimeout(podiumTimer);
      clearTimeout(disappearPodiumElementsFromDOMTimer);
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (isConfettiSpawning) {
      const confettiTimer = setTimeout(() => {
        setIsConfettiSpawning(false);
      }, 10000);

      return () => clearTimeout(confettiTimer);
    }
  }, [ready, isConfettiSpawning]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (players.length > 0) {
      setFinalPlayerStats(players);
    }
  }, [ready, players, setFinalPlayerStats]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    // Send to all players the final player statistics
    if (finalPlayerStats.length > 0 && signalRConnection !== null && signalRConnection.state === HubConnectionState.Connected) {
      signalRConnection.invoke('SendPlayerFinalStatsToAllPlayers', lobbyId, finalPlayerStats);
    }
  }, [ready, finalPlayerStats]);

  const startShowUpTime = (val: boolean) => {
    // Start spawning confetti
    setIsConfettiRunning(val);
    setIsConfettiSpawning(val);
    
    const timeInSecsToWaitForTheGameOptionsToShowUp: number = 14;
    const showGameOptionsTimer = setTimeout(() => {
      setShowGameOptions(true);
    }, timeInSecsToWaitForTheGameOptionsToShowUp * 1000);

    notifyOtherPlayersToShowTheirStats();
    
    return () => {
      clearTimeout(showGameOptionsTimer);
    }
  }

  const notifyOtherPlayersToShowTheirStats = () => {
    if (signalRConnection !== null && signalRConnection.state === HubConnectionState.Connected) {
      signalRConnection.invoke('NotifyOtherPlayersToShowTheirStats', lobbyId);
    }
  }

  if (!ready) {
    return null;
  }

  return (
    <div id="gameover-and-game-options-wrapper" className="flex overflow-hidden">
      <div id="gameover-content" className="flex-1 flex-grow">
        <Confetti
          width={width}
          height={height}
          run={isConfettiRunning}
          numberOfPieces={isConfettiSpawning ? 300 : 0}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 100 }}
        />

        <div className={`relative px-6 pt-8 bg-creator-classroom bg-center bg-cover bg-no-repeat h-screen overflow-hidden`}>
          <div className="absolute inset-0 bg-black opacity-20"></div>

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
                  startShowUpTime(val);
                }}
                players={players}
              />
            )}
          </div>
        </div>
      </div>

      {showGameOptions && (
        <GameOptionsCard />
      )}
    </div>
  );
};

export default GameOverScreen;