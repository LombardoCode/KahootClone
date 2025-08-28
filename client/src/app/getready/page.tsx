"use client";

import { useEffect, useState } from "react";
import SpinnerGachapon from "../components/UIComponents/Spinners/SpinnerGachapon/SpinnerGachapon";
import Text from "../components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface";
import useInGameStore from "../stores/Kahoot/useInGameStore";
import { SpinnerSizes } from "../components/UIComponents/Spinners/Spinner.interface";
import useLobbySocketEvents from "../hooks/useLobbySocketEvents";
import PlayerInGameStatus from "../components/utils/InGame/PlayerInGameStatus";
import useBackButtonConfirm from "../hooks/useBackButtonConfirm";
import useProtectedGameplay from "../hooks/useProtectedGameplay";
import { useUserData } from "../hooks/useUserData";

const GetReady = () => {
  // Hooks
  useUserData();
  useLobbySocketEvents();
  useBackButtonConfirm();

  // Global store state
  const { questionIndex } = useInGameStore();
  
  const { ready } = useProtectedGameplay();

  // Local component state
  const [timer, setTimer] = useState<number>(5);
  
  useEffect(() => {
    if (!ready) {
      return;
    }

    const getReadyTimer = setTimeout(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);

    return () => {
      clearTimeout(getReadyTimer);
    }
  }, [timer, ready]);

  if (!ready) {
    return null;
  }

  return (
    <div className={`relative bg-creator-classroom bg-center bg-cover bg-no-repeat h-screen overflow-hidden`}>
      <div className={`absolute inset-0 bg-black opacity-25`}></div>
      <div className="relative flex justify-center items-center z-10 h-full">
        <div
          id="current-question-indicator-panel"
          className="flex flex-col items-center"
        >
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            useCase={UseCases.LONGTEXT}
            className="text-4xl mb-3 text-shadow shadow-black/50"
          >
            Question {questionIndex + 1}
          </Text>

          <div id="spinner-gachapon" className="relative">
            <Text
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.BLACK}
              useCase={UseCases.LONGTEXT}
              className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl mb-3"
            >
              {timer}
            </Text>
            <SpinnerGachapon size={SpinnerSizes.MEDIUM} />
          </div>

          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            useCase={UseCases.LONGTEXT}
            className="text-xl mt-3 text-shadow shadow-black/50"
          >
            {timer >= 3
              ? 'Ready...'
              : timer === 2
                ? 'Set...'
                : 'Go!'}
          </Text>
        </div>
      </div>

      <PlayerInGameStatus />
    </div>
  )
}

export default GetReady;
