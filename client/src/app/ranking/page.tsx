"use client";

import { useEffect, useState } from "react";
import { SpinnerSizes } from "../components/UIComponents/Spinners/Spinner.interface";
import SpinnerHalfDonut from "../components/UIComponents/Spinners/SpinnerHalfDonut/SpinnerHalfDonut";
import Text from "../components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface";
import useInGameStore, { FinalPlayerStats } from "../stores/Kahoot/useInGameStore";
import PodiumPlaceIcon, { PodiumPlaceIconSize } from "../components/utils/Podium/PodiumPlace/PodiumPlaceIcon";
import Button, { ButtonSize } from "../components/UIComponents/Button";
import { BackgroundColors } from "../interfaces/Colors.interface";
import { determineFinalMessageToPlayer } from "../utils/podium";
import { useRouter } from "next/navigation";
import useLobbySocketEvents from "../hooks/useLobbySocketEvents";

const RankingPage = () => {
  // Hooks
  useLobbySocketEvents();

  const { signalRConnection, currentPlayer } = useInGameStore();
  const [finalPLayerData, setFinalPlayerData] = useState<FinalPlayerStats>();
  const [showPlayerFinalStats, setShowPlayerFinalStats] = useState<boolean>(false);

  useEffect(() => {
    const setupConnection = async () => {
      await initializeSignalREvents();
    }

    setupConnection();
  }, []);

  const initializeSignalREvents = async () => {
    if (signalRConnection) {
      signalRConnection.on('OnReceivePlayersFinalStats', (playersFinalStats: FinalPlayerStats[]) => {
        const individualPlayerFinalStats: FinalPlayerStats | undefined = playersFinalStats.find(p => p.connectionId === currentPlayer.connectionId);

        if (individualPlayerFinalStats !== undefined) {
          setFinalPlayerData(individualPlayerFinalStats);
        }
      })

      signalRConnection.on('OnNotifyOtherPlayersToShowTheirStats', (status: boolean) => {
        setShowPlayerFinalStats(status);
      })
    }
  }

  return (
    <div className={`relative bg-creator-classroom bg-center bg-cover bg-no-repeat h-screen overflow-hidden`}>
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative flex justify-center items-center z-10 h-full">
        <div
          id="current-question-indicator-panel"
          className="flex flex-col items-center"
        >
          {!showPlayerFinalStats
            ? (
              <>
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.WHITE}
                  useCase={UseCases.LONGTEXT}
                  className="text-4xl mb-3 text-shadow shadow-black/60"
                >
                  Drum roll...
                </Text>

                <div id="spinner-half-donut" className="relative mt-2">
                  <SpinnerHalfDonut size={SpinnerSizes.EXTRA_SMALL} />
                </div>
              </>
            )
            : (
              <ShowPlayerTheirStats stats={finalPLayerData} />
            )}
        </div>
      </div>
    </div>
  )
}

interface ShowPlayerTheirStatsProps {
  stats: FinalPlayerStats | undefined;
}

const ShowPlayerTheirStats = ({ stats }: ShowPlayerTheirStatsProps) => {
  if (stats === undefined) {
    return null;
  }

  const router = useRouter();
  const [finalMessageToPlayer, setFinalMessageToPlayer] = useState<string>();

  useEffect(() => {
    setFinalMessageToPlayer(determineFinalMessageToPlayer(stats.place));
  }, []);

  return (
    <>
      <div id="ranking-podium-place-icon" className="flex justify-center w-full mb-2">
        <PodiumPlaceIcon
          place={stats.place}
          size={PodiumPlaceIconSize.SMALL}
        />
      </div>

      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.WHITE}
        useCase={UseCases.LONGTEXT}
        className="text-4xl mb-3 text-shadow shadow-black/60"
      >
        {stats.name}
      </Text>

      <Text
        fontWeight={FontWeights.REGULAR}
        textColor={TextColors.WHITE}
        useCase={UseCases.LONGTEXT}
        className="text-2xl mb-3 text-shadow shadow-black/60"
      >
        {finalMessageToPlayer}
      </Text>

      <Button
        backgroundColor={BackgroundColors.PURPLE}
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.WHITE}
        animateOnHover={false}
        size={ButtonSize.MEDIUM}
        className="w-full"
        onClick={() => router.push('/')}
      >
        Exit
      </Button>
    </>
  )
}

export default RankingPage;
