'use client'

import { useRouter } from "next/navigation";
import useInGameStore from "../stores/Kahoot/useInGameStore";
import Text from "../components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface";
import Spinner from "../components/UIComponents/Spinners/Spinner";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PlayerInGameStatus from "../components/utils/InGame/PlayerInGameStatus";
import useLobbySocketEvents from "../hooks/useLobbySocketEvents";
import SoundBank from "../singletons/SoundBank";
import useBackButtonConfirm from "../hooks/useBackButtonConfirm";
import { HubConnectionState } from "@microsoft/signalr";
import useProtectedGameplay from "../hooks/useProtectedGameplay";
import { useUserData } from "../hooks/useUserData";

const PlayPage = () => {
  // Hooks
  useUserData();
  useLobbySocketEvents();
  useBackButtonConfirm();

  // Global store state
  const { isHost, kahoot } = useInGameStore();
  
  const { ready } = useProtectedGameplay();
  
  if (!ready) {
    return null;
  }

  return (
    <div className={`relative bg-creator-classroom bg-center bg-cover bg-no-repeat h-screen overflow-hidden`}>
      <div className={`absolute inset-0 bg-black ${!isHost ? 'opacity-50' : 'opacity-5'}`}></div>
      {!isHost
        ? <GettingReadyToPlay />
        : <ShowQuestionTitleAndCountdownToHost
            kahootTitle={kahoot?.title}
          />
      }
    </div>
  )
}

const GettingReadyToPlay = () => {
  return (
    <div className="relative z-10 h-full flex justify-center items-center">
      <div id="get-ready" className="w-96 flex flex-col items-center">
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          useCase={UseCases.LONGTEXT}
          className="text-4xl mb-3"
        >
          Get Ready
        </Text>

        <Spinner className="mb-3 text-white" />

        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          useCase={UseCases.LONGTEXT}
          className="text-2xl"
        >
          Loading...
        </Text>

        <PlayerInGameStatus />
      </div>
    </div>
  )
}

interface ShowQuestionTitleAndCountdownToHostProps {
  kahootTitle: string | undefined;
}

const ShowQuestionTitleAndCountdownToHost = ({ kahootTitle }: ShowQuestionTitleAndCountdownToHostProps) => {
  const [showTitle, setShowTitle] = useState<boolean>(false);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);

  useEffect(() => {
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 2500);

    const countdownTimer = setTimeout(() => {
      setShowCountdown(true);
      setShowTitle(false);
    }, 6000);

    return () => {
      clearInterval(titleTimer);
      clearInterval(countdownTimer);
    }
  }, []);

  return (
    <div className="flex h-screen items-center">
      {showTitle && (
        <motion.div
          id="kahoot-name-label"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.68, -0.55, 0.27, 1.55] }}
          className="flex-1 bg-white text-center py-6 z-10"
        >
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.GRAY}
            useCase={UseCases.LONGTEXT}
            className="text-4xl"
          >
            {kahootTitle}
          </Text>
        </motion.div>
      )}

      {showCountdown && (
        <SquareCountdownTimer />
      )}
    </div>
  )
}

const SquareCountdownTimer = () => {
  // Global store state
  const { signalRConnection, lobbyId, isHost, questionIndex } = useInGameStore();

  // Local component state
  const [countDisplay, setCountDisplay] = useState<number>(3);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!hasStarted) {
      const initialTimer = setTimeout(() => {
        setHasStarted(true);
      }, 500);

      return () => {
        clearTimeout(initialTimer);
      }
    }

    if (hasStarted) {
      if (countDisplay > 0) {
        SoundBank.playTick();
        
        const countTimer = setTimeout(() => {
          setCountDisplay(countDisplay - 1);
        }, 1000);

        return () => {
          clearTimeout(countTimer);
        }
      } else {
        SoundBank.playWhoosh();

        const countTimer = setTimeout(async () => {
          if (isHost && signalRConnection !== null && signalRConnection.state === HubConnectionState.Connected) {
            await signalRConnection.invoke('StartRound', lobbyId, questionIndex);
          }
        }, 500);

        return () => {
          clearTimeout(countTimer);
        }
      }
    }
  }, [countDisplay, hasStarted])

  return (
    <div className="w-full flex justify-center items-center relative">
      <motion.div
        id="kahoot-name-label"
        className="bg-purple-900 w-48 h-48"
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{
          scale: countDisplay !== 0 ? 1 : 0,
          opacity: countDisplay !== 0 ? 1 : 0,
          rotate: countDisplay === 3
            ? 0 :
            countDisplay === 2
              ? 45 :
              countDisplay === 1
                ? 90 : 0
        }}
        transition={{ duration: 0.5, ease: [0.68, -0.55, 0.27, 1.55] }}
      >
      </motion.div>

      <motion.div
        className="absolute inset-0 flex justify-center items-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: countDisplay !== 0 ? 1 : 0,
          opacity: countDisplay !== 0 ? 1 : 0
        }}
        transition={{ duration: 0.5, ease: [0.68, -0.55, 0.27, 1.55] }}
      >
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          useCase={UseCases.LONGTEXT}
          className="text-6xl"
        >
          {countDisplay}
        </Text>
      </motion.div>
    </div>
  )
}


export default PlayPage;
