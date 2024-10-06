'use client'

import { useRouter } from "next/navigation";
import useInGameStore from "../stores/Kahoot/useInGameStore";
import Text from "../components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface";
import Spinner from "../components/UIComponents/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PlayPage = () => {
  // Global store state
  const { signalRConnection, isHost } = useInGameStore();
  const router = useRouter();

  useEffect(() => {
    if (signalRConnection) {
      signalRConnection.on('RoundOfQuestionsStarted', () => {
        router.push('/gameblock');
      })
    }
  }, []);

  return (
    <div className={`relative bg-creator-classroom bg-center bg-cover bg-no-repeat h-screen overflow-hidden`}>
      <div className={`absolute inset-0 bg-black ${!isHost ? 'opacity-50' : 'opacity-5'}`}></div>
      {!isHost
        ? <GettingReadyToPlay />
        : <ShowQuestionTitleAndCountdownToHost />
      }
    </div>
  )
}

const GettingReadyToPlay = () => {
  const { currentPlayer } = useInGameStore();
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

        <Spinner className="mb-3" />

        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          useCase={UseCases.LONGTEXT}
          className="text-2xl"
        >
          Loading...
        </Text>

        <div className="get-ready-footer absolute bottom-0 w-full bg-white">
          {currentPlayer.id === "" && (
            <div className="flex justify-between py-2 px-3">
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faUser}
                  size={"2xl"}
                  className="mr-2"
                />
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-xl"
                >
                  Testing
                </Text>
              </div>

              <div className="get-ready-points-indicator bg-purple-800 px-2 py-1 rounded-md">
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.WHITE}
                  useCase={UseCases.LONGTEXT}
                  className="text-xl"
                >
                  0 points
                </Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ShowQuestionTitleAndCountdownToHost = () => {
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
            Kahoot title
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
  const { signalRConnection, lobbyId } = useInGameStore();

  // Local component state
  const [countDisplay, setCountDisplay] = useState<number>(3);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

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
        const countTimer = setTimeout(() => {
          setCountDisplay(countDisplay - 1);
        }, 1000);
  
        return () => {
          clearTimeout(countTimer);
        }
      } else {
        const countTimer = setTimeout(() => {
          if (signalRConnection) {
            signalRConnection.invoke('StartingRoundOfQuestions', lobbyId);
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
